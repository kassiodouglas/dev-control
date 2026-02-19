const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  config: {
    hasSecurityPassword: () => ipcRenderer.invoke("config:hasSecurityPassword"),
    setSecurityPassword: (password) => ipcRenderer.invoke("config:setSecurityPassword", password),
    verifySecurityPassword: (password) => ipcRenderer.invoke("config:verifySecurityPassword", password),
    isSetupComplete: () => ipcRenderer.invoke("config:isSetupComplete"),
    updateProfile: (profile) => ipcRenderer.invoke("config:updateProfile", profile),
    updateIntegrations: (integrations) => ipcRenderer.invoke("config:updateIntegrations", integrations),
    completeSetup: () => ipcRenderer.invoke("config:completeSetup"),
  },
});
