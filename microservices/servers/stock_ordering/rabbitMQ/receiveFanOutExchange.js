const amqp = require("amqplib");

const RabbitMqUrl = "amqp://127.0.0.1:5672";

// recieve messages from a fan out exchange
const receiveFanOutExchange = async (exchangeName, queueName) => {
   return new Promise(async (resolve, reject) => {
      try {
         //1- create connection
         const subscriberConnection = await amqp.connect(RabbitMqUrl);
         //2- create channel
         const subscriberChannel = await subscriberConnection.createChannel();
         //3- assert fanout exchange
         await subscriberChannel.assertExchange(exchangeName, "fanout", {
            durable: true,
         });
         //4- assert queue
         await subscriberChannel.assertQueue(queueName, { durable: true });
         //5- bind queue to exchange using am empty routing key
         await subscriberChannel.bindQueue(queueName, exchangeName, "");
         //6- consume message
         await subscriberChannel.consume(queueName, (consumedMessage) => {
            if (consumedMessage) {
               // console.log(
               //    "message consumed from fan out exchagne queue: ",
               //    consumedMessage
               // );
               // ensure message is a valid object
               if (
                  typeof consumedMessage.content !== "object" ||
                  !consumedMessage.content
               ) {
                  console.log("Invalid message format");
                  return null;
               }
               // parse contents of incoming message
               const message = JSON.parse(consumedMessage.content.toString());
               console.log(
                  `received message from ${queueName} queue, message: `,
                  message
               );
               // resolve and acknowledge message
               resolve(message);
               subscriberChannel.ack(consumedMessage);
            }
         });
      } catch (error) {
         console.log("error in receiving message from queue", error);
         reject(error);
      }
   });
};

module.exports = {
   receiveFanOutExchange,
};
