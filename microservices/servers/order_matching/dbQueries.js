const { query } = require("express");

const Pool = require("pg").Pool;

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "stock_orders",
   host: "localhost",
   port: 5432,
});

// update matched_orders table after matching an order
const updateMatchedOrdersTable = async (matchedOrder) => {
   try {
      const queryString =
         "INSERT INTO matched_orders(buy_order_id, sell_order_id, matched_time) VALUES($1,$2,$3)";
      const queryParameters = [
         matchedOrder.buyID,
         matchedOrder.sellID,
         matchedOrder.time,
      ];

      await pool.query(queryString, queryParameters);
   } catch (error) {
      console.log(error);
      throw error;
   }
};

module.exports = {
   updateMatchedOrdersTable,
};
