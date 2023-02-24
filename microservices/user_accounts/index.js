const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const user_accounts_PORT = 4000;

// require db connection and queries:
const service = require("./db_queries");

// query db for all users (db table: user_portfolio)
app.get("/getAllUsers", (req, res) => {
   service.getAllUsers(req, res).then((users) => {
      // console.log(users);
      res.send(users);
   });
});

app.listen(
   user_accounts_PORT,
   console.log(
      "user accounts microservice running on port  ",
      user_accounts_PORT
   )
);
