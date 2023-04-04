import React from "react";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const LandingPage = ({ setLoggedIn }) => {
   const [isLoginForm, setIsLoginForm] = useState(true);

   // toggle login or signup form on button click
   const handleFormToggle = () => {
      setIsLoginForm(!isLoginForm);
   };

   return (
      <div className="Landing-page">
         <div className="Landing-page-content">
            <div className="Landing-page-title">
               Stock Exchange
               <br /> & Investments
            </div>

            {isLoginForm ? (
               <>
                  <p className="login-signup-message">
                     login to your account or
                     <button
                        onClick={handleFormToggle}
                        className={"Form-toggle-button"}
                     >
                        {" "}
                        sign up here
                     </button>
                  </p>
                  <LoginForm setLoggedIn={setLoggedIn} />{" "}
               </>
            ) : (
               <>
                  <p className="login-signup-message">
                     already have an account?
                     <button
                        onClick={handleFormToggle}
                        className={"Form-toggle-button"}
                     >
                        {" "}
                        login here
                     </button>
                  </p>
                  <SignupForm setLoggedIn={setLoggedIn} />
               </>
            )}
         </div>
      </div>
   );
};

export default LandingPage;
