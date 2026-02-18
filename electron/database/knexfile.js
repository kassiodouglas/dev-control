const path = require("path");

module.exports = (app = null) => {
  const config = {
    development: {
      client: "sqlite3",
      connection: {
        filename: path.resolve(__dirname, "database", "database.sqlite")
      },
      useNullAsDefault: true,
      migrations: {
        directory: path.resolve(__dirname, "database", "migrations")
      }
    },
    production: {
      client: "sqlite3",
      connection: {
        filename: app && app.getPath ? path.join(app.getPath("userData"), "database.sqlite") : path.resolve(__dirname, "database", "database.sqlite")
      },
      useNullAsDefault: true,
      migrations: {
        directory: path.resolve(__dirname, "database", "migrations")
      }
    }
  };

  return config;
};