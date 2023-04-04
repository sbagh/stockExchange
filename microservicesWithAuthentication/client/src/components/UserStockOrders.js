import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// stock ordering microservice URL
const stockOrderingURL = "http://localhost:4003";

const UserStockOrders = ({ userID, userOrderHistory, setUserOrderHistory }) => {
   // store websocket connection in a state
   const [socket, setSocket] = useState(null);

   //use effect to fetch the specific user's stock orders
   useEffect(() => {
      // 1- setup websocket
      const setupSocket = () => {
         if (!socket) {
            setSocket(
               io.connect(stockOrderingURL, {
                  origin: "http://localhost:3000",
                  transports: ["websocket"],
               })
            );
         }
      };

      //2- get user's stock orders
      const getUserOrders = async () => {
         // emit current userID to back end
         await socket.emit("currentUserID", userID);
         // get user's order history from back end
         await socket.on("userOrderHistory", (userOrderHistory) => {
            console.log("user stock order's:", userOrderHistory);
            setUserOrderHistory(userOrderHistory);
         });
      };
      setupSocket();
      getUserOrders();

      //3- cleanup socket connection on unmount
      return () => {
         if (socket) {
            socket.off("userOrderHistory");
         }
      };
   }, [socket, userID, setUserOrderHistory]);

   // Send a cancel order PUT request to server.js
   const cancelOrder = async (orderID, orderType, orderStatus, userID) => {
      try {
         const response = await fetch(
            `${stockOrderingURL}/cancelTradeOrder?orderID=${orderID}&orderType=${orderType}&orderStatus=${orderStatus}&userID=${userID}`,
            { method: "PUT" }
         );

         if (!response.ok) {
            console.log("Network error");
         }
         const result = await response.json();
         console.log(result);
      } catch (error) {
         console.log(error);
         throw error;
      }
   };

   return (
      <div className="userStockOrdersTable">
         <h4> User Trade Orders</h4>
         <table>
            <thead>
               <tr>
                  {" "}
                  <th>Type</th>
                  <th>Ticker</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Time</th>
                  <th>Order status</th>
                  <th></th>
               </tr>
            </thead>
            <tbody>
               {userOrderHistory.map((order) => {
                  return (
                     <tr key={order.orderID}>
                        <td>{order.orderType}</td>
                        <td>{order.ticker}</td>
                        <td>{order.quantity}</td>
                        <td>{order.price}</td>
                        <td>{order.orderTime}</td>
                        <td>{order.orderStatus}</td>
                        <td>
                           {order.orderStatus === "Open" && (
                              <button
                                 onClick={() =>
                                    cancelOrder(
                                       order.orderID,
                                       order.orderType,
                                       order.orderStatus,
                                       userID
                                    )
                                 }
                              >
                                 Cancel
                              </button>
                           )}
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
   );
};

export default UserStockOrders;
