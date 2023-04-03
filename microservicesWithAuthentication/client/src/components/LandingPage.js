import React from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

const LandingPage = ({ setLoggedIn }) => {
   return (
      <div className="Landing-page">
         <div className="Title">Stock Exchange & Investments</div>
         <div className="login-signup-message">
            login to your account or sign up here
         </div>
         <LoginForm />
         <SignupForm />
      </div>
   );
};

export default LandingPage;
