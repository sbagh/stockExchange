const { query } = require("express");
const { builtinModules } = require("module");

const Pool = require("pg");

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "user_portfolio",
   host: "localhost",
   port: 5432,
});

// get stock data
const getStockData = async (req, res) => {
   try {
      const queryString =
         "SELECT (ticker, price, volume, last_update) FROM stock_data ORDER BY stock_id ASC ";
      const results = pool.query(queryString);
      return results.rows;
   } catch (error) {
      console.log("error in getting Stock Data ", error);
      console.log(error);
   }
};

//update stock price after maching an order is matched
const updateStockDataAfterMatch = async (price, ticker) => {
   try {
      const queryString = "UPDATE stock_data SET price = $1 WHERE ticker = $2";
      const queryParameter = [price, ticker];
      await pool.query(queryString, queryParameter);
   } catch (error) {
      console.log("error in update stock price after order is matched", error);
      throw error;
   }
};

module.exports = {
   getStockData,
   updateStockDataAfterMatch,
};
