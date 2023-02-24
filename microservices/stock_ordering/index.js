const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const stock_ordering_PORT = 4003;

// other microservices used in this file
const order_matching_URL = "http://localhost:4004/sendOrderToMatchingService";

// require db connection and queries:
const service = require("./db_queries");

// get a specifc user's trade orders
app.get("/getUserStockOrders", (req, res) => {
   service.getUserStockOrders(req.query.user_id).then((orders) => {
      // console.log(orders);
      res.send(orders);
   });
});

// receive a trade order from ui, add it to stock_orders db and send it to the order_matching microservice
app.post("/startTradeOrder", (req, res) => {
   // console.log(req.body);

   const order_details = req.body.order_details;
   // console.log(order_details);

   // set order_status to open
   order_details.order_status = "Open";

   // add trade order to stock_orders db
   service.addStockOrder(order_details);

   // send trade order to order_matching microservice
   sendToOrderMatchingService(order_details);
});

// make an axios post to order matching microservice with the order details in body
const sendToOrderMatchingService = async (order_details) => {
   // set the body of the request:
   const body = {
      order_type: order_details.order_type,
      user_id: order_details.user_id,
      ticker: order_details.ticker,
      quantity: parseInt(order_details.quantity),
      price: parseInt(order_details.price),
      order_id: order_details.order_id,
   };

   axios.post(order_matching_URL, body).catch((error) => {
      console.log(
         "error in sending trade order to order matching microservice ",
         error
      );
      throw error;
   });
};

// receive matched order from order_matching microservice
app.put("/updateStockOrderingAfterMatch", (req, res) => {
   order_details = req.body;
   service.updateOrderStatusStockOrdersTable(
      order_details.buy_id,
      order_details.sell_id
   );
});

app.listen(
   stock_ordering_PORT,
   console.log(
      "stock ordering microservice running on port ",
      stock_ordering_PORT
   )
);
