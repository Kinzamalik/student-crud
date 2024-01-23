// import express from "express";
// import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// import knex from "./db/db";
import { gql } from "apollo-server";

import knex from "knex";
// import knexfile from "./";

const db = knex({
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
});

const typeDefs = gql`
  type Class {
    id: ID!
    name: String!
    student: [Student]
  }

  type Student {
    id: ID!
    name: String!
    email: String!
    gender: String!
    class: Class!
  }

  type Query {
    class: [Class]
    student: [Student]
    classById(id: ID!): Class
    studentById(id: ID!): Student
  }

  type Mutation {
    createClass(name: String!): Class
    updateClass(id: ID!, name: String!): Class
    deleteClass(id: ID!): Boolean

    createStudent(name: String!, email: String!, gender: String!, classId: Int!): Student
    updateStudent(id: ID!, name: String!, email: String!, gender: String!, classId: Int!): Student
    deleteStudent(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    class: async () => await db.select("*").from("class"),
    // class: async () => [{ id: 1, name: "javascript" }],
    student: async () => await db.select("*").from("student"),
    classById: async (_, { id }) => await db.select("*").from("class").where("id", id).first(),
    studentById: async (_, { id }) => await db.select("*").from("student").where("id", id).first(),
  },
  Mutation: {
    createClass: async (_, { name }) => {
      const [id] = await db("class").insert({ name }, "id");
      return { id, name };
    },
    updateClass: async (_, { id, name }) => {
      await db("class").where({ id }).update({ name });
      return { id, name };
    },
    deleteClass: async (_, { id }) => {
      const result = await db("class").where({ id }).del();
      return result > 0;
    },
    createStudent: async (_, { name, email, gender, classId }) => {
      const [id] = await db("student").insert({ name, email, gender, classId }, "id");
      return { id, name, email, gender, classId };
    },
    updateStudent: async (_, { id, name, email, gender, classId }) => {
      await db("student").where({ id }).update({ name, email, gender, classId });
      return { id, name, email, gender, classId };
    },
    deleteStudent: async (_, { id }) => {
      const result = await db("student").where({ id }).del();
      return result > 0;
    },
  },
  Class: {
    student: async (parent) => {
      const result = await db.select("*").from("student").where("classId", parent.id);
      console.log("Class student:", result);
      return result;
    },
  },

  Student: {
    class: async (parent) => {
      const result = await db.select("*").from("class").where("id", parent.classId);
      console.log("Student class:", result);
      return result;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const { url } = await startStandaloneServer(server, {
  listen: { port: PORT },
});

console.log(`🚀  Server ready at: ${url}`);
