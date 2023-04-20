import express from "express";
import cors from "cors";
import * as userService from "./services/userServices.js";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const userAccountsPORT = 4000;

// get all users
app.get("/getAllUsers", async (req, res) => {
   const users = await userService.getAllUsers();
   // console.log(users);
   res.send(users);
});

// authenticate and login a user
app.post("/login", async (req, res) => {
   //desctructure username and password from req.body
   const { username, password } = req.body;
   //get login reponse from user service
   const loginRepsonse = await userService.loginUser(username, password);
   // send back login success (userid, token) or fail
   // if (loginRepsonse) {
   //    res.json(loginRepsonse);
   // } else {
   //    res.status(400).json(loginRepsonse);
   // }
   res.json(loginRepsonse);
});

// create a user
app.post("/signup", async (req, res) => {
   // destructure username and password from req.body
   const { username, password, firstName, lastName } = req.body;
   console.log(username, password, firstName, lastName);
   // create user using UserService
   const signupResponse = await userService.createUser(
      username,
      password,
      firstName,
      lastName
   );
   // response includes {userID, token, success: true, and a message } or success: false and a message
   res.json(signupResponse);
});

app.listen(userAccountsPORT, () =>
   console.log("user accounts microservice running on port  ", userAccountsPORT)
);
