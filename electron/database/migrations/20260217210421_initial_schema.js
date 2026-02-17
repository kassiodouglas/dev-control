exports.up = function(knex) {
  return knex.schema
    .createTable("settings", function (table) {
      table.increments("id");
      table.string("key").notNullable().unique();
      table.string("value").notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("settings");
};
