const { query } = require("express");

const Pool = require("pg").Pool;

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "stock_data",
   host: "localhost",
   port: 5432,
});

// get stock data
const getStockData = async (req, res) => {
   try {
      const queryString = "SELECT ticker, price, last_update FROM stock_data";
      const results = await pool.query(queryString);

      //convert results to camel case:
      const camelCaseResults = results.rows.map((stock) => {
         return {
            ticker: stock.ticker,
            price: stock.price,
            lastUpdate: stock.last_update,
         };
      });
      return camelCaseResults;
   } catch (error) {
      console.log("error in getting Stock Data ", error);
      console.log(error);
   }
};

//update stock price after maching an order is matched
const updateStockDataAfterMatch = async (price, time, ticker) => {
   try {
      const queryString =
         "UPDATE stock_data SET price = $1, last_update=$2 WHERE ticker = $3";
      const queryParameter = [price, time, ticker];
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
