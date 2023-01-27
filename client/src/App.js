import React, { useState, useEffect } from "react";
import UserPortfolio from "./components/UserPortfolio";
import StockMarket from "./components/StockMarket";
import SelectUser from "./components/SelectUser";
import StockPrices from "./components/StockPrices";
import TradeHistory from "./components/TradeHistory";

const App = () => {
   //state for selecting users, passed as props to SelectUser component
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

   //state and useEffect for rendering and fetching data about a stock (current price, ticker..etc)
   const [stockData, setStockData] = useState({});
   const [stockDataIsLoading, setStockDataIsLoading] = useState(true);
   useEffect(() => {
      fetch("http://localhost:5555/stockData")
         .then((res) => res.json())
         .then((data) => {
            setStockData(data);
            setStockDataIsLoading(false);
         })
         .catch((err) => console.log(err.message));
   }, []);

   //state and useEffect for rendering stock trade history from tradeHistory.json
   const [tradeHistoryData, setTradeHistoryData] = useState({});
   const [tradeHistoryDataIsLoading, setTradeHistoryDataIsLoading] =
      useState(true);
   useEffect(() => {
      fetch("http://localhost:5555/tradeHistory")
         .then((res) => res.json())
         .then((data) => {
            setTradeHistoryData(data);
            setTradeHistoryDataIsLoading(false);
            // console.log(data);
         })
         .catch((err) => console.log("did not get data", err));
   }, []);

   return (
      <div>
         <SelectUser users={users} onChange={setUser} />

         <div className="main-container">
            {userPortfolio && (
               <UserPortfolio
                  className="user-portfolio"
                  userPortfolio={userPortfolio}
                  user={user}
               />
            )}

            {stockData && (
               <StockMarket
                  key={userPortfolio}
                  className="stock-market"
                  stockData={stockData}
                  userPortfolio={userPortfolio}
                  user={user}
               />
            )}
            {stockData && (
               <StockPrices
                  stockData={stockData}
                  stockDataIsLoading={stockDataIsLoading}
               />
            )}

            {tradeHistoryData && (
               <TradeHistory
                  tradeHistoryData={tradeHistoryData}
                  tradeHistoryDataIsLoading={tradeHistoryDataIsLoading}
               />
            )}
         </div>
      </div>
   );
};

export default App;
