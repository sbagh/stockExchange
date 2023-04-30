import React, { useEffect, useState } from "react";
import { formatDate } from "../utils/dateUtils";
import type { StockData } from "../interfaces/interfaces";
import io, { Socket } from "socket.io-client";

// stock data url
const stockDataURL = "http://localhost:4002";

const StockPrices = () => {
   //  //state for rendering stock data (current price, ticker..etc)
   const [stockData, setStockData] = useState<StockData[]>([]);
   const [stockDataIsLoading, setStockDataIsLoading] = useState<Boolean>(true);

   //state to hold socket connection
   const [socket, setSocket] = useState<Socket | null>(null);

   // useEfect to get stock data
   useEffect(() => {
      // 1- setup websocket connectoin
      const setupSocket = () => {
         if (!socket) {
            const options = {
               origin: "http://localhost:3000",
               transports: ["websocket"],
            };
            setSocket(io(stockDataURL, options));
         }
      };
      // 2- get stock data
      const getStockData = async () => {
         if (socket) {
            // // listen to stockData event from backend
            socket.on("stockData", (data: StockData[]) => {
               // console.log("stock data: ", data);
               setStockData(data);
               setStockDataIsLoading(false);
            });
         }
      };
      setupSocket();
      getStockData();

      // 3- cleanup socket connection on unmount
      return () => {
         if (socket) {
            socket.off("stockData");
            //socket disconnect causing major issues, was not emit or listening to socket anymore
            // socket.disconnect();
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
                        <td>{formatDate(stock.lastUpdate)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
};

export default StockPrices;
