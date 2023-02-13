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

//after matching an order, update the user_porftolio table (cash value for buyer and sell)
const updateUserPortfolio = async (
   buy_id,
   sell_id,
   order_price,
   order_quantity
) => {
   // first get the total cost of the buy/sell order
   let totalCost = order_price * order_quantity;

   try {
      // get the user id of the buyer then update the buyers cash in user_portfolio
      const buyUserRow = await pool.query(
         "SELECT user_id FROM stock_orders WHERE trade_id = $1 ",
         [buy_id]
      );
      const buyUserId = buyUserRow.rows[0].user_id;

      await pool.query(
         "UPDATE user_portfolio SET cash = cash - $1 WHERE user_id = $2",
         [totalCost, buyUserId]
      );

      // get the user id of the seller then update the seller's cash in user_portfolio
      const sellUserRow = await pool.query(
         "SELECT user_id FROM stock_orders WHERE trade_id = $1",
         [sell_id]
      );
      const sellUserId = sellUserRow.rows[0].user_id;

      await pool.query(
         "UPDATE user_portfolio SET cash = cash + $1 WHERE user_id = $2",
         [totalCost, sellUserId]
      );
      
   } catch (error) {
      console.log(error);
      throw error;
   }
};

// after matching an order, update the buyer's and seller's stock_holdings
const updateStockHoldings = async (buy_id, sell_id, ticker, quantity) => {
   // get the user id of the buyer
   const buyUserRow = await pool.query(
      "SELECT user_id FROM stock_orders WHERE trade_id = $1 ",
      [buy_id]
   );
   const buyUserId = buyUserRow.rows[0].user_id;

   // update buyer's stock_holdings by adding the stock
   const buyersCurrentQuantityRow = await pool.query(
      "SELECT quantity FROM stock_holdings where (user_id = $1 and stock_ticker = $2)",
      [buyUserId, ticker]
   );

   const buyersOldQuantity = buyersCurrentQuantityRow.rows[0].quantity;

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

   // get the user id of the seller
   const sellUserRow = await pool.query(
      "SELECT user_id FROM stock_orders WHERE trade_id = $1",
      [sell_id]
   );
   const sellUserId = sellUserRow.rows[0].user_id;

   // update sellers's stock_holdings by adding the stock, assume check for enough stocks to sell is done on front-end
   const sellersCurrentQuantityRow = await pool.query(
      "SELECT quantity FROM stock_holdings where (user_id = $1 and stock_ticker = $2)",
      [buyUserId, ticker]
   );

   const sellersOldQuantity = buyersCurrentQuantityRow.rows[0].quantity;
   const sellersNewQuantity = sellersOldQuantity - quantity;
   await pool.query(
      "UPDATE stock_holdings SET quantity = $1 WHERE (user_id = $2 and stock_ticker = $3)",
      [sellersNewQuantity, sellUserId, ticker]
   );
};

module.exports = {
   getAllUsers,
   getUserStocks,
   getStockData,
   // getTradeHistory,
   addTradeOrder,
   updateMatchedOrders,
   updateStockData,
   updateUserPortfolio,
   updateStockHoldings,
};
