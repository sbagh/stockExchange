const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const stockOrderingPORT = 4003;

// // other microservices used in this file
// const orderMatchingURL = "http://localhost:4004/sendOrderToMatchingService";

// require db connection and queries:
const service = require("./dbQueries");

// // get a specifc user's trade orders
// app.get("/getUserStockOrders", (req, res) => {
//    service.getUserStockOrders(req.query.userID).then((orders) => {
//       // console.log(orders);
//       res.send(orders);
//    });
// });

// receive a trade order from ui, add it to stock_orders db and send it to the order_matching microservice
app.post("/startTradeOrder", (req, res) => {
   // console.log(req.body);

   const orderDetails = req.body.orderDetails;
   console.log("received order: ", orderDetails);

   // set order_status to open
   orderDetails.orderStatus = "Open";

   // add trade order to stock_orders db
   service.addStockOrder(orderDetails);

   // send trade order to order_matching microservice
   // sendToOrderMatchingService(order_details);

   res.send("order received");
});

// make an axios post to order matching microservice with the order details in body
// const sendToOrderMatchingService = async (order_details) => {
//    // set the body of the request:
//    const body = {
//       order_type: order_details.order_type,
//       userID: order_details.userID,
//       ticker: order_details.ticker,
//       quantity: parseInt(order_details.quantity),
//       price: parseInt(order_details.price),
//       order_id: order_details.order_id,
//    };
//
// post to order matching microservice
//    axios.post(orderMatchingURL, body).catch((error) => {
//       console.log(
//          "error in sending trade order to order matching microservice ",
//          error
//       );
//       throw error;
//    });
// };

// // receive matched order from order_matching microservice
// app.put("/updateStockOrderingAfterMatch", (req, res) => {
//    const matched_order = req.body;
//    service.updateOrderStatusStockOrdersTable(
//       matched_order.buy_order_id,
//       matched_order.sell_order_id
//    );
// });

// get buyer and seller id given order ids, request from order matching microservice
// app.get("/getUserIDsfromStockOrdering", (req, res) => {
//    const { buy_order_id, sell_order_id } = req.query;
//    const user_ids = service.getBuyerAndSellerID(buy_order_id, sell_order_id);
//    res.send(user_ids);
// });

app.listen(
   stockOrderingPORT,
   console.log(
      "stock ordering microservice running on port ",
      stockOrderingPORT
   )
);
