import React from "react";

const UserPortfolio = ({ userPortfolio, user }) => {
   return (
      <div className="user-portfolio">
         <h4> User Portfolio: {user.name}</h4>
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
