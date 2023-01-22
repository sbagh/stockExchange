import React, { useEffect, useState } from "react";
import BuyStockForm from "./BuyStockForm";
import axios from "axios";

const StockMarket = ({ stockData, userPortfolio, user }) => {
   //state and related functions for buying a stock
   const [buyOrderDetails, setBuyOrderDetails] = useState({
      ticker: "",
      quantity: "",
      price: "",
   });

   const handleChange = (event) => {
      const { name, value } = event.target;
      setBuyOrderDetails({ ...buyOrderDetails, [name]: value });
   };

   const startBuyOrder = async () => {
      console.log(
         `Order set for ${buyOrderDetails.quantity} shares of ${buyOrderDetails.ticker} at ${buyOrderDetails.price}`
      );

      //Update user's portfolio (add new stocks bought and remove cost from user's cash)
      //1- find users portfolio (already used here)
      //2- find index of the stock ticker being bought inside the userPortfolio.stocks object
      const stockIndex = userPortfolio.Stocks.findIndex(
         (stock) => stock.name === buyOrderDetails.ticker
      );
      //3-  if the stock already exists(stockindex !===-1), then add the bought qty, otherwise add the ticker to the object and assign qty as value
      if (stockIndex !== -1) {
         userPortfolio.Stocks[stockIndex].quantity += parseInt(
            buyOrderDetails.quantity
         );
      } else {
         userPortfolio.Stocks.push({
            name: buyOrderDetails.ticker,
            quantity: parseInt(buyOrderDetails.quantity),
         });
      }
      //4- now reduce cash the user had by price bought * qty bought
      userPortfolio.cash -=
         parseInt(buyOrderDetails.price) * parseInt(buyOrderDetails.quantity);

      console.log(userPortfolio, user);

      // 5- now we have updated the parameteres of userPortfolio, we will send it to back-end and update the userPortfolio.json file
      try {
         await axios.put("http://localhost:5555/updateUserPortfolio", {
            user,
            userPortfolio,
         });
         console.log("userPortfolio updated successfuly");
      } catch (err) {
         console.log("error, did not update: ", err);
      }
   };

   return (
      <div>
         <h2> Stock Market </h2>
         <p>
            Stock: {stockData.symbol}, Current price: {stockData.price}
         </p>

         <BuyStockForm
            buyOrderDetails={buyOrderDetails}
            handleChange={handleChange}
            startBuyOrder={startBuyOrder}
         />
      </div>
   );
};

export default StockMarket;
