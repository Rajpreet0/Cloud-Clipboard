import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { isDev } from "./util.js";

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
