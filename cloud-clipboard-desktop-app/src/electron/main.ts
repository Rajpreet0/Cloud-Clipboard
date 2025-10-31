import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";
import { clipboard } from "electron";

function getAuthFilePath() {
    return path.join(app.getPath("userData"), "auth.json");
}

function getAuthToken() {
  try {
    const file = getAuthFilePath();
    if (!fs.existsSync(file)) return null;
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    return data.authToken || null;
  } catch {
    return null;
  }
}

function createWindow(startURL: string) {
  const preloadPath = isDev()
    ? path.join(process.cwd(), "dist-electron/preload.js")
    : path.join(app.getAppPath(), "dist-electron/preload.js");

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: preloadPath,
    },
  });

  mainWindow.loadURL(startURL);
}

async function uploadClipToCloud(type: string, data: string) {
  const token = getAuthToken();
  if (!token) {
    console.warn("[CLOUD_SYNC] Kein Token vorhanden, Upload übersprungen.");
    return false;
  }

  try {
    await fetch("http://localhost:3000/api/clips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type, data }),
    });
    console.log("[CLOUD SYNC] Clip erfolgreich hochgeladen.");
    return true;
  } catch (err) {
    console.error("[CLOUD UPLOAD FAILED]", err);
    return false;
  }
}

app.on("ready", async () => {
  const authFile = getAuthFilePath();
  const hasAuth = fs.existsSync(authFile);

  let startPage: string;

  if (isDev()) {
    // Lokale React-Entwicklungsumgebung
    startPage = hasAuth
      ? "http://localhost:5123/#/dashboard"
      : "http://localhost:5123/#/pair";
  } else {
    // Produktions-Build
    const localPath = path.join(app.getAppPath(), "dist-react/index.html");
    startPage = hasAuth
      ? `file://${localPath}#/dashboard`
      : `file://${localPath}#/pair`;
  }

  createWindow(startPage);

  // =====================================================
  // ======= STRG + SHIFT + C → Copy + Cloud Upload ======
  // =====================================================
  globalShortcut.register("Control+Shift+C", async () => {
    try {
      console.log("[CLOUD COPY] Triggered => warte kurz, um OS-Kopie zu uebernehmen...");

      // Warte kurz (OS braucht etwas Zeit um die Kopie abzuschließen)
      await new Promise((r) => setTimeout(r, 200));

      const text = clipboard.readText();
      const image = clipboard.readImage();

      if (!text && image.isEmpty()) {
        console.warn("[CLOUD COPY] Kein Inhalt gefunden.");
        return;
      }

      let clipData;
      let type;

      if (!image.isEmpty()) {
        clipData = image.toPNG().toString("base64");
        type = "image";
      } else {
        clipData = text;
        type = "text";
      }

      // 1️⃣ An Renderer schicken (mit Cloud-Indikator)
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("clipboard:new", {
          type,
          data: clipData,
          cloudSynced: true,
        });
      });

      // 2️⃣ Cloud Upload
      const success = await uploadClipToCloud(type, clipData);
      if (success) {
        console.log("[CLOUD COPY] Upload success ");
      } else {
        console.warn("[CLOUD COPY] Upload failed ");
      }
    } catch (err) {
      console.error("[CLOUD COPY ERROR]", err);
    }
  });

  // Optional macOS Variante (CMD + SHIFT + C)
  globalShortcut.register("Command+Shift+C", async () => {
    try {
      await new Promise((r) => setTimeout(r, 200));
      const text = clipboard.readText();
      if (!text) return;

      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("clipboard:new", {
          type: "text",
          data: text,
          cloudSynced: true,
        });
      });

      const success = await uploadClipToCloud("text", text);
      if (success) console.log("[CLOUD COPY] via CMD+SHIFT+C → Upload success");
    } catch (err) {
      console.error("[CLOUD COPY ERROR]", err);
    }
  });
});

// Clipboard Watch
let lastText = "";
let lastImageBase64 = "";

setInterval(() => {
  try {
    const text = clipboard.readText();
    const image = clipboard.readImage();

    // === IMAGE ===
    if (!image.isEmpty()) {
      const base64 = image.toPNG().toString("base64");
      if (base64 === lastImageBase64) return;

      lastImageBase64 = base64;
      lastText = "";

      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("clipboard:new", { type: "image", data: base64 });
      });
      return;
    }

    // === TEXT ===
    if (text && text !== lastText) {
      lastText = text;
      lastImageBase64 = "";

      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("clipboard:new", { type: "text", data: text });
      });
    }
  } catch (err) {
    console.error("[CLIPBOARD WATCH ERROR]", err);
  }
}, 500);

// Save Token
ipcMain.handle("save-auth", async (_event, tokenObj) => {
    const file = getAuthFilePath();
    fs.writeFileSync(file, JSON.stringify(tokenObj), "utf-8");
    return true;
});

// Load Token
ipcMain.handle("load-auth", async () => {
    const file = getAuthFilePath();
    if(!fs.existsSync(file)) return null;
    const data = fs.readFileSync(file, "utf-8");
    return JSON.parse(data);
});

// Delete Token
ipcMain.handle("clear-auth", async () => {
    const file = getAuthFilePath();
    if (fs.existsSync(file)) fs.unlinkSync(file);
    return true;
})
