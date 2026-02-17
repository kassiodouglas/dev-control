const { app, BrowserWindow } = require("electron")
const MainWindow = require("./Domains/Window/MainWindow")
const db = require("./database/connection");

app.whenReady().then(async () => {
  try {
    await db.migrate.latest();
    console.log("Migrations ran successfully!");
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