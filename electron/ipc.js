const { ipcMain } = require("electron");
const repository = require("./database/repository");

function setupIpcHandlers() {
  // --- Apps ---
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

  // --- Saved Commands ---
  ipcMain.handle("get-saved-commands-for-app", async (event, appId) => {
    return repository.getSavedCommandsForApp(appId);
  });

  ipcMain.handle("add-saved-command", async (event, command) => {
    return repository.addSavedCommand(command);
  });

  ipcMain.handle("delete-saved-command", async (event, id) => {
    return repository.deleteSavedCommand(id);
  });

  // --- App Logs ---
  ipcMain.handle("get-app-logs-for-app", async (event, appId) => {
    return repository.getAppLogsForApp(appId);
  });

  ipcMain.handle("add-app-log", async (event, log) => {
    return repository.addAppLog(log);
  });

  ipcMain.handle("clear-app-logs", async (event, appId) => {
    return repository.clearAppLogs(appId);
  });

  // --- Global Notes ---
  ipcMain.handle("get-global-notes", async () => {
    return repository.getGlobalNotes();
  });

  ipcMain.handle("add-global-note", async (event, note) => {
    return repository.addGlobalNote(note);
  });

  ipcMain.handle("update-global-note", async (event, id, updates) => {
    return repository.updateGlobalNote(id, updates);
  });

  ipcMain.handle("delete-global-note", async (event, id) => {
    return repository.deleteGlobalNote(id);
  });

  // --- User Profile ---
  ipcMain.handle("get-user-profile", async () => {
    return repository.getUserProfile();
  });

  ipcMain.handle("save-user-profile", async (event, profile) => {
    return repository.saveUserProfile(profile);
  });

  // --- Security Config ---
  ipcMain.handle("get-security-config", async () => {
    return repository.getSecurityConfig();
  });

  ipcMain.handle("save-security-config", async (event, config) => {
    return repository.saveSecurityConfig(config);
  });

  // --- Integration Config ---
  ipcMain.handle("get-integration-config", async () => {
    return repository.getIntegrationConfig();
  });

  ipcMain.handle("save-integration-config", async (event, config) => {
    return repository.saveIntegrationConfig(config);
  });

  // --- Azure Work Items ---
  ipcMain.handle("get-azure-work-items", async () => {
    return repository.getAzureWorkItems();
  });

  ipcMain.handle("add-or-update-azure-work-item", async (event, item) => {
    return repository.addOrUpdateAzureWorkItem(item);
  });

  ipcMain.handle("delete-azure-work-item", async (event, id) => {
    return repository.deleteAzureWorkItem(id);
  });

  ipcMain.handle("link-work-item-to-app", async (event, workItemId, appId) => {
    return repository.linkWorkItemToApp(workItemId, appId);
  });

  // --- AI Cache ---
  ipcMain.handle("get-ai-cache-entry", async (event, workItemId) => {
    const entry = await repository.getAICacheEntry(workItemId);
    if (entry && entry.suggestions) {
      entry.suggestions = JSON.parse(entry.suggestions); // Parse back to object
    }
    return entry;
  });

  ipcMain.handle("save-ai-cache-entry", async (event, entry) => {
    return repository.saveAICacheEntry(entry);
  });

  ipcMain.handle("clear-ai-cache", async (event, workItemId) => {
    return repository.clearAICache(workItemId);
  });
}

module.exports = setupIpcHandlers;
