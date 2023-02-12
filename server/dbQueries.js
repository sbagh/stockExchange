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

//function to query matched_orders db and get a json of trade history
// const getTradeHistory = async (req, res) => {
//    try {
//       const queryString =
//          "SELECT ticker, buy_order_id, sell_id, price, quantity, time FROM matched_orders";
//       const results = await pool.query(queryString);
//       return results.rows;
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

// after matching an order, update the matched_orders tabe
const updateMatchedOrders = async (order) => {
   try {
      const queryString =
         "INSERT INTO public.matched_orders(buy_order_id, sell_order_id, matched_time) VALUES($1,$2,$3)";
      const queryParameters = [order.buyID, order.sellID, order.time];

      await pool.query(queryString, queryParameters);
   } catch (error) {
      console.log(error);
      throw error;
   }
};

//after matching an order, update the stock price of the ticker
const updateStockData = async (order_price, order_ticker) => {
   try {
      const queryString = "UPDATE stock_data SET price = $1 WHERE ticker = $2";
      const queryParameters = [order_price, order_ticker];

      await pool.query(queryString, queryParameters);
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
   updateMatchedOrders,
   updateStockData,
};
