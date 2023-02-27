import React, { useEffect, useState } from "react";
import StockOrderForm from "./StockOrderForm";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// stock ordering microservice URL
const stockOrderingURL = "http://localhost:4003";

const StockOrdering = ({ user }) => {
   //state about order details when buying/selling a stock
   const [orderDetails, setOrderDetails] = useState({
      orderID: "",
      userID: "",
      orderType: "buy",
      ticker: "",
      quantity: "",
      price: "",
      orderTime: "",
      orderStatus: "",
   });

   //state for returning a message when a user starts a buy/sell order:
   const [orderFeedback, setOrderFeedback] = useState("");

   // handle user input on the form when placing a buy/sell order, passed as props to the StockOrderForm.js
   const handleChange = (e) => {
      const { name, value } = e.target;
      setOrderDetails({ ...orderDetails, [name]: value });
   };

   // handle submit of form, passed as props to StockOrderForm.js
   const handleSubmit = (e) => {
      startTradeOrder();
   };

   // send trade order to back end via body of an axios request
   const startTradeOrder = async () => {
      //set the remaining body of orderDetails:
      orderDetails.orderID = uuidv4();
      orderDetails.userID = user.userID;
      orderDetails.quantity = parseInt(orderDetails.quantity);
      orderDetails.price = parseInt(orderDetails.price);
      orderDetails.orderTime = new Date();
      orderDetails.orderStatus = "Pending";

      console.log("order: ", orderDetails);

      try {
         await axios
            .post(`${stockOrderingURL}/startTradeOrder`, { orderDetails })
            .then(
               setOrderFeedback(
                  `${user.firstName}'s ${orderDetails.orderType} order for ${orderDetails.quantity} shares of ${orderDetails.ticker} at ${orderDetails.price} $ was sent`
               )
            );
      } catch (err) {
         console.log("did not send", err);
         setOrderFeedback("you order was not sent");
      }
   };

   return (
      <div className="stock-market">
         <StockOrderForm
            orderDetails={orderDetails}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
         />
         <div>{orderFeedback}</div>
      </div>
   );
};

export default StockOrdering;
