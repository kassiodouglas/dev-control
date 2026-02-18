const db = require("../connection");

class USerProfileRepository {
  async getUserProfile() {
    return db("user_profile").first();
  }

  async saveUserProfile(profile) {
    const existing = await this.getUserProfile();
    if (existing) {
      return db("user_profile").where({ id: existing.id }).update(profile);
    } else {
      return db("user_profile").insert({ id: "user-profile", ...profile });
    }
  }
}

module.exports = new USerProfileRepository();
