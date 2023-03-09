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

// !!!! curently user_id in cash_holdings and stock_holdings is not linked to user_id in user accounts, need to implement cross-microservice data replication using rabbitMQ as a messanger

//get user cash:
const getUserCashHoldings = async (userID) => {
   try {
      const queryString = "SELECT cash FROM cash_holdings WHERE user_id = $1";
      const queryParameter = [userID];

      const results = await pool.query(queryString, queryParameter);
      // console.log(results.rows);
      return results.rows[0];
   } catch (error) {
      console.log("error in getting Cash Holdings", error);
      throw error;
   }
};

//get user stocks:
const getUserStockHoldings = async (userID) => {
   try {
      const queryString =
         "SELECT ticker, quantity FROM stock_holdings WHERE user_id = $1";
      const queryParameter = [userID];
      const results = await pool.query(queryString, queryParameter);
      // console.log(results.rows);
      return results.rows;
   } catch (error) {
      console.log("error in getting Stock Holdings", error);
      throw error;
   }
};

// update buyer and seller's cash holdings after an order is matched
const updateUserCashHoldingsAfterMatch = async (
   buyerID,
   sellerID,
   price,
   quantity
) => {
   // first get the total cost of the buy/sell order
   let totalCost = price * quantity;
   // console.log("total cost is:  ", totalCost);

   try {
      // update buyers cash holdings
      const buyerQueryString =
         "UPDATE cash_holdings SET cash = cash - $1 WHERE user_id = $2";
      const buyerQueryParameter = [totalCost, buyerID];
      await pool.query(buyerQueryString, buyerQueryParameter);

      // update sellers cash holdings
      const sellerQueryString =
         "UPDATE cash_holdings SET cash = cash + $1 WHERE user_id = $2";
      const sellerQueryParameter = [totalCost, sellerID];
      await pool.query(sellerQueryString, sellerQueryParameter);
   } catch (error) {
      console.log("error in updating buyer or seller cash holdings", error);
      throw error;
   }
};

const updateUserStockHoldingsAfterMatch = async (
   buyerID,
   sellerID,
   ticker,
   quantity
) => {
   // update buyer's stock_holdings by adding the stock
   // first get buyer's old quantity then add the new quantity to it
   const buyersOldQuantityRow = await pool.query(
      "SELECT quantity FROM stock_holdings where (user_id = $1 and ticker = $2)",
      [buyerID, ticker]
   );
   const buyersOldQuantity = buyersOldQuantityRow.rows[0].quantity;

   if (!buyersOldQuantity) {
      await pool.query(
         "INSERT INTO stock_holdings (user_id, ticker, quantity)",
         [buyerID, ticker, quantity]
      );
   } else {
      const buyersNewQuantity = buyersOldQuantity + quantity;
      await pool.query(
         "UPDATE stock_holdings SET quantity = $1 WHERE (user_id = $2 and ticker = $3)",
         [buyersNewQuantity, buyerID, ticker]
      );
   }

   // update sellers's stock_holdings by adding the stock
   // first get sellers's old quantity then subtract the new quantity from it
   const sellersOldQuantityRow = await pool.query(
      "SELECT quantity FROM stock_holdings where (user_id = $1 and ticker = $2)",
      [sellerID, ticker]
   );

   const sellersOldQuantity = sellersOldQuantityRow.rows[0].quantity;
   const sellersNewQuantity = sellersOldQuantity - quantity;

   await pool.query(
      "UPDATE stock_holdings SET quantity = $1 WHERE (user_id = $2 and ticker = $3)",
      [sellersNewQuantity, sellerID, ticker]
   );
};

module.exports = {
   getUserCashHoldings,
   getUserStockHoldings,
   updateUserCashHoldingsAfterMatch,
   updateUserStockHoldingsAfterMatch,
};
