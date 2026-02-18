const { ipcMain } = require("electron");
const repository = require("../../database/repositories/AICacheRepository");

function setupIaCacheIpcHandlers() {
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

module.exports = setupIaCacheIpcHandlers;