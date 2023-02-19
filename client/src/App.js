import React, { useState, useEffect } from "react";
import UserPortfolio from "./components/UserPortfolio";
import StockMarket from "./components/StockMarket";
import SelectUser from "./components/SelectUser";
import StockPrices from "./components/StockPrices";
import TradeHistory from "./components/TradeHistory";
import UserStockOrders from "./components/UserStockOrders";

const App = () => {
   //state for selecting a user , passed as props to SelectUser component
   const [user, setUser] = useState({});

   // state for redering all users from the db table user_portfolio
   const [users, setUsers] = useState([]);

   //state for rendering a users portfolio including stocks held and cash:
   const [userPortfolio, setUserPortfolio] = useState([]);

   //state for rendering a user's stock orders
   const [userStockOrders, setUserStockOrders] = useState([]);

   //state for rendering stock data (current price, ticker..etc)
   const [stockData, setStockData] = useState({});
   const [stockDataIsLoading, setStockDataIsLoading] = useState(true);

   //state for rendering stock trade history from tradeHistory.json
   const [tradeHistoryData, setTradeHistoryData] = useState({});
   const [tradeHistoryDataIsLoading, setTradeHistoryDataIsLoading] =
      useState(true);

   return (
      <div>
         <SelectUser users={users} setUsers={setUsers} setUser={setUser} />

         <div className="main-container">
            {user.user_id && (
               <UserPortfolio
                  className="user-portfolio"
                  user={user}
                  userPortfolio={userPortfolio}
                  setUserPortfolio={setUserPortfolio}
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

            {user.user_id && (
               <UserStockOrders
                  user_id={user.user_id}
                  userStockOrders={userStockOrders}
                  setUserStockOrders={setUserStockOrders}
               />
            )}

            <StockPrices
               stockData={stockData}
               stockDataIsLoading={stockDataIsLoading}
               setStockData={setStockData}
               setStockDataIsLoading={setStockDataIsLoading}
            />
            {/* <TradeHistory
               tradeHistoryData={tradeHistoryData}
               setTradeHistoryData={setTradeHistoryData}
               tradeHistoryDataIsLoading={tradeHistoryDataIsLoading}
               setTradeHistoryDataIsLoading={setTradeHistoryDataIsLoading}
            /> */}
         </div>
      </div>
   );
};

export default App;
