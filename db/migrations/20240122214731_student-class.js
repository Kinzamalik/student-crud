const up = function (knex) {
  return knex.schema
    .createTable("class", function (table) {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
    })
    .createTable("student", function (table) {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable();
      table.string("gender", 255).notNullable();
      table.integer("classId").unsigned();
      table.foreign("classId").references("class.id").onDelete("CASCADE").onUpdate("CASCADE");
    });
};

const down = function (knex) {
  return knex.schema.dropTable("student").dropTable("class");
};

const config = { transaction: false };

module.exports = { up, down, config };
