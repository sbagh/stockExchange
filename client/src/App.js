import React, { useState, useEffect } from "react";
import UserPortfolio from "./components/UserPortfolio";
import StockMarket from "./components/StockMarket";

const App = () => {
   //state and useEffect for rendering and fetching User Portfolio:
   const [userPortfolio, setUserPortfolio] = useState(null);
   const [user, setUser] = useState("user1");
   
   useEffect(() => {
      fetch(`http://localhost:5555/userPortfolio?user=${user}`)
         .then((res) => res.json())
         .then((data) => {
            console.log(data);
            setUserPortfolio(data);
         })
         .catch((err) => console.log(err));
   }, []);

   //state and useEffect for rendering and fetching data about a stock
   const [stockData, setStockData] = useState(null);
   useEffect(() => {
      fetch("http://localhost:5555/stockData?ticker=TSLA")
         .then((res) => res.json())
         .then((data) => {
            console.log(data);
            setStockData(data);
         })
         .catch((err) => console.log(err.message));
   }, []);

   return (
      <div>
         {userPortfolio && (
            <UserPortfolio userPortfolio={userPortfolio} user={user} />
         )}
         {stockData && (
            <StockMarket
               stockData={stockData}
               userPortfolio={userPortfolio}
               user={user}
            />
         )}
      </div>
   );
};

export default App;
