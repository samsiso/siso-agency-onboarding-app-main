const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  
  // App controls
  minimize: () => ipcRenderer.invoke('app:minimize'),
  maximize: () => ipcRenderer.invoke('app:maximize'),
  close: () => ipcRenderer.invoke('app:close'),
  
  // System info
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  
  // File operations (if needed in the future)
  openFile: () => ipcRenderer.invoke('file:open'),
  saveFile: (data) => ipcRenderer.invoke('file:save', data),
});