import React, { useState, useEffect } from "react";

const StockPrices = ({
   stockData,
   setStockData,
   stockDataIsLoading,
   setStockDataIsLoading,
}) => {
   //useEffect for rendering and fetching stock data (current price, ticker..etc)
   useEffect(() => {
      const fetchData = () => {
         fetch("http://localhost:5555/getStockData")
            .then((res) => res.json())
            .then((data) => {
               setStockData(data);
               setStockDataIsLoading(false);
            })
            .catch((err) => console.log(err.message));
      };

      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="stock-prices">
         <h2>Stock Marketplace</h2>
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
                        <th>{stock.last_update}</th>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
};

export default StockPrices;
