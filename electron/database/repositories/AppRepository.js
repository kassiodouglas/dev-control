const db = require("../connection");

class AppRepository {
  async getApps() {
    return db("apps").select("*");
  }

  async addApp(app) {
    await db("apps").insert({
      id: app.id,
      name: app.name,
      path: app.path,
      host: app.host,
      port: app.port,
      startCommand: app.startCommand,
      branch: app.branch,
      availableBranches: JSON.stringify(app.availableBranches),
      status: app.status,
      notes: app.notes,
    });
    return app;
  }

  async updateApp(id, updates) {
    const dataToUpdate = { ...updates };
    if (dataToUpdate.availableBranches) {
      dataToUpdate.availableBranches = JSON.stringify(
        dataToUpdate.availableBranches
      );
    }
    return db("apps").where({ id }).update(dataToUpdate);
  }

  async deleteApp(id) {
    return db("apps").where({ id }).del();
  }
}

module.exports = new AppRepository();
