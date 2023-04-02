const express = require("express");
const app = express();
app.use(express.json());

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

// aws lambda hanlder function
module.exports.handler = async (event, context) => {
   //import aws-serverless-express library
   const awsServerlessExpress = require("aws-serverless-express");
   // create instance of aws-serverless-express with app object
   const server = awsServerlessExpress.createServer(app);
   // return the proxy function with the server, event, context and "PROMISE" as arguments 
   return awsServerlessExpress.proxy(server, event, context, "PROMISE").promise;
};
