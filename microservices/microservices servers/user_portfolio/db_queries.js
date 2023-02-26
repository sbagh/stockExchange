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

// update buyer and seller's cash holdings after an order is matched
const updateUserCashHoldingsAfterMatch = async (
   buyer_id,
   seller_id,
   price,
   quantity
) => {
   // first get the total cost of the buy/sell order
   let total_cost = price * quantity;
   // console.log("total cost is:  ", totalCost);

   try {
      // update buyers cash holdings
      const buyer_query_string =
         "UPDATE cash_holdings SET cash = cash - $1 WHERE user_id = $2";
      const buyer_query_parameter = [total_cost, buyer_id];
      await pool.query(buyer_query_string, buyer_query_parameter);

      // update sellers cash holdings
      const seller_query_string =
         "UPDATE cash_holdings SET cash = cash + $1 WHERE user_id = $2";
      const seller_query_parameter = [total_cost, seller_id];
      await pool.query(seller_query_string, seller_query_parameter);
   } catch (error) {
      console.log("error in updating buyer or seller cash holdings", error);
      throw error;
   }
};

const updateUserStockHoldingsAfterMatch = async (
   buyer_id,
   seller_id,
   ticker,
   quantity
) => {
   // update buyer's stock_holdings by adding the stock
   // first get buyer's old quantity then add the new quantity to it
   const buyers_old_quantity_row = await pool.query(
      "SELECT quantity FROM stock_holdings where (user_id = $1 and ticker = $2)",
      [buyer_id, ticker]
   );
   const buyers_old_quantity = buyers_old_quantity_row.rows[0].quantity;

   if (!buyers_old_quantity) {
      await pool.query(
         "INSERT INTO stock_holdings (user_id, ticker, quantity)",
         [buyer_id, ticker, quantity]
      );
   } else {
      const buyers_new_quantity = buyers_old_quantity + quantity;
      await pool.query(
         "UPDATE stock_holdings SET quantity = $1 WHERE (user_id = $2 and ticker = $3)",
         [buyers_new_quantity, buyer_id, ticker]
      );
   }

   // update sellers's stock_holdings by adding the stock
   // first get sellers's old quantity then subtract the new quantity from it
   const sellers_old_quantity_row = await pool.query(
      "SELECT quantity FROM stock_holdings where (user_id = $1 and ticker = $2)",
      [seller_id, ticker]
   );

   const sellers_old_quantity = sellers_old_quantity_row.rows[0].quantity;
   const sellers_new_quantity = sellers_old_quantity - quantity;

   await pool.query(
      "UPDATE stock_holdings SET quantity = $1 WHERE (user_id = $2 and ticker = $3)",
      [sellers_new_quantity, seller_id, ticker]
   );
};

module.exports = {
   getUserCashHoldings,
   getUserStockHoldings,
   updateUserCashHoldingsAfterMatch,
   updateUserStockHoldingsAfterMatch,
};
