import React, { useState } from "react";
import UserPortfolio from "./components/UserPortfolio";
import StockOrdering from "./components/StockOrdering";
import SelectUser from "./components/SelectUser";
import StockData from "./components/StockData";
// import TradeHistory from "./components/TradeHistory";
import UserStockOrders from "./components/UserStockOrders";

const App = () => {
   // state for redering all users from the db user_accounts table users
   const [users, setUsers] = useState([]);

   //state for selecting a user , passed as props to SelectUser component
   const [user, setUser] = useState({});

   //state for rendering a users portfolio including stocks held and cash:
   const [userCashHoldings, setUserCashHoldings] = useState([]);
   const [userStockHoldings, setUserStockHoldings] = useState([]);

   //  //state for rendering a user's stock orders
   const [userOrderHistory, setUserOrderHistory] = useState([]);

   //  //state for rendering stock data (current price, ticker..etc)
   const [stockData, setStockData] = useState({});
   const [stockDataIsLoading, setStockDataIsLoading] = useState(true);

   //  //state for rendering stock trade history from tradeHistory.json
   //  const [tradeHistoryData, setTradeHistoryData] = useState({});
   //  const [tradeHistoryDataIsLoading, setTradeHistoryDataIsLoading] =
   //     useState(true);

   return (
      <div>
         <SelectUser users={users} setUsers={setUsers} setUser={setUser} />

         <div className="main-container">
            {user.userID && (
               <UserPortfolio
                  className="user-portfolio"
                  user={user}
                  userCashHoldings={userCashHoldings}
                  setUserCashHoldings={setUserCashHoldings}
                  userStockHoldings={userStockHoldings}
                  setUserStockHoldings={setUserStockHoldings}
               />
            )}
            <StockOrdering className="stock-market" user={user} />
            {user.userID && (
               <UserStockOrders
                  userID={user.userID}
                  userOrderHistory={userOrderHistory}
                  setUserOrderHistory={setUserOrderHistory}
               />
            )}
            <StockData
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
