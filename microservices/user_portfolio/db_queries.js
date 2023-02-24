const { query } = require("express");

const Pool = require("pg").Pool;

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "user_portfolio",
   host: "localhost",
   port: 5432,
});

//get user cash:
const getUserCashHoldings = async (user_id) => {
   try {
      const queryString = "SELECT cash FROM cash_holdings WHERE user_id = $1";
      const queryParameter = [user_id];

      const results = await pool.query(queryString, queryParameter);

      return results.rows;
   } catch (error) {
      console.log("error in getting Cash Holdings", error);
      throw error;
   }
};

//get user stocks:
const getUserStockHoldings = async (user_id) => {
   try {
      const queryString =
         "SELECT (ticker, quantity) from stock_holdings WHERE user_id = $1";
      const queryParameter = [user_id];

      const results = await pool.query(queryString, queryParameter);

      return results.rows;
   } catch (error) {
      console.log("error in getting Stock Holdings", error);
      throw error;
   }
};

module.exports = {
   getUserCashHoldings,
   getUserStockHoldings,
};
