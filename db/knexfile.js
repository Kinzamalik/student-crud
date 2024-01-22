module.exports ={
  development: {
    client: "postgresql",
    connection: {
      database: "DB",
      user: "kiinza.malik",
      password: "Qd6JtuEzLa2M",
      host: "ep-patient-waterfall-a5mj73k0.us-east-2.aws.neon.tech",
      ssl: true,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
