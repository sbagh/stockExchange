import React, { useState, useEffect } from "react";

const TradeHistory = ({
   tradeHistoryData,
   setTradeHistoryData,
   tradeHistoryDataIsLoading,
   setTradeHistoryDataIsLoading,
}) => {
   
   //use effect to fetch trade history from trade_history table
   useEffect(() => {
      const fetchData = () => {
         fetch("http://localhost:5555/getTradeHistory")
            .then((res) => res.json())
            .then((data) => {
               setTradeHistoryData(data);
               setTradeHistoryDataIsLoading(false);
               // console.log(data);
            })
            .catch((err) => console.log("did not get data", err));
      };
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
   }, [tradeHistoryData]);

   return (
      <div className="trade-history">
         <h2>Trade History Table</h2>
         {tradeHistoryDataIsLoading ? (
            <p>Loading...</p>
         ) : (
            <table>
               <thead>
                  <tr>
                     <th>Ticker</th>
                     <th>Buyer</th>
                     <th>Seller</th>
                     <th>Price</th>
                     <th>Quantity</th>
                     <th>Time</th>
                  </tr>
               </thead>
               <tbody>
                  {tradeHistoryData.map((trade) => (
                     <tr key={trade.time}>
                        <th>{trade.ticker}</th>
                        <th>{trade.buyer_id}</th>
                        <th>{trade.seller_id}</th>
                        <th>{trade.price}</th>
                        <th>{trade.quantity}</th>
                        <th>{trade.time}</th>
                     </tr>
                  ))}
               </tbody>
            </table>
         )}
      </div>
   );
};

export default TradeHistory;
