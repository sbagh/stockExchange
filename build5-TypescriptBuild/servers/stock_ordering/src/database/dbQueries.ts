import { Pool, QueryResult } from "pg";

// connect to db:
const pool = new Pool({
   user: "postgres",
   password: "password",
   database: "stock_ordering",
   host: "localhost",
   port: 5432,
});

// interface:
interface OrderDetails {
   orderID: string;
   userID: number;
   orderType: string;
   ticker: string;
   quantity: number;
   price: number;
   orderStatus: string;
   orderTime: Date;
}

interface StockOrder {
   orderID: string;
   orderType: string;
   ticker: string;
   quantity: number;
   price: number;
   orderStatus: string;
   orderTime: Date;
}

interface CanceledOrder {
   orderID: string;
   orderType: string;
   orderStatus: string;
   userID: number;
}

// //get a user's trade orders
const getUserStockOrders = async (userID: number): Promise<StockOrder[]> => {
   try {
      const queryString =
         "SELECT order_type, ticker, quantity, price, order_status, order_time, order_id FROM stock_orders WHERE user_id = $1 ORDER BY order_time DESC ";
      const queryParameter = [userID];

      const results: QueryResult = await pool.query(
         queryString,
         queryParameter
      );

      // console.log(results.rows);

      // convert to camel case
      const camelCaseResults: StockOrder[] = results.rows.map((result) => {
         return {
            orderType: result.order_type,
            orderStatus: result.order_status,
            orderTime: result.order_time,
            orderID: result.order_id,
            ticker: result.ticker,
            quantity: result.quantity,
            price: result.price,
         };
      });
      return camelCaseResults;
   } catch (error) {
      console.log("unable to query for user stock orders: ", error);
      return [];
   }
};

// add a stock trade order
const addStockOrder = async (orderDetails: OrderDetails): Promise<void> => {
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

// update order_status for both buy and sell orders to "Closed" in stock_orders table after matching
const updateOrderStatusToFilled = async (
   buyOrderID: string,
   sellOrderID: string
): Promise<void> => {
   try {
      const queryString =
         "UPDATE stock_orders SET order_status =$1 WHERE order_id = $2 OR order_id = $3";
      const queryParameter = ["Filled", buyOrderID, sellOrderID];

      await pool.query(queryString, queryParameter);
   } catch (error) {
      console.log(error);
      throw error;
   }
};

// update order status to "Canceled" after received canceled order confirmation
const updateOrderStatusToCanceled = async (
   canceledOrder: CanceledOrder
): Promise<void> => {
   try {
      const queryString =
         "UPDATE stock_orders SET order_status = $1 WHERE order_id = $2";
      const queryParameter = ["Canceled", canceledOrder.orderID];
      await pool.query(queryString, queryParameter);
   } catch (error) {
      console.log("unable to update canceled order in db: ", error);
      throw error;
   }
};

const getOrderStatus = async (orderID: string): Promise<{ orderStatus }> => {
   try {
      const queryString =
         "SELECT order_status FROM stock_orders WHERE order_id = $1";
      const queryParameter = [orderID];
      const results: QueryResult = await pool.query(
         queryString,
         queryParameter
      );

      // convert to camel case
      const camelCaseResults = results.rows.map((result) => {
         return { orderStatus: result.order_status };
      });
      return camelCaseResults[0].orderStatus;
   } catch (error) {
      console.log("error in getting order status, ", error);
      return { orderStatus: "unkown error" };
   }
};

export {
   getUserStockOrders,
   addStockOrder,
   updateOrderStatusToFilled,
   updateOrderStatusToCanceled,
   getOrderStatus,
};
