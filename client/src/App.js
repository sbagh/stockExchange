import React, { useState, useEffect } from "react";
import UserPortfolio from "./components/UserPortfolio";
import StockMarket from "./components/StockMarket";
import SelectUser from "./components/SelectUser";

const App = () => {
   //state for selecting user, passed as props to SelectUser component
   const [user, setUser] = useState({ id: 1, name: "user1" });
   const users = [
      { id: 1, name: "user1" },
      { id: 2, name: "user2" },
      { id: 3, name: "user3" },
   ];

   //state and useEffect for rendering and fetching User Portfolio:
   const [userPortfolio, setUserPortfolio] = useState(null);
   useEffect(() => {
      fetch(`http://localhost:5555/userPortfolio?user=${user.name}`)
         .then((res) => res.json())
         .then((data) => {
            setUserPortfolio(data);
         })
         .catch((err) => console.log(err));
   }, [user]);

   //state and useEffect for rendering and fetching data about a stock
   const [stockData, setStockData] = useState(null);
   useEffect(() => {
      fetch("http://localhost:5555/stockData?ticker=TSLA")
         .then((res) => res.json())
         .then((data) => {
            setStockData(data);
         })
         .catch((err) => console.log(err.message));
   }, []);

   //not in use atm: callback function, passed as props to StockMarket-startBuyOrder, when called it will re-render userPortfolio
   function refreshUserPortfolio() {
      console.log("refreshed user portfolio");
      return "completed refresh";
   }

   return (
      <div>
         <SelectUser users={users} onChange={setUser} />
         {userPortfolio && (
            <UserPortfolio userPortfolio={userPortfolio} user={user} />
         )}
         {stockData && (
            <StockMarket
               stockData={stockData}
               userPortfolio={userPortfolio}
               user={user}
               refreshUserPortfolio={refreshUserPortfolio}
            />
         )}
      </div>
   );
};

export default App;
