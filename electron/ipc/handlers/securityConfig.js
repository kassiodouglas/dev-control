const { ipcMain } = require("electron");
const repository = require("../../database/repository");

function setupSecurityConfigIpcHandlers() {
  ipcMain.handle("get-security-config", async () => {
    return repository.getSecurityConfig();
  });

  ipcMain.handle("save-security-config", async (event, config) => {
    return repository.saveSecurityConfig(config);
  });
}

module.exports = setupSecurityConfigIpcHandlers;