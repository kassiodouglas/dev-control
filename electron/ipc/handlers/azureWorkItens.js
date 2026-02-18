const { ipcMain } = require("electron");
const repository = require("../../database/repository");

function setupAzureWorkItensIpcHandlers() {
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
}

module.exports = setupAzureWorkItensIpcHandlers;