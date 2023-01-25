import React from "react";

const StockPrices = ({ stockData, stockDataIsLoading }) => {
    
   return (
      <div className="stock-prices">
         <h2> Stock Marketplace </h2>
         {stockDataIsLoading ? (
            <p>Loading....</p>
         ) : (
            stockData.stocks.map((stock) => (
               <div key={stock.symbol}>
                  stock: {stock.symbol} , price: {stock.price}
               </div>
            ))
         )}
      </div>
   );
};

export default StockPrices;
