const { ipcMain } = require("electron");
const appRepository = require("../../database/repositries/AppRepository");

function setupAppIpcHandlers() {
  ipcMain.handle("get-apps", async () => {
    const apps = await appRepository.getApps();
    return apps.map(app => ({
      ...app,
      availableBranches: JSON.parse(app.availableBranches) // Parse back to array
    }));
  });

  ipcMain.handle("add-app", async (event, app) => {
    return appRepository.addApp(app);
  });

  ipcMain.handle("update-app", async (event, id, updates) => {
    return appRepository.updateApp(id, updates);
  });

  ipcMain.handle("delete-app", async (event, id) => {
    return appRepository.deleteApp(id);
  });
}

module.exports = setupAppIpcHandlers;