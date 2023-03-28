const AWS = require("aws-sdk");

// SQS queue URL
const queueUrl =
   "https://sqs.us-east-1.amazonaws.com/684639648140/sendStockOrders.fifo";

//websocket/socket.io reqiurements
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
// setting socket.io as an app object, to access io in different parts of code
app.set("socketio", io);

// require db connection and queries:
const service = require("./database/dbQueries");
