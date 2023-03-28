const express = require("express");

const app = express();
app.use(express.json());

const userAccountsPORT = 4000;

// require db connection and queries:
const service = require("./database/dbQueries");

// query db for all users (db: user_accounts, table: users)
app.get("/getAllUsers", (req, res) => {
   service
      .getAllUsers(req, res)
      .then((users) => {
         // console.log(users);
         res.send(users);
      })
      .catch((error) => {
         console.log("error in getAllUsers", error);
         res.status(500).send("error in getAllUsers");
      });
});

// aws hanlder function
module.exports.handler = async (event, context) => {
   const awsServerlessExpress = require("aws-serverless-express");
   const server = awsServerlessExpress.createServer(app);
   return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
