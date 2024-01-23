
exports.seed = async function (knex) {
  await knex("class").del();
  await knex("class").insert([
    { id: 1, name: "javascript" },
    { id: 2, name: "python" },
    { id: 3, name: "data" },
    { id: 4, name: "java" },
  ]);
};
