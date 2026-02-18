const { ipcMain } = require("electron");
const repository = require("../../database/repositories/AppRepository");

function setupAppIpcHandlers() {
  ipcMain.handle("get-apps", async () => {
    const apps = await repository.getApps();
    return apps.map(app => ({
      ...app,
      availableBranches: JSON.parse(app.availableBranches) // Parse back to array
    }));
  });

  ipcMain.handle("add-app", async (event, app) => {
    return repository.addApp(app);
  });

  ipcMain.handle("update-app", async (event, id, updates) => {
    return repository.updateApp(id, updates);
  });

  ipcMain.handle("delete-app", async (event, id) => {
    return repository.deleteApp(id);
  });
}

module.exports = setupAppIpcHandlers;