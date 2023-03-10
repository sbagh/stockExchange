import React, { useState, useEffect } from "react";

const userPortfolioURL = "http://localhost:4001";

const UserPortfolio = ({
   userCashHoldings,
   setUserCashHoldings,
   userStockHoldings,
   setUserStockHoldings,
   user,
}) => {
   //useEffect to fetch user's cash and stock holdings from cash_holdings and stock_holdings tables
   useEffect(() => {
      const fetchUserPortfolio = async () => {
         try {
            // get user's cash holdings based on userID
            let cashHoldingsResponse = await fetch(
               `${userPortfolioURL}/getUserCashHoldings?userID=${user.userID}`
            );
            // get user's stock holdings based on userID
            let stockHoldingsResponse = await fetch(
               `${userPortfolioURL}/getUserStockHoldings?userID=${user.userID}`
            );

            // check if status is ok
            if (!cashHoldingsResponse.ok || !stockHoldingsResponse.ok) {
               return "there was a network failure";
            }

            // .json() returns a promise, so use await
            const cashHoldings = await cashHoldingsResponse.json();
            const stockHoldings = await stockHoldingsResponse.json();

            setUserCashHoldings(cashHoldings);
            setUserStockHoldings(stockHoldings);

            // console.log(userCashHoldings);
            // console.log(userStockHoldings);
         } catch (error) {
            console.log(error);
         }
      };
      fetchUserPortfolio();
      const interval = setInterval(fetchUserPortfolio, 5000);
      return () => clearInterval(interval);
   }, [user]);

   return (
      <div className="user-portfolio">
         <h4> User Portfolio: {user.user_name}</h4>

         <p className="user-cash-holdings">Cash: {userCashHoldings}</p>

         <div className="user-stock-holdings">
            {userStockHoldings.map((stock) => (
               <div key={stock.ticker}>
                  {stock.ticker} : {stock.quantity}
               </div>
            ))}
         </div>
      </div>
   );
};

export default UserPortfolio;
