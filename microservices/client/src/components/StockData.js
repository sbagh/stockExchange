import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// stock data url
const stockDataURL = "http://localhost:4002";

// setup websocket connectoin
let socket = null;
if (!socket) {
   socket = io.connect(stockDataURL, {
      origin: "http://localhost:3000",
      transports: ["websocket"],
   });
}

const StockPrices = ({
   stockData,
   setStockData,
   stockDataIsLoading,
   setStockDataIsLoading,
}) => {
   // useEfect to get stock data
   useEffect(() => {
      const getStockData = async () => {
         // // listen to stockData event from backend
         await socket.on("stockData", (data) => {
            // console.log('stock data: ',data);
            setStockData(data);
            setStockDataIsLoading(false);
         });
         // // remove the event listener before adding it again
         // socket.off("stockData");
      };
      getStockData();
   }, [setStockData, setStockDataIsLoading]);

   return (
      <div className="stock-prices">
         <h4>Stock Prices</h4>
         {stockDataIsLoading ? (
            <p>Loading....</p>
         ) : (
            <table className="stock-prices table">
               <thead>
                  <tr>
                     <th>Stock</th>
                     <th>Price</th>
                     <th>Last Updated</th>
                  </tr>
               </thead>
               <tbody className="tb">
                  {stockData.map((stock) => (
                     <tr key={stock.ticker}>
                        <th>{stock.ticker}</th>
                        <th>{stock.price}</th>
                        <th>{stock.lastUpdate}</th>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
};

export default StockPrices;
