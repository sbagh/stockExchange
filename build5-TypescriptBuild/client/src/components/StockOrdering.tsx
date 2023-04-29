import React, { useEffect, useState } from "react";
import StockOrderForm from "./StockOrderForm";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type { StockOrder, User } from "../interfaces/interfaces";

// stock ordering microservice URL
const stockOrderingURL = "http://localhost:4003";

interface Props {
   user: User;
}

const StockOrdering = ({ user }: Props) => {
   //state for setting order details when buying/selling a stock
   const [orderDetails, setOrderDetails] = useState<StockOrder>({
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
   const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

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
      //set the remaining body of orderDetails:
      orderDetails.orderID = uuidv4();
      orderDetails.userID = user.userID;
      orderDetails.quantity = orderDetails.quantity;
      orderDetails.price = orderDetails.price;
      orderDetails.orderTime = new Date();
      orderDetails.orderStatus = "Pending";

      console.log("order: ", orderDetails);

      try {
         await axios
            .post(`${stockOrderingURL}/startTradeOrder`, { orderDetails })
            .then(() =>
               // set order feedback message if order is successfuly sent to back end
               setOrderFeedback(
                  `${user.firstName}'s ${orderDetails.orderType} order for ${orderDetails.quantity} shares of ${orderDetails.ticker} at ${orderDetails.price} $ was sent`
               )
            );
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
         <div>{orderFeedback}</div>
      </div>
   );
};

export default StockOrdering;
