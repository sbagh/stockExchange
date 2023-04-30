// !!!! curently user_id in cash_holdings and stock_holdings is not linked to user_id in user accounts, need to implement cross-microservice data replication using rabbitMQ as a messanger
import { Pool } from "pg";
//import typescript interfaces
import type {
   UserCashHoldings,
   UserStockHoldings,
} from "../interfaces/interfaces";

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "user_portfolio",
   host: "localhost",
   port: 5432,
});

//get user cash:
const getUserCashHoldings = async (
   userID: number
): Promise<UserCashHoldings> => {
   try {
      const queryString = "SELECT cash FROM cash_holdings WHERE user_id = $1";
      const queryParameter = [userID];

      const results = await pool.query(queryString, queryParameter);
      // console.log(results.rows);
      // const cash = results.rows[0].cash;
      // return cash;

      if (results.rowCount > 0) {
         return results.rows[0];
      } else {
         return { cash: "0" };
      }
   } catch (error) {
      console.log("error in getting Cash Holdings", error);
      return { cash: "0" };
   }
};

//get user stocks:
const getUserStockHoldings = async (
   userID: number
): Promise<UserStockHoldings[]> => {
   try {
      const queryString =
         "SELECT ticker, quantity FROM stock_holdings WHERE user_id = $1";
      const queryParameter = [userID];
      const results = await pool.query(queryString, queryParameter);
      // console.log(results.rows);
      return results.rows;
   } catch (error) {
      console.log("error in getting Stock Holdings", error);
      return [];
   }
};

// update buyer and seller's cash holdings after an order is matched
const updateUserCashHoldingsAfterMatch = async (
   buyerID: number,
   sellerID: number,
   price: number,
   quantity: number
): Promise<void> => {
   // 1- first get the total cost of the buy/sell order
   let totalCost = price * quantity;
   // console.log("total cost is:  ", totalCost);

   try {
      // 2- update buyers cash holdings
      const buyerQueryString =
         "UPDATE cash_holdings SET cash = cash - $1 WHERE user_id = $2";
      const buyerQueryParameter = [totalCost, buyerID];
      await pool.query(buyerQueryString, buyerQueryParameter);

      // 3- update sellers cash holdings
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
   buyerID: number,
   sellerID: number,
   ticker: string,
   quantity: number
): Promise<void> => {
   // 1- update buyer's stock_holdings by adding the stock
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

   // 2- update sellers's stock_holdings by adding the stock
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

export {
   getUserCashHoldings,
   getUserStockHoldings,
   updateUserCashHoldingsAfterMatch,
   updateUserStockHoldingsAfterMatch,
};
