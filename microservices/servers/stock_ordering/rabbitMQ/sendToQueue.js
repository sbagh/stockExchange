const amqp = require("amqplib");
const RabbitMqUrl = "amqp://127.0.0.1:5672";

let senderConnection;
let senderChannel;

// send messages to a queue, given a queue name and a message
const sendToQueue = async (queueName, message) => {
   return new Promise(async (resolve, reject) => {
      try {
         // 1- check if a connection exists, if not create one
         if (!senderConnection) {
            senderConnection = await amqp.connect(RabbitMqUrl);
         }
         // 2- check if a channel exists, if not create one
         if (!senderChannel) {
            senderChannel = await senderConnection.createChannel();
         }
         // 3- assert Queue, set durability = true in case of server crash or restart
         await senderChannel.assertQueue(queueName, {
            durability: true,
         });
         // 4- create and send the message to queue
         senderChannel.sendToQueue(
            queueName,
            Buffer.from(JSON.stringify(message))
         );
         // console.log(`message sent to ${queueName} queue, message: `, message);

         resolve();

         // 5- close channel and connection
         //  setTimeout(() => {
         //     senderChannel.close();
         //     senderConnection.close();
         //     resolve();
         //  }, 500);
      } catch (error) {
         console.log(
            `error in sending order to ${queueName} queue, error: `,
            error
         );
         reject(error);
      }
   });
};

module.exports = {
   sendToQueue,
};
