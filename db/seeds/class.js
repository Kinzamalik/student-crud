export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("class").del();
  await knex("class").insert([
    { id: 1, name: "javascript", classId: "1" },
    { id: 2, name: "python", classId: "2" },
    { id: 3, name: "data", classId: "3" },
    { id: 4, name: "java", classId: "4" },
  ]);
};
