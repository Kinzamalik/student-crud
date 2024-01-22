/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('class').del()
  await knex('class').insert([
    {id: 1, name: 'javascript'},
    {id: 2, name: 'python'},
    {id: 3, name: 'data'},
    {id: 4, name: 'java'}
  ]);
};
