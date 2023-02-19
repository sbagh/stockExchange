const { query } = require("express");

const Pool = require("pg").Pool;

// conect to db :
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

// function to query stock_orders db and get a json of a specific user's stock orders
const getUserStockOrders = async (user_id) => {
   try {
      const queryString =
         "SELECT (order_type, ticker, quantity, price, order_status, order_time, trade_id) FROM stock_orders WHERE user_id = $1 ORDER BY order_time DESC ";
      const queryParameter = [user_id];
      const result = await pool.query(queryString, queryParameter);
      return result.rows;
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
const updateMatchedOrdersTable = async (order) => {
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
const updateStockDataTable = async (order_price, order_ticker) => {
   try {
      const queryString = "UPDATE stock_data SET price = $1 WHERE ticker = $2";
      const queryParameters = [order_price, order_ticker];

      await pool.query(queryString, queryParameters);
   } catch (error) {
      console.log(error);
      throw error;
   }
};

//update order status in stock_orders table
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

//update order status to canceled in stock_orders table after an order is canceled
const updateOrderStatusToCanceled = async (order_id) => {
   try {
      const queryString =
         "UPDATE stock_orders SET order_status = $1 where trade_id = $2";
      const queryParameter = ["Canceled", order_id];

      await pool.query(queryString, queryParameter);
   } catch (error) {
      console.log(error);
      throw error;
   }
};

//after matching an order, update the user_porftolio table (cash value for buyer and sell)
const updateUserPortfolioTable = async (
   buy_id,
   sell_id,
   order_price,
   order_quantity
) => {
   // first get the total cost of the buy/sell order
   let totalCost = order_price * order_quantity;
   console.log("total cost is:  ", totalCost);

   try {
      // get the user id of the buyer then update the buyers cash in user_portfolio
      const buyUserRow = await pool
         .query("SELECT user_id FROM stock_orders WHERE trade_id = $1 ", [
            buy_id,
         ])
         .then(async (result) => {
            const buyUserId = result.rows[0].user_id;
            // console.log("buyUserID is:  ", buyUserId);

            await pool.query(
               "UPDATE user_portfolio SET cash = cash - $1 WHERE user_id = $2 ",
               [totalCost, buyUserId]
            );
         });

      // get the user id of the seller then update the seller's cash in user_portfolio
      const sellUserRow = await pool
         .query("SELECT user_id FROM stock_orders WHERE trade_id = $1 ", [
            sell_id,
         ])
         .then(async (result) => {
            const sellUserId = result.rows[0].user_id;
            // console.log("sellUserID is:  ", sellUserId);

            await pool.query(
               "UPDATE user_portfolio SET cash = cash + $1 WHERE user_id = $2 ",
               [totalCost, sellUserId]
            );
         });
   } catch (error) {
      console.log(error);
      throw error;
   }
};

// after matching an order, update the buyer's and seller's stock_holdings
const updateStockHoldingsTable = async (buy_id, sell_id, ticker, quantity) => {
   // get the user id of the buyer
   const buyUserRow = await pool
      .query("SELECT user_id FROM stock_orders WHERE trade_id = $1 ", [buy_id])
      .then(async (result) => {
         buyUserId = result.rows[0].user_id;

         // update buyer's stock_holdings by adding the stock
         const buyersOldQuantityRow = await pool.query(
            "SELECT quantity FROM stock_holdings where (user_id = $1 and stock_ticker = $2)",
            [buyUserId, ticker]
         );
         const buyersOldQuantity = buyersOldQuantityRow.rows[0].quantity;

         if (!buyersOldQuantity) {
            await pool.query(
               "INSERT INTO stock_holdings (user_id, stock_ticker, quantity)",
               [buyUserId, ticker, quantity]
            );
         } else {
            const buyersNewQuantity = buyersOldQuantity + quantity;
            await pool.query(
               "UPDATE stock_holdings SET quantity = $1 WHERE (user_id = $2 and stock_ticker = $3)",
               [buyersNewQuantity, buyUserId, ticker]
            );
         }
      });

   // get the user id of the seller
   const sellUserRow = await pool
      .query("SELECT user_id FROM stock_orders WHERE trade_id = $1", [sell_id])
      .then(async (result) => {
         const sellUserId = result.rows[0].user_id;

         // update seller's stock_holdings by reducing the stock, assume that checking if there is enough stocks to sell is done on front-end
         const sellersOldQuantityRow = await pool.query(
            "SELECT quantity FROM stock_holdings where (user_id = $1 and stock_ticker = $2)",
            [sellUserId, ticker]
         );

         const sellersOldQuantity = sellersOldQuantityRow.rows[0].quantity;
         const sellersNewQuantity = sellersOldQuantity - quantity;

         await pool.query(
            "UPDATE stock_holdings SET quantity = $1 WHERE (user_id = $2 and stock_ticker = $3)",
            [sellersNewQuantity, sellUserId, ticker]
         );
      });
};

module.exports = {
   getAllUsers,
   getUserStocks,
   getUserStockOrders,
   getStockData,
   // getTradeHistory,
   addTradeOrder,
   updateMatchedOrdersTable,
   updateOrderStatusStockOrdersTable,
   updateOrderStatusToCanceled,
   updateStockDataTable,
   updateUserPortfolioTable,
   updateStockHoldingsTable,
};
