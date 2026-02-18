const db = require("../connection");

class IaCacheRepository {
  async getAICacheEntry(work_item_id) {
    return db("ai_cache").where({ work_item_id }).first();
  }

  async saveAICacheEntry(entry) {
    const existing = await this.getAICacheEntry(entry.work_item_id);
    const data = {
      work_item_id: entry.work_item_id,
      summary: entry.summary || null,
      suggestions: entry.suggestions ? JSON.stringify(entry.suggestions) : null,
    };
    if (existing) {
      return db("ai_cache")
        .where({ work_item_id: entry.work_item_id })
        .update(data);
    } else {
      return db("ai_cache").insert(data);
    }
  }

  async clearAICache(work_item_id) {
    return db("ai_cache").where({ work_item_id }).del();
  }
}

module.exports = new IaCacheRepository();
