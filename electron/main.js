const { app, BrowserWindow } = require("electron")
const MainWindow = require("./Domains/Window/MainWindow")
const db = require("./database/connection");
const setupIpcHandlers = require("./ipc/index"); // Importar setupIpcHandlers

process.env.NODE_ENV = "development"; // Ensure NODE_ENV is set for development

// Hot reloading for Electron main process
try {
  require("electron-reloader")({ watchRenderer: false });
} catch (_) {console.log("electron-reloader not loaded")}

app.whenReady().then(async () => {
  try {
    await db.migrate.latest();
    console.log("Migrations ran successfully!");
    setupIpcHandlers();
  } catch (error) {
    console.error("Error running migrations:", error);
  }

  new MainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      new MainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
