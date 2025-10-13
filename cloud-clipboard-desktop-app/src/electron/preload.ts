import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("secureStore", {
    saveAuth: (tokenObj: { authToken: string, deviceId: string }) => ipcRenderer.invoke("save-auth", tokenObj),
    loadAuth: () => ipcRenderer.invoke("load-auth"),
    clearAuth: () => ipcRenderer.invoke("clear-auth"),
});