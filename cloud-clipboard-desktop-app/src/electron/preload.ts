import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("secureStore", {
    saveAuth: (tokenObj: { authToken: string, deviceId: string }) => ipcRenderer.invoke("save-auth", tokenObj),
    loadAuth: () => ipcRenderer.invoke("load-auth"),
    clearAuth: () => ipcRenderer.invoke("clear-auth"),
});

contextBridge.exposeInMainWorld("clips", {
  onNew: (callback: (payload:{type:string;data:string}) => void) => {
    const listener = (_event: any, payload: {type:string;data:string}) => callback(payload);
    ipcRenderer.on("clipboard:new", listener);
    return listener;   
  },
  offNew: (listener: (...args:any[]) => void) => {
    ipcRenderer.removeListener("clipboard:new", listener);
  }
});