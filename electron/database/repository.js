const db = require('./connection');

class Repository {
  // --- Apps ---
  async getApps() {
    return db('apps').select('*');
  }

  async addApp(app) {
    await db('apps').insert({
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
    return app; // Return the added app for consistency
  }

  async updateApp(id, updates) {
    // Handle special fields like availableBranches which need JSON stringification
    const dataToUpdate = { ...updates };
    if (dataToUpdate.availableBranches) {
      dataToUpdate.availableBranches = JSON.stringify(dataToUpdate.availableBranches);
    }
    return db('apps').where({ id }).update(dataToUpdate);
  }

  async deleteApp(id) {
    return db('apps').where({ id }).del();
  }

  // --- Saved Commands ---
  async getSavedCommandsForApp(app_id) {
    return db('saved_commands').where({ app_id }).select('*');
  }

  async addSavedCommand(command) {
    return db('saved_commands').insert({
      id: command.id,
      app_id: command.app_id,
      name: command.name,
      command: command.command,
    });
  }

  async deleteSavedCommand(id) {
    return db('saved_commands').where({ id }).del();
  }

  // --- App Logs ---
  async getAppLogsForApp(app_id) {
    return db('app_logs').where({ app_id }).select('*').orderBy('timestamp', 'desc');
  }

  async addAppLog(log) {
    return db('app_logs').insert({
      id: log.id,
      app_id: log.app_id,
      timestamp: log.timestamp,
      message: log.message,
      type: log.type,
    });
  }

  async clearAppLogs(app_id) {
    return db('app_logs').where({ app_id }).del();
  }

  // --- Global Notes ---
  async getGlobalNotes() {
    return db('global_notes').select('*');
  }

  async addGlobalNote(note) {
    return db('global_notes').insert({
      id: note.id,
      title: note.title,
      content: note.content,
      updatedAt: note.updatedAt,
    });
  }

  async updateGlobalNote(id, updates) {
    return db('global_notes').where({ id }).update(updates);
  }

  async deleteGlobalNote(id) {
    return db('global_notes').where({ id }).del();
  }

  // --- User Profile ---
  async getUserProfile() {
    return db('user_profile').first();
  }

  async saveUserProfile(profile) {
    const existing = await this.getUserProfile();
    if (existing) {
      return db('user_profile').where({ id: existing.id }).update(profile);
    } else {
      return db('user_profile').insert({ id: 'user-profile', ...profile });
    }
  }

  // --- Security Config ---
  async getSecurityConfig() {
    return db('security_config').first();
  }

  async saveSecurityConfig(config) {
    const existing = await this.getSecurityConfig();
    if (existing) {
      return db('security_config').where({ id: existing.id }).update(config);
    } else {
      return db('security_config').insert({ id: 'security-config', ...config });
    }
  }

  // --- Integration Config ---
  async getIntegrationConfig() {
    return db('integration_config').first();
  }

  async saveIntegrationConfig(config) {
    const existing = await this.getIntegrationConfig();
    if (existing) {
      return db('integration_config').where({ id: existing.id }).update(config);
    } else {
      return db('integration_config').insert({ id: 'integration-config', ...config });
    }
  }

  // --- Azure Work Items ---
  async getAzureWorkItems() {
    return db('azure_work_items').select('*');
  }

  async addOrUpdateAzureWorkItem(item) {
    const existing = await db('azure_work_items').where({ id: item.id }).first();
    const data = {
      id: item.id,
      title: item.title,
      description: item.description,
      state: item.state,
      assignedTo: item.assignedTo,
      avatarUrl: item.avatarUrl,
      type: item.type,
      url: item.url,
      completedWork: item.completedWork,
      app_id: item.appId || null, // Assuming app_id might come from frontend
    };
    if (existing) {
      return db('azure_work_items').where({ id: item.id }).update(data);
    } else {
      return db('azure_work_items').insert(data);
    }
  }

  async deleteAzureWorkItem(id) {
    return db('azure_work_items').where({ id }).del();
  }

  async linkWorkItemToApp(workItemId, appId) {
    return db('azure_work_items').where({ id: workItemId }).update({ app_id: appId });
  }

  // --- AI Cache ---
  async getAICacheEntry(work_item_id) {
    return db('ai_cache').where({ work_item_id }).first();
  }

  async saveAICacheEntry(entry) {
    const existing = await this.getAICacheEntry(entry.work_item_id);
    const data = {
      work_item_id: entry.work_item_id,
      summary: entry.summary || null,
      suggestions: entry.suggestions ? JSON.stringify(entry.suggestions) : null,
    };
    if (existing) {
      return db('ai_cache').where({ work_item_id: entry.work_item_id }).update(data);
    } else {
      return db('ai_cache').insert(data);
    }
  }

  async clearAICache(work_item_id) {
    return db('ai_cache').where({ work_item_id }).del();
  }
}

module.exports = new Repository();
