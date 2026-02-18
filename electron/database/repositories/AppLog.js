const db = require("../connection");

class AppLogRepository {
  async getAppLogsForApp(app_id) {
    return db("app_logs")
      .where({ app_id })
      .select("*")
      .orderBy("timestamp", "desc");
  }

  async addAppLog(log) {
    return db("app_logs").insert({
      id: log.id,
      app_id: log.app_id,
      timestamp: log.timestamp,
      message: log.message,
      type: log.type,
    });
  }

  async clearAppLogs(app_id) {
    return db("app_logs").where({ app_id }).del();
  }
}

module.exports = new AppLogRepository();
