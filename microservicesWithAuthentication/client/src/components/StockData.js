import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// stock data url
const stockDataURL = "http://localhost:4002";

const StockPrices = ({
   stockData,
   setStockData,
   stockDataIsLoading,
   setStockDataIsLoading,
}) => {
   //state to hold socket connection
   const [socket, setSocket] = useState(null);

   // useEfect to get stock data
   useEffect(() => {
      // 1- setup websocket connectoin
      const setupSocket = () => {
         if (!socket) {
            setSocket(
               io.connect(stockDataURL, {
                  origin: "http://localhost:3000",
                  transports: ["websocket"],
               })
            );
         }
      };
      // 2- get stock data
      const getStockData = async () => {
         if (socket) {
            // // listen to stockData event from backend
            socket.on("stockData", (data) => {
               console.log("stock data: ", data);
               setStockData(data);
               setStockDataIsLoading(false);
            });
         }
      };
      setupSocket();
      getStockData();

      //3- cleanup socket connection on unmount
      return () => {
         if (socket) {
            socket.off("stockData");
         }
      };
   }, [socket, setStockData, setStockDataIsLoading]);

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
                        <td>{stock.ticker}</td>
                        <td>{stock.price}</td>
                        <td>{stock.lastUpdate}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
};

export default StockPrices;
