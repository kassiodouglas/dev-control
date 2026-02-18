const db = require("../connection");

class AzureWorkItensRepository {
  async getAzureWorkItems() {
    return db("azure_work_items").select("*");
  }

  async addOrUpdateAzureWorkItem(item) {
    const existing = await db("azure_work_items")
      .where({ id: item.id })
      .first();
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
      return db("azure_work_items").where({ id: item.id }).update(data);
    } else {
      return db("azure_work_items").insert(data);
    }
  }

  async deleteAzureWorkItem(id) {
    return db("azure_work_items").where({ id }).del();
  }

  async linkWorkItemToApp(workItemId, appId) {
    return db("azure_work_items")
      .where({ id: workItemId })
      .update({ app_id: appId });
  }
}

module.exports = new AzureWorkItensRepository();
