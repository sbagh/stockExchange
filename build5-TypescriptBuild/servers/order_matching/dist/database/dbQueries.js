"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMatchedOrdersTable = void 0;
const pg_1 = require("pg");
// connect to db:
const pool = new pg_1.Pool({
    user: "postgres",
    password: "password",
    database: "matched_orders",
    host: "localhost",
    port: 5432,
});
// update matched_orders table after matching an order
const updateMatchedOrdersTable = async (matchedOrder) => {
    try {
        const queryString = "INSERT INTO matched_orders(buy_order_id, sell_order_id, matched_time) VALUES($1,$2,$3)";
        const queryParameters = [
            matchedOrder.buyOrderID,
            matchedOrder.sellOrderID,
            matchedOrder.time,
        ];
        await pool.query(queryString, queryParameters);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.updateMatchedOrdersTable = updateMatchedOrdersTable;
//# sourceMappingURL=dbQueries.js.map