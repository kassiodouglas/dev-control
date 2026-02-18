// electron/scripts/generate-repository.js

const fs = require('fs');
const path = require('path');

// Helper functions for string manipulation (copied from original generate-module.js)
function toPascalCase(str) {
  return str
    .replace(/(?:^|-|_|\s+)([a-z0-9])/g, (_, char) => char.toUpperCase())
    .replace(/\s+/g, '');
}

function toCamelCase(str) {
  return str.replace(/(?:^|-|_|\s+)([a-z0-9])/g, (_, char, index) => {
    return index === 0 ? char.toLowerCase() : char.toUpperCase();
  }).replace(/\s+/g, '');
}

function toSnakeCase(str) {
  return str
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2')
    .toLowerCase();
}

function toPluralSnakeCase(str) {
  let snake = toSnakeCase(str);
  if (snake.endsWith('s')) {
    return snake + 'es';
  }
  return snake + 's';
}

async function generateRepository(moduleNameInput) {
  if (!moduleNameInput) {
    console.error('Uso: node generate-repository.js <NomeDoModulo>');
    process.exit(1);
  }

  const ModuleName = toPascalCase(moduleNameInput);
  const moduleName = toCamelCase(moduleNameInput);
  const tableName = toPluralSnakeCase(moduleNameInput);

  console.log(`Gerando Repositório para: ${ModuleName}...`);

  const templatesDir = path.join(__dirname, '..', 'templates');
  const repositoriesDir = path.join(__dirname, '..', 'database', 'repositories');

  // Ensure directories exist
  if (!fs.existsSync(repositoriesDir)) {
    fs.mkdirSync(repositoriesDir, { recursive: true });
  }

  // --- Generate Repository ---
  const repoTemplatePath = path.join(templatesDir, 'repository.js.template');
  const repoOutputPath = path.join(repositoriesDir, `${ModuleName}.js`);
  let repoContent = fs.readFileSync(repoTemplatePath, 'utf8');
  repoContent = repoContent
    .replace(/{{ModuleName}}/g, ModuleName)
    .replace(/{{moduleName}}/g, moduleName)
    .replace(/{{tableName}}/g, tableName);
  fs.writeFileSync(repoOutputPath, repoContent);
  console.log(`Criado: ${repoOutputPath}`);

  console.log(`\nRepositório '${ModuleName}' gerado com sucesso!`);
  console.log(`Não se esqueça de revisar o arquivo gerado e implementar a lógica específica.`);
}

// Get module name from command line arguments
const args = process.argv.slice(2);
generateRepository(args[0]);
