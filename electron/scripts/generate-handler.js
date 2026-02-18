// electron/scripts/generate-handler.js

const fs = require("fs");
const path = require("path");

// Helper functions for string manipulation (copied from original generate-module.js)
function toPascalCase(str) {
  return str
    .replace(/(?:^|-|_|\s+)([a-z0-9])/g, (_, char) => char.toUpperCase())
    .replace(/\s+/g, "");
}

function toCamelCase(str) {
  return str.replace(/(?:^|-|_|\s+)([a-z0-9])/g, (_, char, index) => {
    return index === 0 ? char.toLowerCase() : char.toUpperCase();
  }).replace(/\s+/g, "");
}

function toKebabCase(str) {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/_/, "-");
}

async function generateHandler(moduleNameInput) {
  if (!moduleNameInput) {
    console.error("Uso: node generate-handler.js <NomeDoModulo>");
    process.exit(1);
  }

  const ModuleName = toPascalCase(moduleNameInput);
  const moduleName = toCamelCase(moduleNameInput);
  const channelPrefix = toKebabCase(moduleNameInput);

  console.log(`Gerando Handler IPC para: ${ModuleName}...`);

  const templatesDir = path.join(__dirname, "..", "templates");
  const handlersDir = path.join(__dirname, "..", "ipc", "handlers");
  const repositoriesDir = path.join(__dirname, "..", "database", "repositories"); // Needed for relative path

  // Ensure directories exist
  if (!fs.existsSync(handlersDir)) {
    fs.mkdirSync(handlersDir, { recursive: true });
  }

  // --- Generate Handler ---
  const handlerTemplatePath = path.join(templatesDir, "handler.js.template");
  const handlerOutputPath = path.join(handlersDir, `${moduleName}.js`);
  
  // Assume repository will exist at this path, relative to the handler
  const repoPath = path.join(repositoriesDir, `${ModuleName}.js`);
  const relativeRepoPath = path.relative(handlersDir, repoPath).replace(/\\/g, "/"); // Ensure forward slashes

  let handlerContent = fs.readFileSync(handlerTemplatePath, "utf8");
  handlerContent = handlerContent
    .replace(/{{ModuleName}}/g, ModuleName)
    .replace(/{{moduleName}}/g, moduleName)
    .replace(/{{repositoryPath}}/g, relativeRepoPath)
    .replace(/{{channelPrefix}}/g, channelPrefix);
  fs.writeFileSync(handlerOutputPath, handlerContent);
  console.log(`Criado: ${handlerOutputPath}`);

  // --- Instruções para atualização do IPC Index (electron/ipc/index.js) ---
  // Corrected line: use backticks for the template literal, and single quotes for the JS string within it
  const handlerImportLine = `const setup${ModuleName}IpcHandlers = require('./handlers/${moduleName}');`; // Corrected
  const handlerSetupCall = `  setup${ModuleName}IpcHandlers();`; // Indented

  console.log("\n--- Ações Manuais Necessárias ---");
  console.log("Por favor, adicione as seguintes linhas em `electron/ipc/index.js`:");
  console.log(`1. Na seção de imports de handlers:`);
  console.log(`   ${handlerImportLine}`);
  console.log(`2. Dentro da função \`setupIpcHandlers()\`:`);
  console.log(`   ${handlerSetupCall}`);
  console.log("---------------------------------");

  console.log(`\nHandler IPC \'${ModuleName}\' gerado com sucesso!`);
  console.log(`Não se esqueça de revisar o arquivo gerado e implementar a lógica específica.`);
}

// Get module name from command line arguments
const args = process.argv.slice(2);
generateHandler(args[0]);
