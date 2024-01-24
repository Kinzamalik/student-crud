const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { gql } = require("apollo-server");
const knex = require("knex");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");


const db = knex({
  client: process.env.CLIENT,
  connection: {
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    ssl: process.env.SSL,
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
  type Student {
    id: ID!
    name: String!
    email: String!
    gender: String!
    classId: Int!
    class: [Class]
  }

  type Class {
    id: ID!
    name: String!
    students: [Student]
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
    class: async () => {
      const classes = await db.select("*").from("class");
      const result = await Promise.all(
        classes.map(async (classItem) => {
          const students = await db
            .select("student.*")
            .from("student")
            .leftJoin("class", "class.id", "student.classId")
            .where("class.id", classItem.id);

          return {
            ...classItem,
            students,
          };
        })
      );

      return result;
    },

    student: async () => await db.select("*").from("student"),
    classById: async (_, { id }) => await db.select("*").from("class").where("id", id).first(),
    studentById: async (_, { id }) => await db.select("*").from("student").where("id", id).first(),
  },
  Mutation: {
    createClass: async (_, { name }) => {
      const [id] = await db.select("*").from("student").leftJoin("class", "student.classId", "class.id");
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

      const studentWithClass = await db
        .select("student.*", "class.name as className")
        .from("student")
        .leftJoin("class", "student.classId", "class.id")
        .where("student.id", id)
        .first();

      return studentWithClass;
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
    students: async (parent) => {
      const students = await db.select("*").from("student").where("classId", parent.id);
      console.log("Class students:", students);
      return students;
    },
  },

  Student: {
    class: async (parent) => {
      const result = await db.select("*").from("class").where("id", parent.classId).first();
      console.log("Student class:", result);
      return result ? [result] : null; 
    },
  },
};

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });
  console.log(`🚀  Server ready at: ${url}`);
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
startServer();

