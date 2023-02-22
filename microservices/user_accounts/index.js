const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const PORT = 5555;

// require db connection and queries:
const service = require("./db_queries");

// query db for all users (db table: user_portfolio)
app.get("/getAllUsers", (req, res) => {
   service.getAllUsers(req, res).then((users) => {
      // console.log(users);
      res.send(users);
   });
});

app.listen(PORT, console.log("listening on port: ", PORT));
