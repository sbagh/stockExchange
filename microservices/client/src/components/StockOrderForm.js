import React from "react";

const StockOrderForm = ({ orderDetails, handleChange, handleSubmit }) => {
   return (
      <div className="stock-order-form">
         <h4>Place an Order</h4>
         <form>
            <label>
               Ticker:
               <input
                  type="text"
                  name="ticker"
                  value={orderDetails.ticker}
                  onChange={handleChange}
               />
            </label>
            <br />
            <label>
               Quantity:
               <input
                  type="number"
                  name="quantity"
                  value={orderDetails.quantity}
                  onChange={handleChange}
               />
            </label>
            <br />
            <label>
               Price:
               <input
                  type="number"
                  name="price"
                  value={orderDetails.price}
                  onChange={handleChange}
               />
            </label>
            <br />
            <label>
               Type:
               <select
                  onChange={(e) => handleChange(e)}
                  name="order_type"
                  value={orderDetails.orderType}
               >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
               </select>
            </label>
            <br />
            <button type="button" onClick={handleSubmit}>
               Submit
            </button>
         </form>
      </div>
   );
};

export default StockOrderForm;
