// const knex = require("knex");
// const knexfile = require("./knexfile");

import knex from "knex";
import knexfile from "./knexfile";

const db = knex(knexfile.development);
export default db;
