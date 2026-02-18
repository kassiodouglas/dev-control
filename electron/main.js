const { app, BrowserWindow } = require("electron")
const MainWindow = require("./Domains/Window/MainWindow")
const db = require("./database/connection");
const setupIpcHandlers = require("./ipc"); // Importar setupIpcHandlers

app.whenReady().then(async () => {
  try {
    await db.migrate.latest();
    console.log("Migrations ran successfully!");
    setupIpcHandlers(); // Inicializar IPC handlers
  } catch (error) {
    console.error("Error running migrations:", error);
  }

  new MainWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      new MainWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
