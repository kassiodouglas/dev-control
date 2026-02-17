const knex = require("knex");
const { app } = require("electron");
const knexfile = require("../knexfile");

const environment = process.env.NODE_ENV || "development";
const config = knexfile(app)[environment];

const connection = knex(config);

module.exports = connection;