const { ipcMain } = require("electron");
const repository = require("../../database/repository");

function setupUserProfileIpcHandlers() {
  ipcMain.handle("get-user-profile", async () => {
    return repository.getUserProfile();
  });

  ipcMain.handle("save-user-profile", async (event, profile) => {
    return repository.saveUserProfile(profile);
  });
}

module.exports = setupUserProfileIpcHandlers;