const amqp = require("amqp");

let publisherConnection = null;
let publisherChannel = null;

const QueueName = "stock_orders";
const RabbitMqUrl = "http://127.0.0.1";

const sendToOrderMatchingQue = async (orderDetails) => {
   try {
      // creaate connection
      publisherConnection = await amqp.connect(RabbitMqUrl);
      // create channel
      publisherChannel = await publisherConnection.createChannel();
      // assert Queue, set durability = true in case of server crash or restart
      publisherChannel.assertQueue(QueueName, { durability: true });
      // create and send the message to queue
      publisherChannel.sendToQueue(
         QueueName,
         Buffer.from(JSON.stringify(orderDetails))
      );

      console.log("order sent to order matching queue: ", orderDetails);

      // close channel and connection
      setTimeout(() => {
         sendingChannel.close();
         sendingConnection.close();
      }, 500);
   } catch (error) {
      console.log("error in sending order to order matching queu: ", error);
      throw error;
   }
};

// close channel and connection if server is turned off
process.on("SIGINT", () => {
   if (sendingChannel) sendingChannel.close();
   if (sendingConnection) sendingConnection.close();
});

modules.exports = {
   sendToOrderMatchingQue,
};
