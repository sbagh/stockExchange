import React, { useEffect } from "react";
import io from "socket.io-client";

// stock ordering microservice URL
const stockOrderingURL = "http://localhost:4003";

// setup websocket
let socket = null;
if (!socket) {
   socket = io.connect(stockOrderingURL, {
      origin: "http://localhost:3000",
      transports: ["websocket"],
   });
}

const UserStockOrders = ({ userID, userOrderHistory, setUserOrderHistory }) => {
   //use effect to fetch the specific user's stock orders
   useEffect(() => {
      const getUserOrders = async () => {
         // emit current userID to back end
         await socket.emit("currentUserID", userID);
         // remove the event listener before adding it again
         socket.off("userOrderHistory");
         // get user's order history from back end
         await socket.on("userOrderHistory", (userOrderHistory) => {
            console.log(userOrderHistory);
            setUserOrderHistory(userOrderHistory);
         });
      };
      getUserOrders();
   }, [userID]);

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
