export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("student").del();
  await knex("student").insert([
    {
      id: 1,
      name: "kinza",
      email: "kinza@google.com",
      gender: "F",
      classId: 1,
    },
    {
      id: 2,
      name: "kinza",
      email: "kinza@google.com",
      gender: "F",
      classId: 2,
    },
    {
      id: 3,
      name: "kinza",
      email: "kinza@google.com",
      gender: "F",
      classId: 3,
    },
    {
      id: 4,
      name: "hamza",
      email: "hamza@google.com",
      gender: "F",
      classId: 4,
    },
  ]);
};
