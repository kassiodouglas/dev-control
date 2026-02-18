const db = require("../connection");

class IntegrationConfigRepository {
  async getIntegrationConfig() {
    return db("integration_config").first();
  }

  async saveIntegrationConfig(config) {
    const existing = await this.getIntegrationConfig();
    if (existing) {
      return db("integration_config").where({ id: existing.id }).update(config);
    } else {
      return db("integration_config").insert({
        id: "integration-config",
        ...config,
      });
    }
  }
}

module.exports = new IntegrationConfigRepository();
