import React, { useState, useEffect } from "react";

const UserPortfolio = ({ userPortfolio, setUserPortfolio, user }) => {
   //useEffect to fetch user's stock holdings from stock_holdings table
   useEffect(() => {
      const fetchData = () => {
         fetch(
            `http://localhost:5555/userStockHoldings?user_id=${user.user_id}`
         )
            .then((res) => res.json())
            .then((data) => {
               console.log("user portfolio:  ", userPortfolio);
               setUserPortfolio(data);
            })
            .catch((err) => console.log(err));
      };
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
   }, [user]);

   return (
      <div className="user-portfolio">
         {console.log("user :", user)}
         {console.log("userPortfolio2 :", userPortfolio)}

         <h4> User Portfolio: {user.user_name}</h4>

         {userPortfolio.length > 1 &&
            userPortfolio.map((stock) => (
               <div key={stock.stock_ticker}>
                  {stock.stock_ticker} : {stock.quantity} shares
               </div>
            ))}

         <p>Cash: {user.cash}</p>
      </div>
   );
};

export default UserPortfolio;
