const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

const userAccountsPORT = 4000;

// require db connection and queries:
const service = require("./dbQueries");

// query db for all users (db: user_accounts, table: users)
app.get("/getAllUsers", (req, res) => {
   service.getAllUsers(req, res).then((users) => {
      // console.log(users);
      res.send(users);
   });
});

app.listen(
   userAccountsPORT,
   console.log("user accounts microservice running on port  ", userAccountsPORT)
);
