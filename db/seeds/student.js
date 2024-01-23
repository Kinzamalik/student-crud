exports.seed = async function (knex) {
  // Seed logic here
  await knex("student").del();
  await knex("student").insert([
    {
      id: 1,
      name: "kinza",
      email: "kinza@google.com",
      gender: "F",
      classId: 1,
    },
  ])
}
