const amqp = require("amqplib");

let senderConnection = null;
let senderChannel = null;

const QueueName = "stock_orders";
const RabbitMqUrl = "amqp://127.0.0.1:5672";

const sendToStockOrderingQueue = async (orderDetails) => {
   try {
      // creaate connection
      senderConnection = await amqp.connect(RabbitMqUrl);
      // create channel
      senderChannel = await senderConnection.createChannel();
      // assert Queue, set durability = true in case of server crash or restart
      await senderChannel.assertQueue(QueueName, { durability: true });
      // create and send the message to queue
      senderChannel.sendToQueue(
         QueueName,
         Buffer.from(JSON.stringify(orderDetails))
      );

      console.log("order sent to order matching queue: ", orderDetails);

      // close channel and connection
      setTimeout(() => {
         senderChannel.close();
         senderConnection.close();
      }, 500);
   } catch (error) {
      console.log("error in sending order to order matching queu: ", error);
      throw error;
   }
};

// // close channel and connection if server is turned off
// process.on("SIGINT", () => {
//    if (senderChannel) senderChannel.close();
//    if (senderConnection) senderConnection.close();
// });

module.exports = {
   sendToStockOrderingQueue,
};
