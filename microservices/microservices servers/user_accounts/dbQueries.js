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

module.exports = {
   getAllUsers,
};
