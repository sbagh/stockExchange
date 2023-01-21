import React from "react";

const BuyStockForm = ({ buyOrderDetails, handleChange, startBuyOrder }) => {
   return (
      <div>
         <h2>Buy a stock</h2>
         <form>
            <label>
               Ticker:
               <input
                  type="text"
                  name="ticker"
                  value={buyOrderDetails.ticker}
                  onChange={handleChange}
               />
            </label>
            <br />
            <label>
               Quantity:
               <input
                  type="number"
                  name="quantity"
                  value={buyOrderDetails.quantity}
                  onChange={handleChange}
               />
            </label>
            <br />
            <label>
               Price:
               <input
                  type="number"
                  name="price"
                  value={buyOrderDetails.price}
                  onChange={handleChange}
               />
            </label>
            <br />
            <button type="button" onClick={startBuyOrder}>
               Submit
            </button>
         </form>
      </div>
   );
};

export default BuyStockForm;
