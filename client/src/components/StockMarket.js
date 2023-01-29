import React, { useEffect, useState } from "react";
import StockOrderForm from "./StockOrderForm";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const StockMarket = ({ stockData, userPortfolio, user }) => {
   //state about order details when buying/selling a stock
   const [orderDetails, setOrderDetails] = useState({
      orderID: uuidv4(),
      ticker: "",
      quantity: "",
      price: "",
      type: "buy",
   });

   //state for returning a message when user buys/sells a stock:
   const [orderFeedback, setOrderFeedback] = useState("");

   // handle user input on the form when placing a buy/sell order, passed as props to the StockOrderForm.js
   const handleChange = (e) => {
      const { name, value } = e.target;
      setOrderDetails({ ...orderDetails, [name]: value });
   };

   // handle submit of form, passed as props to StockOrderForm.js
   const handleSubmit = () => {
      console.log("order: ", orderDetails);
      sendTradeOrder();
   };

   const sendTradeOrder = async () => {
      // take care of userPortfolio changes on the back-end and Send the order to backend matching class
      try {
         await axios.post("http://localhost:5555/sendTradeOrder", {
            user,
            orderDetails,
         });

         console.log("buy order sent");
         console.log(orderDetails);

         if (orderDetails.orderType === "buy") {
            setOrderFeedback(
               `${user.name}'s buy order for ${orderDetails.quantity} shares of ${orderDetails.ticker} at ${orderDetails.price} $ was sent`
            );
         } else if (orderDetails.orderType === "sell") {
            setOrderFeedback(
               `${user.name}'s sell order for ${orderDetails.quantity} shares of ${orderDetails.ticker} at ${orderDetails.price} $ was sent`
            );
         }
      } catch (err) {
         console.log("did not send", err);
      }
   };

   return (
      <div className="stock-market">
         <StockOrderForm
            orderDetails={orderDetails}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
         />

         <br></br>
         <div>{orderFeedback}</div>
      </div>
   );
};

export default StockMarket;
