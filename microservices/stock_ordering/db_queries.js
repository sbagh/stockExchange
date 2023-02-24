const { query } = reqiure("express");

const Pool = require("pg");

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "stock_orders",
   host: "localhost",
   port: 5432,
});

//get user trade orders
const getUserStockOrders = async (user_id) => {
   try {
      const query_string =
         "SELECT (order_type, ticker, quantity, price, order_status, order_time, order_id) FROM trade_orders WHERE user_id = $1 ORDER BY order_time DESC ";
      const query_parameter = [user_id];
      const result = await pool.query(query_string, query_parameter);
      return result.rows;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

// add a stock trade order
const addStockOrder = async (order_details) => {
   try {
      const query_string =
         "INSERT INTO stock_orders (trade_id, user_id, order_type, ticker, quantity, price, order_time, order_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
      const query_parameters = [
         order_details.orderID,
         order_details.userID,
         order_details.order_type,
         order_details.ticker,
         order_details.quantity,
         order_details.price,
         order_details.order_time,
         order_details.order_status,
      ];

      const results = await pool.query(queryString, queryParameters);
      return results.rows;
   } catch (error) {
      console.log(error);
      throw error;
   }
};

//update order_status for both buy and sell orders to "Closed" in stock_orders table after matching
const updateOrderStatusStockOrdersTable = async (buy_id, sell_id) => {
   try {
      const queryString =
         "UPDATE stock_orders SET order_status =$1 WHERE trade_id = $2 OR trade_id = $3";
      const queryParameters = ["Closed", buy_id, sell_id];

      await pool.query(queryString, queryParameters);
   } catch (error) {
      console.log(error);
      throw error;
   }
};
module.exports = {
   getUserStockOrders,
   addStockOrder,
   updateOrderStatusStockOrdersTable,
};
