/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable("apps", function (table) {
      table.string("id").notNullable().primary();
      table.string("name").notNullable();
      table.string("path").notNullable();
      table.string("host").notNullable();
      table.integer("port").notNullable();
      table.string("startCommand").notNullable();
      table.string("branch").notNullable();
      table.json("availableBranches").notNullable();
      table.string("status").notNullable();
      table.text("notes");
      table.timestamps(true, true);
    })
    .createTable("saved_commands", function (table) {
      table.string("id").notNullable().primary();
      table.string("app_id").notNullable().references("id").inTable("apps").onDelete("CASCADE");
      table.string("name").notNullable();
      table.text("command").notNullable();
      table.timestamps(true, true);
    })
    .createTable("app_logs", function (table) {
      table.string("id").notNullable().primary();
      table.string("app_id").notNullable().references("id").inTable("apps").onDelete("CASCADE");
      table.timestamp("timestamp").notNullable();
      table.text("message").notNullable();
      table.string("type").notNullable();
    })
    .createTable("global_notes", function (table) {
      table.string("id").notNullable().primary();
      table.string("title").notNullable();
      table.text("content");
      table.timestamps(true, true);
    })
    .createTable("user_profile", function (table) {
      table.string("id").notNullable().primary();
      table.string("name").notNullable();
      table.string("avatarUrl");
      table.string("email");
    })
    .createTable("security_config", function (table) {
      table.string("id").notNullable().primary();
      table.boolean("isEnabled").notNullable();
      table.string("password");
      table.boolean("isLocked").notNullable();
    })
    .createTable("integration_config", function (table) {
      table.string("id").notNullable().primary();
      table.text("geminiApiKey");
      table.text("azureToken");
      table.string("azureOrg");
      table.string("azureProject");
    })
    .createTable("azure_work_items", function (table) {
      table.integer("id").notNullable().primary();
      table.string("title").notNullable();
      table.text("description");
      table.string("state").notNullable();
      table.string("assignedTo");
      table.string("avatarUrl");
      table.string("type").notNullable();
      table.string("url").notNullable();
      table.integer("completedWork");
      table.string("app_id"); // Can be null, links to apps table
    })
    .createTable("ai_cache", function (table) {
      table.integer("work_item_id").notNullable().primary();
      table.text("summary");
      table.json("suggestions"); // Store as JSON string
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("ai_cache")
    .dropTableIfExists("azure_work_items")
    .dropTableIfExists("integration_config")
    .dropTableIfExists("security_config")
    .dropTableIfExists("user_profile")
    .dropTableIfExists("global_notes")
    .dropTableIfExists("app_logs")
    .dropTableIfExists("saved_commands")
    .dropTableIfExists("apps");
};