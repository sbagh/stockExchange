import React, { useState, useEffect } from "react";
import UserPortfolio from "./components/UserPortfolio";
import StockMarket from "./components/StockMarket";
import SelectUser from "./components/SelectUser";
import StockPrices from "./components/StockPrices";
import TradeHistory from "./components/TradeHistory";
import io from "socket.io-client";

const App = () => {
   //state for selecting users, passed as props to SelectUser component
   const [user, setUser] = useState({ user_id: 1, name: "user1" });
   const [users, setUsers] = useState([]);

   // useEffect to fetch all the users from the DB table, user_portfolio
   useEffect(() => {
      fetch("http://localhost:5555/getAllUsers")
         .then((res) => {
            if (!res.ok) {
               throw new Error("network response was not ok");
            }
            return res.json();
         })
         .then((data) => {
            console.log(data);
            setUsers(data);
         })
         .catch((err) => console.log(err));
   }, []);

   //state and useEffect for rendering and fetching User Portfolio:
   const [userPortfolio, setUserPortfolio] = useState(null);
   useEffect(() => {
      const fetchData = () => {
         fetch(`http://localhost:5555/userPortfolio?user=${user.name}`)
            .then((res) => res.json())
            .then((data) => {
               setUserPortfolio(data);
            })
            .catch((err) => console.log(err));
      };

      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
   }, [user]);

   //state and useEffect for rendering and fetching data about a stock (current price, ticker..etc)
   const [stockData, setStockData] = useState({});
   const [stockDataIsLoading, setStockDataIsLoading] = useState(true);
   useEffect(() => {
      const fetchData = () => {
         fetch("http://localhost:5555/stockData")
            .then((res) => res.json())
            .then((data) => {
               setStockData(data);
               setStockDataIsLoading(false);
            })
            .catch((err) => console.log(err.message));
      };

      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
   }, []);

   //state and useEffect for rendering stock trade history from tradeHistory.json
   const [tradeHistoryData, setTradeHistoryData] = useState({});
   const [tradeHistoryDataIsLoading, setTradeHistoryDataIsLoading] =
      useState(true);
   useEffect(() => {
      const fetchData = () => {
         fetch("http://localhost:5555/tradeHistory")
            .then((res) => res.json())
            .then((data) => {
               setTradeHistoryData(data);
               setTradeHistoryDataIsLoading(false);
               // console.log(data);
            })
            .catch((err) => console.log("did not get data", err));
      };
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
   }, [tradeHistoryData]);

   return (
      <div>
         {users.length > 0 && <SelectUser users={users} onChange={setUser} />}
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
