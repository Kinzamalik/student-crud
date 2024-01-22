exports.up = function (knex) {
  return knex.schema
   .createTable("class", function (table) {
      table.increments("id");
      table.string("name", 255).notNullable();
    })
    .createTable("student", function (table) {
      table.increments("id");
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable();
      table.string("gender", 255).notNullable();
      table.integer("classId").references("id").inTable("class");
    })
   
};

exports.down = function (knex) {
  return knex.schema.dropTable("class").dropTable("student");
};

exports.config = { transaction: false };
