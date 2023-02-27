const Pool = require("pg").Pool;

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "stock_ordering",
   host: "localhost",
   port: 5432,
});

// //get user trade orders
// const getUserStockOrders = async (userID) => {
//    try {
//       const query_string =
//          "SELECT (order_type, ticker, quantity, price, order_status, order_time, order_id) FROM trade_orders WHERE user_id = $1 ORDER BY order_time DESC ";
//       const query_parameter = [userID];
//       const result = await pool.query(query_string, query_parameter);
//       return result.rows;
//    } catch (error) {
//       console.log(error);
//       throw error;
//    }
// };

// add a stock trade order
const addStockOrder = async (orderDetails) => {
   try {
      const queryString =
         "INSERT INTO stock_orders (order_id, user_id, order_type, ticker, quantity, price, order_time, order_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
      const queryParameters = [
         orderDetails.orderID,
         orderDetails.userID,
         orderDetails.orderType,
         orderDetails.ticker,
         orderDetails.quantity,
         orderDetails.price,
         orderDetails.orderTime,
         orderDetails.orderStatus,
      ];
      await pool.query(queryString, queryParameters);
   } catch (error) {
      console.log("error in adding stock order to stock_orders table", error);
      throw error;
   }
};

// //update order_status for both buy and sell orders to "Closed" in stock_orders table after matching
// const updateOrderStatusStockOrdersTable = async (
//    buy_order_id,
//    sell_order_id
// ) => {
//    try {
//       const query_string =
//          "UPDATE stock_orders SET order_status =$1 WHERE trade_id = $2 OR trade_id = $3";
//       const query_parameter = ["Closed", buy_order_id, sell_order_id];

//       await pool.query(query_string, query_parameter);
//    } catch (error) {
//       console.log(error);
//       throw error;
//    }
// };

// const getBuyerAndSellerID = async (buy_order_id, sell_order_id) => {
//    try {
//       const query_string = "GET (user_id) WHERE trade_id = $1 OR trade_id = $2";
//       const query_parameter = [buy_order_id, sell_order_id];
//       const results = await pool.query(query_string, query_parameter);
//       return results.rows;
//    } catch (error) {
//       console.log(
//          "error getting buyer and seller ID after matched order",
//          error
//       );
//       throw error;
//    }
// };

module.exports = {
   // getUserStockOrders,
   addStockOrder,
   // updateOrderStatusStockOrdersTable,
   // getBuyerAndSellerID,
};
