const { ipcMain } = require("electron");
const repository = require("../../database/repository");

function setupAppLogIpcHandlers() {
  ipcMain.handle("get-app-logs-for-app", async (event, appId) => {
    return repository.getAppLogsForApp(appId);
  });

  ipcMain.handle("add-app-log", async (event, log) => {
    return repository.addAppLog(log);
  });

  ipcMain.handle("clear-app-logs", async (event, appId) => {
    return repository.clearAppLogs(appId);
  });
}

module.exports = setupAppLogIpcHandlers;