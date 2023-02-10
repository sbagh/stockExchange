import React, { useState } from "react";

const SelectUser = ({ users, onChange }) => {
   const handleChange = (e) => {
      const selectedUser = users.find(
         (user) => user.id === parseInt(e.target.value)
      );
      onChange(selectedUser);
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
