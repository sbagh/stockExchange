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
app.post("/createUser", async (req, res) => {
   // destructure username and password from req.body
   const { username, password, firstName, lastName } = req.body;
   // create user using UserService
   const newUser = await userService.createUser(
      username,
      password,
      firstName,
      lastName
   );
   res.json(newUser);
});

app.listen(
   userAccountsPORT,
   console.log("user accounts microservice running on port  ", userAccountsPORT)
);
