import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import UserPortfolio from "./components/UserPortfolio";
import StockOrdering from "./components/StockOrdering";
import SelectUser from "./components/SelectUser";
import StockData from "./components/StockData";
// import TradeHistory from "./components/TradeHistory";
import UserStockOrders from "./components/UserStockOrders";



const App = () => {
   // state for seeing if user is signed in or not
   const [loggedIn, setLoggedIn] = useState(false);

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
      <div className="App">
         {loggedIn ? (
            <div className="main-container">
               <SelectUser
                  users={users}
                  setUsers={setUsers}
                  setUser={setUser}
                  setLoggedIn={setLoggedIn}
               />
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
         ) : (
            <LandingPage setLoggedIn={setLoggedIn} />
         )}
      </div>
   );
};

export default App;
