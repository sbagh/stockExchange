import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import UserPortfolio from "./components/UserPortfolio";
import StockOrdering from "./components/StockOrdering";
import SelectUser from "./components/SelectUser";
import StockData from "./components/StockData";
import UserStockOrders from "./components/UserStockOrders";
// import interfaces
import type { User } from "./interfaces/interfaces";

const App = () => {
   // state to check if user is logged in or not
   const [loggedIn, setLoggedIn] = useState<boolean>(false);

   // state for redering all users from the db user_accounts table users
   const [users, setUsers] = useState<User[]>([]);

   //state for selecting a user , passed as props to SelectUser component
   const [user, setUser] = useState<User>({
      userID: 0,
      firstName: "",
      lastName: "",
   });

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
                  // @ts-ignore
                  <UserPortfolio className="user-portfolio" user={user} />
               )}
               {
                  // @ts-ignore
                  <StockOrdering className="stock-market" user={user} />
               }
               {user.userID && <UserStockOrders user={user} />}
               <StockData />
            </div>
         ) : (
            <LandingPage setLoggedIn={setLoggedIn} />
         )}
      </div>
   );
};

export default App;
