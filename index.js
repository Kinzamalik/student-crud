
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "apollo-server";
import knex from "knex";

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
  type Student {
    id: ID!
    name: String!
    email: String!
    gender: String!
    classId: ID
    class: [Class]
  }

  type Class {
    id: ID!
    name: String!
    classId: ID
    student: [Student]
  }

  type Query {
    class: [Class]
    student: [Student]
    classById(id: ID!): Class
    studentById(id: ID!): Student
    classWithstudent(classId: ID!): Class
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
    student: async () => await db.select("*").from("student"),
    classById: async (_, { id }) => await db.select("*").from("class").where("id", id).first(),
    studentById: async (_, { id }) => await db.select("*").from("student").where("id", id).first(),

    classWithstudent: async (_, { classId }) => {
      const results = await db
        .select("class.*", "student.*")
        .from("class")
        .where("class.id", classId)
        .leftJoin("student", "class.id", "student.classId");

      if (results.length === 0) {
        return null; // Return null or handle empty result as needed
      }

      const classData = {
        id: results[0].id,
        name: results[0].name,
        student: results.map((student) => ({
          id: student.student_id,
          name: student.student_name,
          email: student.email,
          gender: student.gender,
        })),
      };

      return classData;
    },

    class: async () => {
      const classes = await db.select("*").from("class");
      return classes;
    },
  },

  Mutation: {
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
      const student = await db.select("*").from("student").where("classId", parent.id);
      console.log("Class student:", student);
      return student;
    },
  },

  Student: {
    class: async (parent) => {
      const result = await db.select("*").from("class").where("id", parent.classId).first();
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
