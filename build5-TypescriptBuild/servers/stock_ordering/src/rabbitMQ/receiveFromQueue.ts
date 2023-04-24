import amqp, { Connection, Channel } from "amqplib";
const RabbitMqUrl = "amqp://127.0.0.1:5672";

let recieverConnection: Connection;
let recieverChannel: Channel;

//interface


// receive messages from a queue, given a queue name
const receiveFromQueue = async (queueName: string, callback: ) => {
   try {
      // 1- check if a connection exists, if not create one
      if (!recieverConnection) {
         recieverConnection = await amqp.connect(RabbitMqUrl);
      }
      // 2- check if a channel exists, if not create one
      if (!recieverChannel) {
         recieverChannel = await recieverConnection.createChannel();
      }
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
               const message = JSON.parse(consumedMessage.content.toString());
               // console.log(
               //    `received message from ${queueName} queue, message: `,
               //    message
               // );
               // resolve with the message
               callback(message);
               // acknowledge message consumed from queue
               recieverChannel.ack(consumedMessage);
            } else {
               console.log(`no messages in ${queueName} queue`);
            }
         },
         { noAck: false }
      );
   } catch (error) {
      console.log("error in receiving message from queue", error);
      throw error;
   }
};

module.exports = { receiveFromQueue };
