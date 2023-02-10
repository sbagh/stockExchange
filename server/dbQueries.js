const Pool = require("pg").Pool;

const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "stockexchangedb",
   host: "localhost",
   port: 5432,
});

// function to query user_portfolio db and get a json of all users
const getAllUsers = async (req, res) => {
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

// function to query stock_holdings db and get a json of stocks a user holds
const getUserStocks = async (user_id) => {
   return new Promise((resolve, reject) => {
      pool.query(
         "SELECT stock_ticker, quantity FROM stock_holdings WHERE user_id = $1",
         [user_id],
         (error, results) => {
            if (error) reject(error);
            // console.log("data from db: ", results.rows);
            resolve(results.rows);
         }
      );
   });
};

//function to query stock_data db and get a json of stock data
const getStockData = async (req, res) => {
   return new Promise((resolve, reject) => {
      pool.query(
         "Select ticker, price, volume, last_update FROM stock_data ORDER BY stock_id ASC",
         (error, results) => {
            if (error) reject(error);
            // console.log("data from db: ", results.rows);
            resolve(results.rows);
         }
      );
   });
};

//function to query trade_history db and get a json of trade history
const getTradeHistory = async (req, res) => {
   return new Promise((resolve, reject) => {
      pool.query(
         "SELECT ticker, buyer_id, seller_id, price, quantity, time FROM trade_history",
         (error, results) => {
            if (error) reject(error);
            console.log("data from db : ", results.rows);
            resolve(results.rows);
         }
      );
   });
};

module.exports = {
   getAllUsers,
   getUserStocks,
   getStockData,
   getTradeHistory,
};
