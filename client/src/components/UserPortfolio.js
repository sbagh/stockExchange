import React from "react";

const UserPortfolio = ({ userPortfolio, user }) => {
   return (
      <div>
         <h2> User Portfolio</h2>
         {userPortfolio.Stocks.map((stock) => (
            <div key={stock.name}>
               {stock.name} : {stock.quantity} shares
            </div>
         ))}
         <p>Cash: {userPortfolio.cash}</p>
      </div>
   );
};

export default UserPortfolio;
