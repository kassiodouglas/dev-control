const { ipcMain } = require("electron");
const repository = require("../../database/repositories/UserProfileRepository");

function setupUserProfileIpcHandlers() {
  ipcMain.handle("get-user-profile", async () => {
    return repository.getUserProfile();
  });

  ipcMain.handle("save-user-profile", async (event, profile) => {
    return repository.saveUserProfile(profile);
  });

  ipcMain.handle("config:updateProfile", async (event, profile) => {
    // Rename 'avatar' to 'avatarUrl' to match the database schema
    if (profile.avatar !== undefined) {
      profile.avatarUrl = profile.avatar;
      delete profile.avatar;
    }
    return repository.saveUserProfile(profile);
  });
}

module.exports = setupUserProfileIpcHandlers;