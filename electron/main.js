const { app, BrowserWindow } = require("electron")
const MainWindow = require("./Domains/Window/MainWindow")

app.whenReady().then(() => {
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