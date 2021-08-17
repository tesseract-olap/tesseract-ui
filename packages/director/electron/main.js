const {app, BrowserWindow} = require("electron");
const path = require("path");

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/** */
function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.resolve(__dirname, "..", "assets", "tesseract.ico"),
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js")
    }
  });

  const pagePath = path.resolve(__dirname, "main.html");
  win.loadFile(pagePath);
}
