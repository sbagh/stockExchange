const amqp = require("amqplib");

const RabbitMqUrl = "amqp://127.0.0.1:5672";

// send messages to a queue, given a queue name and a message
const sendToQueue = async (queueName, message) => {
   return new Promise(async (resolve, reject) => {
      try {
         // 1- creaate connection
         const publisherConnection = await amqp.connect(RabbitMqUrl);
         // 2- create channel
         const publisherChannel = await publisherConnection.createChannel();
         // 3- assert Queue, set durability = true in case of server crash or restart
         await publisherChannel.assertQueue(queueName, {
            durability: true,
         });
         // 4- create and send the message to queue
         publisherChannel.sendToQueue(
            queueName,
            Buffer.from(JSON.stringify(message))
         );
         // console.log(`message sent to ${queueName} queue, message: `, message);

         // 5- close channel and connection
         setTimeout(() => {
            publisherChannel.close();
            publisherConnection.close();
            resolve();
         }, 500);
      } catch (error) {
         console.log(
            `error in sending order to ${queueName} queu, error: `,
            error
         );
         reject(error);
      }
   });
};

// recieve messages from a fan out exchange
const receiveFromFanOutExchange = async (exchangeName, queueName) => {
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

// receive messages from a queue, given a queue name
const receiveFromQue = async (queueName) => {
   return new Promise(async (resolve, reject) => {
      try {
         //1- create connection
         const subscriberConnection = await amqp.connect(RabbitMqUrl);
         //2- create channel
         const subscriberChannel = await subscriberConnection.createChannel();
         //3- assert que
         await subscriberChannel.assertQueue(queueName, { durable: true });
         //4- consume message from que
         await subscriberChannel.consume(
            queueName,
            (consumedMessage) => {
               if (consumedMessage) {
                  // console.log("consumed message from queue: ", consumedMessage);

                  // ensure message is a valid object
                  if (
                     typeof consumedMessage !== "object" ||
                     !consumedMessage.content
                  ) {
                     console.log("Invalid message format");
                     return null;
                  }
                  // parse contenct of incoming message
                  const message = JSON.parse(
                     consumedMessage.content.toString()
                  );
                  // console.log(
                  //    `received message from ${queueName} queue, message: `,
                  //    message
                  // );
                  // resolve with the message
                  resolve(message);
                  // acknowledge message consumed from queue
                  subscriberChannel.ack(consumedMessage);
               } else {
                  console.log(`no messages in ${queueName} queue`);
               }
            },
            { noAck: false }
         );
      } catch (error) {
         console.log("error in receiving message from queue", error);
         reject(error);
      }
   });
};

module.exports = {
   sendToQueue,
   receiveFromFanOutExchange,
   receiveFromQue,
};
