const db = require("../connection");

class GlobalNotesRepository {
  async getGlobalNotes() {
    return db("global_notes").select("*");
  }

  async addGlobalNote(note) {
    return db("global_notes").insert({
      id: note.id,
      title: note.title,
      content: note.content,
      updatedAt: note.updatedAt,
    });
  }

  async updateGlobalNote(id, updates) {
    return db("global_notes").where({ id }).update(updates);
  }

  async deleteGlobalNote(id) {
    return db("global_notes").where({ id }).del();
  }
}

module.exports = new GlobalNotesRepository();
