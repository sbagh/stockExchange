import React from "react";

const TradeHistory = ({ tradeHistoryData, tradeHistoryDataIsLoading }) => {
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
                        <th>{trade.buyer.name}</th>
                        <th>{trade.seller.name}</th>
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
