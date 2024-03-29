import express from "express";
import cors from "cors";
//import user service functions
import * as userService from "./services/userServices.js";
// imoprt typescript interface
import type {
   UserLoginCredentials,
   UserSignupCredentials,
} from "./interfaces/interfaces";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

//user accounts microservice port
const userAccountsPORT = 4000;

// --------------------- Code Starts Here --------------------- //

// get all users
app.get("/getAllUsers", async (req, res) => {
   const users = await userService.getAllUsers();
   // console.log(users);
   res.send(users);
});

// authenticate and login a user
app.post("/login", async (req, res) => {
   //1- desctructure username and password from req.body
   const { username, password }: UserLoginCredentials = req.body;
   //2- get login reponse from user service
   const loginRepsonse = await userService.loginUser(username, password);
   //3- send back login success (userid, token) or fail
   res.json(loginRepsonse);

   // test if neccessary:
   // if (loginRepsonse) {
   //    res.json(loginRepsonse);
   // } else {
   //    res.status(400).json(loginRepsonse);
   // }
});

// create a user
app.post("/signup", async (req, res) => {
   //1- destructure username and password from req.body
   const { username, password, firstName, lastName }: UserSignupCredentials =
      req.body;
   // console.log(username, password, firstName, lastName);
   //2- create user using UserService
   const signupResponse = await userService.createUser(
      username,
      password,
      firstName,
      lastName
   );
   //3- send response: {userID:, token:, success: true, message:"" } or {success: false, message:""}
   res.json(signupResponse);
});

app.listen(userAccountsPORT, () =>
   console.log("user accounts microservice running on port  ", userAccountsPORT)
);
