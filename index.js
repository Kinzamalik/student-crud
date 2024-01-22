const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const knex = require("./db/db");

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
    class: Class
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
    class: async () => await knex.select("*").from("class"),
    // class: async () => [{ id: 1, name: "javascript" }],
    student: async () => await knex.select("*").from("student"),
    classById: async (_, { id }) => await knex.select("*").from("class").where("id", id).first(),
    studentById: async (_, { id }) => await knex.select("*").from("student").where("id", id).first(),
  },
  Mutation: {
    createClass: async (_, { name }) => {
      const [id] = await knex("class").insert({ name }, "id");
      return { id, name };
    },
    updateClass: async (_, { id, name }) => {
      await knex("class").where({ id }).update({ name });
      return { id, name };
    },
    deleteClass: async (_, { id }) => {
      const result = await knex("class").where({ id }).del();
      return result > 0;
    },
    createStudent: async (_, { name, email, gender, classId }) => {
      const [id] = await knex("student").insert({ name, email, gender, classId }, "id");
      return { id, name, email, gender, classId };
    },
    updateStudent: async (_, { id, name, email, gender, classId }) => {
      await knex("student").where({ id }).update({ name, email, gender, classId });
      return { id, name, email, gender, classId };
    },
    deleteStudent: async (_, { id }) => {
      const result = await knex("student").where({ id }).del();
      return result > 0;
    },
  },
  Class: {
    student: async (parent) => {
      const result = await knex.select("*").from("student").where("classId", parent.id);
      console.log("Class student:", result);
      return result;
    },
  },

  Student: {
    class: async (parent) => {
      const result = await knex.select("*").from("class").where("id", parent.classId);
      console.log("Student class:", result);
      return result;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http:${PORT}`);
});
