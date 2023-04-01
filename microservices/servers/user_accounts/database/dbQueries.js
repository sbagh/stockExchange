const Pool = require("pg").Pool;

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
      const results = await pool.query(queryString);
      // console.log(results.rows);

      // changing to camel case
      const camelCaseResults = results.rows.map((user) => {
         return {
            userID: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
         };
      });
      return camelCaseResults;
   } catch (error) {
      console.log("error in Getting All Users", error);
      throw error;
   }
};

const createUser = async (username, password, firstName, lastName) => {
   try {
      const queryString =
         "INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)";
      const queryParameters = [username, password, firstName, lastName];
      result = await pool.query(queryString, queryParameters);
   } catch (error) {
      console.log("error in creating user in DB", error);
      throw error;
   }
};

const getUserID = async (username) => {
   try {
      const queryString = "SELECT user_id FROM users WHERE username = $1";
      const queryParameters = [username];
      const result = await pool.query(queryString, queryParameters);
      return result.rows[0].user_id;
   } catch (error) {
      console.log("error in getting user id", error);
      throw error;
   }
};

module.exports = {
   getAllUsers,
   createUser,
   getUserID,
};
