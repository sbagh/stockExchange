import React, { useState, useEffect } from "react";

// URL to user accounts micorservice, index.js
const userAccountsURL = "http://localhost:4000";

const SelectUser = ({ users, setUsers, setUser, setLoggedIn }) => {
   // useEffect to fetch all the users from the db:user_accounts, table:users
   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const response = await fetch(`${userAccountsURL}/getAllUsers`);
            if (!response.ok) {
               throw new Error("network response was not ok");
            }

            //.json() returns a promise, so use await
            let usersData = await response.json();
            setUsers(usersData);
            setUser(usersData[0]);
         } catch (error) {
            console.log(error);
         }
      };
      fetchUsers();
   }, [setUsers, setUser]);

   // handle change when selecting a new user from drop-down list
   const handleChange = (e) => {
      const selectedUser = users.find(
         (user) => user.userID === parseInt(e.target.value)
      );
      setUser(selectedUser);
   };

   const logOut = (e) => {
      localStorage.removeItem("token");
      setLoggedIn(false);
   };

   return (
      <div className="select-user">
         <label>Select user:</label>
         <select onChange={handleChange}>
            {users.map((user) => (
               <option key={user.userID} value={user.userID}>
                  {user.firstName} {user.lastName}
                  {/* {console.log(user)} */}
               </option>
            ))}
         </select>
         <button onClick={logOut}>Log Out</button>
      </div>
   );
};

export default SelectUser;
