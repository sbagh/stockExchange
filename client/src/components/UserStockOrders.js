import React, { useEffect } from "react";

const UserStockOrders = ({ user_id, userStockOrders, setUserStockOrders }) => {
   console.log(user_id);
   useEffect(() => {
      const fetchUserOrders = async () => {
         try {
            const response = await fetch(
               `http://localhost:5555/getUserStockOrders?user_id=${user_id}`
            );

            if (!response.ok) {
               console.log("network error");
            }

            let userOrders = await response.json();
            console.log(userOrders);
            setUserStockOrders(userOrders);
         } catch (error) {
            console.log(error);
            throw error;
         }
      };
      fetchUserOrders();
      const interval = setInterval(fetchUserOrders, 5000);
      return () => clearInterval(interval);
   }, [user_id]);
   return (
      <div className="userStockOrdersTable">
         <h4> User Trade Orders</h4>
         <table>
            <thead>
               <th>Type</th>
               <th>Ticker</th>
               <th>Quantity</th>
               <th>Price</th>
               <th>Time</th>
               <th>Order status</th>
            </thead>
            <tbody>
               {userStockOrders.map((order) => {
                  const [
                     order_type,
                     ticker,
                     quantity,
                     price,
                     order_status,
                     order_time,
                  ] = order.row.slice(1, -1).split(",");
                  return (
                     <tr key={order.row}>
                        <td>{order_type}</td>
                        <td>{ticker}</td>
                        <td>{quantity}</td>
                        <td>{price}</td>
                        <td>{order_time}</td>
                        <td>{order_status}</td>
                     </tr>
                  );
               })}
            </tbody>
         </table>
      </div>
   );
};

export default UserStockOrders;
