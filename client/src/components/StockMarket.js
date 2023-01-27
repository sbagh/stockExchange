import React, { useEffect, useState } from "react";
import StockOrderForm from "./StockOrderForm";
import axios from "axios";

const StockMarket = ({ stockData, userPortfolio, user }) => {
   //state about order details when buying/selling a stock
   const [orderDetails, setOrderDetails] = useState({
      ticker: "",
      quantity: "",
      price: "",
      type: "buy",
   });

   //state for returning a message when user buys/sells a stock:
   const [orderFeedback, setOrderFeedback] = useState("");

   // handle user input on the form when placing a buy/sell order, passed as props to the StockOrderForm.js
   const handleChange = (event) => {
      const { name, value } = event.target;
      setOrderDetails({ ...orderDetails, [name]: value });
   };

   // handle submit of form, passed as props to StockOrderForm.js
   const handleSubmit = async () => {
      if (orderDetails.type === "buy") {
         sendBuyOrder();
      } else if (orderDetails.type === "sell") {
         sendSellOrder();
      }
   };

   // function for calling the back-end when user buys a stock: updates portfolio and sends buy order to stock exchange
   const sendBuyOrder = async () => {
      //Update user's portfolio (add new stocks bought and subtract cost from user's cash):

      //1- find index of the stock ticker being bought inside the userPortfolio.stocks object
      const stockIndex = userPortfolio.Stocks.findIndex(
         (stock) => stock.name === orderDetails.ticker
      );

      //2-  if the stock already exists in the user's portfolio(stockindex !===-1), then add the bought qty, otherwise add the ticker to the object and assign the qty as value
      if (stockIndex !== -1) {
         userPortfolio.Stocks[stockIndex].quantity += parseInt(
            orderDetails.quantity
         );
      } else {
         userPortfolio.Stocks.push({
            name: orderDetails.ticker,
            quantity: parseInt(orderDetails.quantity),
         });
      }

      //3- now subtract the qty*price from the user's cash
      userPortfolio.cash -=
         parseInt(orderDetails.price) * parseInt(orderDetails.quantity);

      //4- now we have updated the parameteres of the userPortfolio object, we will send it to back-end and update the userPortfolio.json file
      try {
         await axios.put("http://localhost:5555/updateUserPortfolio", {
            user,
            userPortfolio,
         });
         console.log("userPortfolio updated successfuly");
      } catch (err) {
         console.log("error, did not update: ", err);
      }

      //5- send the Buy order to the back-end stock exchange
      try {
         await axios.post("http://localhost:5555/stockBuyOrder", {
            user,
            orderDetails,
         });
         console.log("buy order sent");
      } catch (err) {
         console.log("did not send", err);
      }

      //add a feedback message on the ui for the user
      setOrderFeedback(
         `${user.name}'s buy order for ${orderDetails.quantity} shares of ${orderDetails.ticker} at ${orderDetails.price} $ was sent`
      );
   };

   // function for calling the back-end when user sells a stock: updates portfolio and sends sell order to stock exchange:
   const sendSellOrder = async () => {
      //Update user's portfolio (subtract stocks sold and add to user's cash):

      //1- find index of the stock ticker being sold inside the userPortfolio.stocks object
      const stockIndex = userPortfolio.Stocks.findIndex(
         (stock) => stock.name === orderDetails.ticker
      );

      //2-  check quantity of stock user has in portfolio, if it is sell quantity is more than owned stocks, reject, otherwise subtract
      if (userPortfolio.Stocks[stockIndex].quantity < orderDetails.quantity) {
         setOrderFeedback(
            `You do not have enough shares of ${orderDetails.ticker} to sell`
         );
         return `You do not have enough shares of ${orderDetails.ticker} to sell`;
      } else {
         userPortfolio.Stocks[stockIndex].quantity -= orderDetails.quantity;
      }

      //3- now add price*qty to the user's cash
      userPortfolio.cash +=
         parseInt(orderDetails.price) * parseInt(orderDetails.quantity);

      //4- now we have updated the parameteres of userPortfolio, we will send it to back-end and update the userPortfolio.json file
      try {
         await axios.put("http://localhost:5555/updateUserPortfolio", {
            user,
            userPortfolio,
         });
         console.log("userPortfolio updated successfuly");
      } catch (err) {
         console.log("error, did not update: ", err);
      }

      //5- send the Sell order to the back-end stock exchange
      try {
         await axios.post("http://localhost:5555/stockSellOrder", {
            user,
            orderDetails,
         });
         console.log("sell order sent");
      } catch (err) {
         console.log("sell did not send", err);
      }

      //add a feedback message on the ui for the user
      setOrderFeedback(
         `${user.name}'s sell order for ${orderDetails.quantity} shares of ${orderDetails.ticker} at ${orderDetails.price} $ was sent`
      );
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
