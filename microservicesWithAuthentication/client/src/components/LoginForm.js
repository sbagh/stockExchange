import React from "react";
import { useState } from "react";

const LoginForm = ({ setLoggedIn }) => {
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [feedback, setFeedback] = useState("");

   return <div className="login-form">login form</div>;
};

export default LoginForm;
