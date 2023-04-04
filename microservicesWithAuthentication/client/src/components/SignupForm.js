import React, { useState } from "react";
import axios from "axios";

const userAccountsURL = "http://localhost:4000";

const SignupForm = ({ setLoggedIn }) => {
   //state to save user credentials
   const [userCredentials, setUserCredentials] = useState({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
   });

   //handle change in form when user inputs username and password
   const handleChange = (event) => {
      const { name, value } = event.target;
      setUserCredentials({ ...userCredentials, [name]: value });
   };

   // handle submit to send userCredentials to backend, and receive JWT and userID
   const handleSubmit = (event) => {
      event.preventDefault();
      console.log(userCredentials);
      startSignUp(userCredentials);
   };

   // start the sign up process
   const startSignUp = async (userCredentials) => {
      //axios post to backend
      try {
         const response = await axios.post(
            `${userAccountsURL}/signup`,
            userCredentials
         );
         //get userID and JWT token from respone sent from back-end
         const { userID, token } = response.data;
         // store userID and token in browser local storage
         localStorage.setItem("token", token);
         localStorage.setItem("userID", userID);
      } catch (error) {
         console.log("error in sending userCredentials to backend in signup");
         throw error;
      }
   };

   return (
      <div className="signup-form">
         <label>
            username
            <input
               type="text"
               value={userCredentials.username}
               name="username"
               onChange={handleChange}
            />
         </label>
         <label>
            passowrd
            <input
               type="password"
               value={userCredentials.password}
               name="password"
               onChange={handleChange}
            />
         </label>
         <label>
            first name
            <input
               type="text"
               value={userCredentials.firstName}
               name="firstName"
               onChange={handleChange}
            />
         </label>
         <label>
            last name
            <input
               type="text"
               value={userCredentials.lastName}
               name="lastName"
               onChange={handleChange}
            />
         </label>
         <button onClick={handleSubmit}>Sign Up!</button>
      </div>
   );
};

export default SignupForm;
