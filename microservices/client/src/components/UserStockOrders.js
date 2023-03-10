import React, { useEffect } from "react";

// stock ordering microservice URL
const stockOrderingURL = "http://localhost:4003";

const UserStockOrders = ({ userID, userOrderHistory, setUserOrderHistory }) => {
   //use effect to fetch the specific user's stock orders
   useEffect(() => {
      const fetchUserOrders = async () => {
         try {
            const response = await fetch(
               `${stockOrderingURL}/getUserStockOrders?userID=${userID}`
            );
            if (!response.ok) {
               console.log("network error");
            }

            let userOrders = await response.json();
            // console.log(userOrders);
            setUserOrderHistory(userOrders);
         } catch (error) {
            console.log(error);
            throw error;
         }
      };
      fetchUserOrders();
      const interval = setInterval(fetchUserOrders, 5000);
      return () => clearInterval(interval);
   }, [userID]);

   // Send a cancel order PUT request to server.js
   const cancelOrder = async (orderID, orderType, orderStatus) => {
      try {
         const response = await fetch(
            `${stockOrderingURL}/cancelTradeOrder?orderID=${orderID}&orderType=${orderType}&orderStatus=${orderStatus}`,
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
                                       order.orderStatus
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
