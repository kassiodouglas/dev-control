const { ipcMain } = require("electron");
const repository = require("../../database/repositories/GlobalNotesRepository");

function setupGlobalNotesIpcHandlers() {
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
}

module.exports = setupGlobalNotesIpcHandlers;