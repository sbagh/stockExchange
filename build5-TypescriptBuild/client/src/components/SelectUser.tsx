import React, { useEffect } from "react";
import type { User } from "../interfaces/interfaces";

// URL to user accounts micorservice, index.js
const userAccountsURL = "http://localhost:4000";

interface Props {
   users: User[];
   setUsers: React.Dispatch<React.SetStateAction<User[]>>;
   setUser: React.Dispatch<React.SetStateAction<User>>;
   setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectUser = ({ users, setUsers, setUser, setLoggedIn }: Props) => {
   // useEffect to fetch all the users from the user_accounts db
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
   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedUser = users.find(
         (user) => user.userID === parseInt(e.target.value)
      );
      if (selectedUser) setUser(selectedUser);
   };

   const logOut = () => {
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
