const db = require("../connection");

class CommandRepository {
  async getSavedCommandsForApp(app_id) {
    return db("saved_commands").where({ app_id }).select("*");
  }

  async addSavedCommand(command) {
    return db("saved_commands").insert({
      id: command.id,
      app_id: command.app_id,
      name: command.name,
      command: command.command,
    });
  }

  async deleteSavedCommand(id) {
    return db("saved_commands").where({ id }).del();
  }
}

module.exports = new CommandRepository();
