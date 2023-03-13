const amqp = require("amqplib");
const RabbitMqUrl = "amqp://127.0.0.1:5672";

// receive messages from a queue, given a queue name
const receiveFromQueue = async (queueName) => {
   return new Promise(async (resolve, reject) => {
      try {
         //1- create connection
         const recieverConnection = await amqp.connect(RabbitMqUrl);
         //2- create channel
         const recieverChannel = await recieverConnection.createChannel();
         //3- assert que
         await recieverChannel.assertQueue(queueName, { durable: true });
         //4- consume message from que
         await recieverChannel.consume(
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

module.exports = { receiveFromQueue };
