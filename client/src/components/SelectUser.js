import React, { useState, useEffect } from "react";

const SelectUser = ({ users, setUsers, setUser }) => {
   // useEffect to fetch all the users from the DB table, user_portfolio
   // returned is an array of objects in this form: [{user_id:1, user_name:'user1', cash:'20000'}]
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

   // handle change when selecting a new user from drop-down list
   const handleChange = (e) => {
      const selectedUser = users.find(
         (user) => user.user_id === parseInt(e.target.value)
      );
      setUser(selectedUser);
   };

   return (
      <div className="select-user">
         <label>Select user:</label>
         <select onChange={handleChange}>
            {users.map((user) => (
               <option key={user.user_id} value={user.user_id}>
                  {user.user_name}
               </option>
            ))}
         </select>
      </div>
   );
};

export default SelectUser;
