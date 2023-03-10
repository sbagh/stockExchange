import React, { useState, useEffect } from "react";

const UserPortfolio = ({ userPortfolio, setUserPortfolio, user }) => {
   //useEffect to fetch user's stock holdings from stock_holdings table
   useEffect(() => {
      const fetchUserStockHoldings = async () => {
         try {
            let response = await fetch(
               `http://localhost:5555/userStockHoldings?user_id=${user.user_id}`
            );

            if (!response.ok) {
               return "there was a network failure";
            }

            const userStockHoldings = await response.json();
            setUserPortfolio(userStockHoldings);
            console.log(
               "interval fetching userStockHoldings: ",
               userStockHoldings
            );
         } catch (error) {
            console.log(error);
         }
      };
      fetchUserStockHoldings();
      const interval = setInterval(fetchUserStockHoldings, 5000);
      return () => clearInterval(interval);
   }, [user]);

   return (
      <div className="user-portfolio">
         {/* {console.log("user :", user)}
         {console.log("userPortfolio :", userPortfolio)} */}

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
