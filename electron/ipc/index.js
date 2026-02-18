const { ipcMain } = require("electron");

// Import handlers
const setupAppIpcHandlers = require("./handlers/app");
const setupAppLogIpcHandlers = require("./handlers/appLog");
const setupAzureWorkItensIpcHandlers = require("./handlers/azureWorkItens");
const setupCommandIpcHandlers = require("./handlers/command");
const setupGlobalNotesIpcHandlers = require("./handlers/globalNotes");
const setupIaCacheIpcHandlers = require("./handlers/iaCache");
const setupIntegrationConfigIpcHandlers = require("./handlers/integrationConfig");
const setupSecurityConfigIpcHandlers = require("./handlers/securityConfig");
const setupUserProfileIpcHandlers = require("./handlers/userProfile");

function setupIpcHandlers() {
  setupAppIpcHandlers();
  setupAppLogIpcHandlers();
  setupAzureWorkItensIpcHandlers();
  setupCommandIpcHandlers();
  setupGlobalNotesIpcHandlers();
  setupIaCacheIpcHandlers();
  setupIntegrationConfigIpcHandlers();
  setupSecurityConfigIpcHandlers();
  setupUserProfileIpcHandlers();
}

module.exports = setupIpcHandlers;