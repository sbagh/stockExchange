import React, { useEffect } from "react";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const LandingPage = ({ setLoggedIn }) => {
   const [isLoginForm, setIsLoginForm] = useState<Boolean>(true);

   // toggle login or signup form on button click
   const handleFormToggle = () => {
      setIsLoginForm(!isLoginForm);
   };

   //check if a JWT exists for user, that way they will not login again
   useEffect(() => {
      const checkJWT = async (): Promise<void> => {
         // get token from local storage (originally stored using LoginForm or SignupForm)
         const token: string | null = await localStorage.getItem("token");
         if (token) {
            setLoggedIn(true);
         }
      };
      checkJWT();
   }, [setLoggedIn]);

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
