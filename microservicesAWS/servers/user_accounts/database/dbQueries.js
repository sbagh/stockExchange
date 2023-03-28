const Pool = require("pg").Pool;

// require .env file for db connection
require("dotenv").config();

// connect to db:
const pool = new Pool({
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
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

module.exports = {
   getAllUsers,
};
