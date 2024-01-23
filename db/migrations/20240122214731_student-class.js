export const up = function (knex) {
  return knex.schema
    .createTable("class", function (table) {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.integer("classId").unsigned().references("class.id").onDelete("CASCADE");   
  //  table.foreign("classId").references("class.id");
    })
    .createTable("student", function (table) {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable();
      table.string("gender", 255).notNullable();
      table.integer("classId").unsigned();
      table.foreign("classId").references("id").inTable("class");
    });
};

export const down = function (knex) {
  return knex.schema.dropTable("student").dropTable("class");
};

export const config = { transaction: false };
