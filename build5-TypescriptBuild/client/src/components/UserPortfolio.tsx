import React, { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import type {
   User,
   CashHoldings,
   StockHoldings,
} from "../interfaces/interfaces";

// user portfolio microservice url
const userPortfolioURL = "http://localhost:4001";

//typescript interfaces:
interface Props {
   user: User;
}

const UserPortfolio = ({ user }: Props) => {
   //state for rendering a users portfolio including stocks held and cash:
   const [userCashHoldings, setUserCashHoldings] = useState<CashHoldings>({
      // userID: user.userID,
      cash: "0",
   });
   const [userStockHoldings, setUserStockHoldings] = useState<StockHoldings[]>(
      []
   );
   const [socket, setSocket] = useState<Socket | null>(null);

   useEffect(() => {
      //1- setup websocket
      const setupSocket = () => {
         if (!socket) {
            setSocket(
               io(userPortfolioURL, {
                  // origin: "http://localhost:3000",
                  transports: ["websocket"],
               })
            );
         }
      };

      //2 - get user portfolio
      const getUserPortfolio = () => {
         if (socket) {
            //emit user id
            socket.emit("currentUserID", user.userID);
            // get portfolio
            socket.on("userPortfolio", (userPortfolio) => {
               console.log("user portfolio: ", userPortfolio);
               setUserCashHoldings(userPortfolio.userCashHoldings);
               setUserStockHoldings(userPortfolio.userStockHoldings);
            });
         } else {
            setUserStockHoldings([]);
         }
      };

      setupSocket();
      getUserPortfolio();

      //3- cleanup socket connection on unmount
      return () => {
         if (socket) {
            socket.off("userPortfolio");
            socket.disconnect();
         }
      };
   }, [socket, user.userID, setUserCashHoldings, setUserStockHoldings]);

   return (
      <div className="user-portfolio">
         <h4>
            {" "}
            User Portfolio: {user.firstName} {user.lastName}
         </h4>

         <p className="user-cash-holdings">Cash: {userCashHoldings.cash}</p>

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
