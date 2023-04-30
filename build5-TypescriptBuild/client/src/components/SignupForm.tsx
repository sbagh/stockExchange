import React, { useState } from "react";
import axios from "axios";
import type { UserSignupCredentials } from "../interfaces/interfaces";

const userAccountsURL = "http://localhost:4000";

interface Props {
   setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupForm = ({ setLoggedIn }: Props) => {
   //state to save user credentials
   const [userSignUpCredentials, setUserSignUpCredentials] =
      useState<UserSignupCredentials>({
         username: "",
         password: "",
         firstName: "",
         lastName: "",
      });

   const [signUpFeedback, setSignUpFeedback] = useState<string>("");

   //handle change in form when user inputs username and password
   const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = event.target;
      setUserSignUpCredentials({ ...userSignUpCredentials, [name]: value });
   };

   // handle submit to send userCredentials to backend, and receive JWT and userID
   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // console.log(userSignUpCredentials);
      startSignUp(userSignUpCredentials);
   };

   // start the sign up process
   const startSignUp = async (userSignUpCredentials) => {
      //axios post to backend
      try {
         const response = await axios.post(
            `${userAccountsURL}/signup`,
            userSignUpCredentials
         );
         setSignUpFeedback("congratulations, your are now signed up!");
         //get userID and JWT token from respone sent from back-end
         const { userID, token } = response.data;
         // store userID and token in browser local storage
         localStorage.setItem("token", token);
         localStorage.setItem("userID", userID);
         // log the user in
         setLoggedIn(true);
      } catch (error) {
         console.log(
            "error in sending userCredentials to backend during signup"
         );
         throw error;
      }
   };

   return (
      <div className="signup-form">
         <form onSubmit={handleSubmit}>
            <label>
               username
               <input
                  type="text"
                  value={userSignUpCredentials.username}
                  name="username"
                  onChange={handleChange}
               />
            </label>
            <label>
               passowrd
               <input
                  type="password"
                  value={userSignUpCredentials.password}
                  name="password"
                  onChange={handleChange}
               />
            </label>
            <label>
               first name
               <input
                  type="text"
                  value={userSignUpCredentials.firstName}
                  name="firstName"
                  onChange={handleChange}
               />
            </label>
            <label>
               last name
               <input
                  type="text"
                  value={userSignUpCredentials.lastName}
                  name="lastName"
                  onChange={handleChange}
               />
            </label>
            <button type="submit">Sign Up</button>
         </form>
         <p>{signUpFeedback}</p>
      </div>
   );
};

export default SignupForm;
