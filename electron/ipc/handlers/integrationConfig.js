const { ipcMain } = require("electron");
const repository = require("../../database/repositories/IntegrationConfigRepository");

function setupIntegrationConfigIpcHandlers() {
  ipcMain.handle("get-integration-config", async () => {
    return repository.getIntegrationConfig();
  });

  ipcMain.handle("save-integration-config", async (event, config) => {
    return repository.saveIntegrationConfig(config);
  });
}

module.exports = setupIntegrationConfigIpcHandlers;