const { query } = require("express");

const Pool = require("pg");

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "user_accounts",
   host: "localhost",
   port: 5432,
});

// get all users:
const getAllUsers = async (req, res) => {
   try {
      const queryString = "SELECT * FROM users";
      const results = pool.query(queryString, queryParameter);
      res.send(results);
   } catch (error) {
      console.log("error in Getting All Users", error);
      throw error;
   }
};

module.exports = {
   getAllUsers,
};
