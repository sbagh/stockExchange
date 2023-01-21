import React, { useEffect, useState } from "react";
import BuyStockForm from "./BuyStockForm";

const StockMarket = ({ stockData }) => {
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

   const startBuyOrder = (e) => {
      console.log(
         `Order set for ${buyOrderDetails.quantity} shares of ${buyOrderDetails.ticker} at ${buyOrderDetails.price}`
      );
      e.preventDefault()
      fetch("http://localhost:5555/updateUserPortfolio", {
         method: "PUT",
         body: JSON.stringify({
            

         })

      })

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
