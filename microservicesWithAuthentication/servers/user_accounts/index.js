const express = require("express");
const cors = require("cors");
const userService = require("./services/userServices.js");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const userAccountsPORT = 4000;

// get all users
app.get("/getAllUsers", async (req, res) => {
   const users = await userService.getAllUsers();
   // console.log(users);
   res.send(users);
});

// create a user
app.post("/signup", async (req, res) => {
   // destructure username and password from req.body
   const { username, password, firstName, lastName } = req.body;
   console.log(username, password, firstName, lastName);
   // create user using UserService
   const newUser = await userService.createUser(
      username,
      password,
      firstName,
      lastName
   );
   res.json(newUser);
});

// authenticate and login a user
app.post("/login", async (req, res) => {
   //desctructure username and password from req.body
   const { username, password } = req.body;
   console.log(username, password);
   //get login reponse from user service
   const loginRepsonse = await userService.loginUser(username, password);
   // send back login success (userid, token) or fail
   if (loginRepsonse) {
      res.json(loginRepsonse);
   } else {
      res.status(400).json(loginRepsonse);
   }
});

app.listen(
   userAccountsPORT,
   console.log("user accounts microservice running on port  ", userAccountsPORT)
);
