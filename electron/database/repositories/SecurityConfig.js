const db = require("../connection");

class SecurityConfigRepository {
  async getSecurityConfig() {
    return db("security_config").first();
  }

  async saveSecurityConfig(config) {
    const existing = await this.getSecurityConfig();
    if (existing) {
      return db("security_config").where({ id: existing.id }).update(config);
    } else {
      return db("security_config").insert({ id: "security-config", ...config });
    }
  }
}

module.exports = new SecurityConfigRepository();
