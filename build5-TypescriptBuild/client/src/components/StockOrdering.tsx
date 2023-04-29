import React, { useState } from "react";
import StockOrderForm from "./StockOrderForm";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type { StockOrderDetails, User } from "../interfaces/interfaces";

// stock ordering microservice URL
const stockOrderingURL = "http://localhost:4003";

interface Props {
   user: User;
}

const StockOrdering = ({ user }: Props) => {
   //state for setting order details when buying/selling a stock
   const [orderDetails, setOrderDetails] = useState<StockOrderDetails>({
      orderID: "",
      userID: null,
      orderType: "buy",
      ticker: "",
      quantity: null,
      price: null,
      orderTime: null,
      orderStatus: "",
   });
   //  orderDetails object properties :

   //state for returning a message when a user starts a buy/sell order:
   const [orderFeedback, setOrderFeedback] = useState<string>(
      " Buy or sell a stock"
   );

   // handle user input on the form when placing a buy/sell order, passed as props to the StockOrderForm.js
   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // convert user input for quantity and price from type string to number
      const parsedValue =
         name === "quantity" || name === "price" ? parseFloat(value) : value;
      setOrderDetails({ ...orderDetails, [name]: parsedValue });
   };

   // handle submit of form, passed as props to StockOrderForm.js
   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      startTradeOrder();
   };

   // send trade order to back end via body of an axios request
   const startTradeOrder = async () => {
      //set the remaining body of orderDetails (ticker, price, quantity, orderType are alredy set in handleChange):
      orderDetails.orderID = uuidv4();
      orderDetails.userID = user.userID;
      orderDetails.orderTime = new Date();
      orderDetails.orderStatus = "Pending";

      // console.log("order: ", orderDetails);

      try {
         if (
            orderDetails.userID &&
            orderDetails.quantity &&
            orderDetails.price &&
            orderDetails.orderTime
         ) {
            await axios.post(`${stockOrderingURL}/startTradeOrder`, {
               orderDetails,
            });
         } else {
            throw Error;
         }
      } catch (err) {
         console.log("did not send stock order: ", err);
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
         <br></br>
         {orderFeedback}
      </div>
   );
};

export default StockOrdering;
