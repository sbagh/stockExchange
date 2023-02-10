const Pool = require("pg").Pool;

const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "stockexchangedb",
   host: "localhost",
   port: 5432,
});

// function to query user_portfolio db and get a json of all users
const getUsers = async (req, res) => {
   return new Promise((resolve, reject) => {
      pool.query(
         "SELECT * FROM user_portfolio ORDER BY user_id ASC",
         (error, result) => {
            if (error) reject(error);
            // console.log("data from db: ", result.rows);
            resolve(result.rows);
         }
      );
   });
};

module.exports = {
   getUsers,
};
