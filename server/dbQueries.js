const { query } = require("express");

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
   try {
      const queryString = "SELECT * FROM user_portfolio ORDER BY user_id ASC";
      const results = await pool.query(queryString);
      return results.rows;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

// function to query stock_holdings db and get a json of stocks a user holds
const getUserStocks = async (user_id) => {
   try {
      const queryString =
         "SELECT stock_ticker, quantity FROM stock_holdings WHERE user_id = $1";
      const queryParameter = [user_id];
      const results = await pool.query(queryString, queryParameter);
      return results.rows;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

//function to query stock_data db and get a json of stock data
const getStockData = async (req, res) => {
   try {
      const queryString =
         "Select ticker, price, volume, last_update FROM stock_data ORDER BY stock_id ASC";

      const results = await pool.query(queryString);
      return results.rows;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

//function to query trade_history db and get a json of trade history
// const getTradeHistory = async (req, res) => {
//    try {
//       const queryString =
//          "SELECT ticker, buy_order_id, seller_id, price, quantity, time FROM matched_orders";
//       const results = await pool.query(queryString);
//       resolve(results.rows);
//    } catch (error) {
//       console.log(error);
//       throw error;
//    }
// };

// update stock_orders table with incoming buy or sell order
const addTradeOrder = async (orderDetails) => {
   try {
      const queryString =
         "INSERT INTO public.stock_orders (trade_id, user_id, order_type, ticker, quantity, price, order_time, order_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
      const queryParameters = [
         orderDetails.orderID,
         orderDetails.userID,
         orderDetails.order_type,
         orderDetails.ticker,
         orderDetails.quantity,
         orderDetails.price,
         orderDetails.order_time,
         orderDetails.order_status,
      ];

      const results = await pool.query(queryString, queryParameters);
      return results.rows;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

module.exports = {
   getAllUsers,
   getUserStocks,
   getStockData,
   // getTradeHistory,
   addTradeOrder,
};
