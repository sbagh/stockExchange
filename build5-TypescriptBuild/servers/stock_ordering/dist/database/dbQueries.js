"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStatus = exports.updateOrderStatusToCanceled = exports.updateOrderStatusToFilled = exports.addStockOrder = exports.getUserStockOrders = void 0;
const pg_1 = require("pg");
// connect to db:
const pool = new pg_1.Pool({
    user: "postgres",
    password: "password",
    database: "stock_ordering",
    host: "localhost",
    port: 5432,
});
// //get a user's trade orders
const getUserStockOrders = async (userID) => {
    try {
        const queryString = "SELECT order_type, ticker, quantity, price, order_status, order_time, order_id FROM stock_orders WHERE user_id = $1 ORDER BY order_time DESC ";
        const queryParameter = [userID];
        const results = await pool.query(queryString, queryParameter);
        // console.log(results.rows);
        // convert to camel case
        const camelCaseResults = results.rows.map((result) => {
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
    }
    catch (error) {
        console.log("unable to query for user stock orders: ", error);
        return [];
    }
};
exports.getUserStockOrders = getUserStockOrders;
// add a stock trade order to db
const addStockOrder = async (orderDetails) => {
    try {
        const queryString = "INSERT INTO stock_orders (order_id, user_id, order_type, ticker, quantity, price, order_time, order_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
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
    }
    catch (error) {
        console.log("error in adding stock order to stock_orders table", error);
        throw error;
    }
};
exports.addStockOrder = addStockOrder;
// update order_status for both buy and sell orders to "Closed" in stock_orders table after matching
const updateOrderStatusToFilled = async (buyOrderID, sellOrderID) => {
    try {
        const queryString = "UPDATE stock_orders SET order_status =$1 WHERE order_id = $2 OR order_id = $3";
        const queryParameter = ["Filled", buyOrderID, sellOrderID];
        await pool.query(queryString, queryParameter);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.updateOrderStatusToFilled = updateOrderStatusToFilled;
// update order status to "Canceled" after received canceled order confirmation
const updateOrderStatusToCanceled = async (canceledOrder) => {
    try {
        const queryString = "UPDATE stock_orders SET order_status = $1 WHERE order_id = $2";
        const queryParameter = ["Canceled", canceledOrder.orderID];
        await pool.query(queryString, queryParameter);
    }
    catch (error) {
        console.log("unable to update canceled order in db: ", error);
        throw error;
    }
};
exports.updateOrderStatusToCanceled = updateOrderStatusToCanceled;
// get order status given orderID - not used for now
const getOrderStatus = async (orderID) => {
    try {
        const queryString = "SELECT order_status FROM stock_orders WHERE order_id = $1";
        const queryParameter = [orderID];
        const results = await pool.query(queryString, queryParameter);
        // convert to camel case
        const camelCaseResults = results.rows.map((result) => {
            return { orderStatus: result.order_status };
        });
        return camelCaseResults[0].orderStatus;
    }
    catch (error) {
        console.log("error in getting order status, ", error);
        return { orderStatus: "unkown error" };
    }
};
exports.getOrderStatus = getOrderStatus;
//# sourceMappingURL=dbQueries.js.map