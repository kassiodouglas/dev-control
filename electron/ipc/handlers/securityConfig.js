const { ipcMain } = require("electron");
const repository = require("../../database/repositories/SecurityConfigRepository");

function setupSecurityConfigIpcHandlers() {
  ipcMain.handle("config:hasSecurityPassword", async () => {
    const config = await repository.getSecurityConfig();
    return !!config && !!config.password; // Check if config exists and has a password
  });

  ipcMain.handle("config:setSecurityPassword", async (event, password) => {
    // In a real application, you would hash the password before saving.
    // For this example, we'll save it as-is (NOT RECOMMENDED FOR PRODUCTION).
    return repository.saveSecurityConfig({ password: password });
  });

  ipcMain.handle("config:verifySecurityPassword", async (event, password) => {
    const config = await repository.getSecurityConfig();
    // In a real application, you would compare the provided password with the hashed password.
    return !!config && config.password === password; // Basic comparison (NOT RECOMMENDED FOR PRODUCTION)
  });

  ipcMain.handle("config:isSetupComplete", async () => {
    return repository.isSetupComplete();
  });

  ipcMain.handle("config:completeSetup", async () => {
    return repository.completeSetup();
  });

  // Original handlers, keeping them for now
  ipcMain.handle("get-security-config", async () => {
    return repository.getSecurityConfig();
  });

  ipcMain.handle("save-security-config", async (event, config) => {
    return repository.saveSecurityConfig(config);
  });
}

module.exports = setupSecurityConfigIpcHandlers;
