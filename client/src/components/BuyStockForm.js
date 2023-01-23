import React from "react";

const BuyStockForm = ({ buyOrderDetails, handleChange, handleSubmit }) => {
   return (
      <div>
         <h4>Buy a stock</h4>
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
            <button type="button" onClick={handleSubmit}>
               Submit
            </button>
         </form>
      </div>
   );
};

export default BuyStockForm;
