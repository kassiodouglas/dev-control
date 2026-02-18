// electron/scripts/generate-migration.js

const fs = require("fs");
const path = require("path");

// Helper functions for string manipulation (copied from original generate-module.js)
function toSnakeCase(str) {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1_$2")
    .toLowerCase();
}

function toPluralSnakeCase(str) {
  let snake = toSnakeCase(str);
  if (snake.endsWith("s")) {
    return snake + "es";
  }
  return snake + "s";
}

function getCurrentTimestamp() {
  const date = new Date();
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
    date.getHours().toString().padStart(2, "0"),
    date.getMinutes().toString().padStart(2, "0"),
    date.getSeconds().toString().padStart(2, "0"),
  ].join("");
}

async function generateMigration(moduleNameInput) {
  if (!moduleNameInput) {
    console.error("Uso: node generate-migration.js <NomeDoModulo>");
    process.exit(1);
  }

  const tableName = toPluralSnakeCase(moduleNameInput);

  console.log(`Gerando Migration para a tabela: ${tableName}...`);

  const templatesDir = path.join(__dirname, "..", "templates");
  const migrationsDir = path.join(__dirname, "..", "database", "migrations");

  // Ensure directories exist
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }

  // --- Generate Migration ---
  const migrationTemplatePath = path.join(templatesDir, "migration.js.template");
  const migrationOutputPath = path.join(migrationsDir, `${getCurrentTimestamp()}_create_${tableName}_table.js`);
  let migrationContent = fs.readFileSync(migrationTemplatePath, "utf8");
  migrationContent = migrationContent
    .replace(/{{tableName}}/g, tableName);
  fs.writeFileSync(migrationOutputPath, migrationContent);
  console.log(`Criado: ${migrationOutputPath}`);

  console.log(`\nMigration para a tabela \'${tableName}\' gerada com sucesso!`);
  console.log(`Não se esqueça de revisar o arquivo gerado e definir as colunas da tabela.`);
}

// Get module name from command line arguments
const args = process.argv.slice(2);
generateMigration(args[0]);
