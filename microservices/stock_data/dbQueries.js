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

module.exports = {
   getStockData,
};
