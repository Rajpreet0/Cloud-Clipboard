import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";
import { clipboard } from "electron";

function getAuthFilePath() {
    return path.join(app.getPath("userData"), "auth.json");
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
});

// Clipboard Watch
let lastText = "";
let lastImageBase64 = "";

setInterval(() => {
  const text = clipboard.readText();
  const image = clipboard.readImage();

  // ==== IMAGE ====
  if (!image.isEmpty()) {
    const png = image.toPNG();
    const base64 = png.toString("base64");

    if (base64 === lastImageBase64) return;
    lastImageBase64 = base64;
    lastText = ""; // optional: reset text cache

    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send("clipboard:new", {
        type: "image",
        data: base64
      });
    });
    return;
  }

  // ==== TEXT ====
  if (text && text !== lastText) {
    lastText = text;
    lastImageBase64 = ""; // optional: reset image cache

    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send("clipboard:new", {
        type: "text",
        data: text
      });
    });
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
