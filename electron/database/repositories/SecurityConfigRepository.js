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
      return db("security_config").insert({ id: "security-config", isEnabled: false, isLocked: false, ...config });
    }
  }

  async isSetupComplete() {
    const config = await this.getSecurityConfig();
    return !!config && config.isEnabled; // Using isEnabled to indicate setup completion
  }

  async completeSetup() {
    const existing = await this.getSecurityConfig();
    if (existing) {
      return db("security_config").where({ id: existing.id }).update({ isEnabled: true });
    } else {
      return db("security_config").insert({ id: "security-config", isEnabled: true, isLocked: false });
    }
  }
}

module.exports = new SecurityConfigRepository();
