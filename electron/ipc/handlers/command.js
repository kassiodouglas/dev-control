const { ipcMain } = require("electron");
const repository = require("../../database/repositories/CommandRepository");

function setupCommandIpcHandlers() {
  ipcMain.handle("get-saved-commands-for-app", async (event, appId) => {
    return repository.getSavedCommandsForApp(appId);
  });

  ipcMain.handle("add-saved-command", async (event, command) => {
    return repository.addSavedCommand(command);
  });

  ipcMain.handle("delete-saved-command", async (event, id) => {
    return repository.deleteSavedCommand(id);
  });
}

module.exports = setupCommandIpcHandlers;