import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
const RabbitMqUrl = "amqp://127.0.0.1:5672";

let subscriberConnection: Connection;
let subscriberChannel: Channel;

// interface for message content
interface MatchedOrder {
   buyerID: number;
   sellerID: number;
   price: number;
   ticker: string;
   quantity: number;
}

// recieve messages from a fan out exchange, then run the callback function on each message
const receiveFanOutExchange = async (
   exchangeName: string,
   queueName: string,
   callback: (message: MatchedOrder) => void
): Promise<void> => {
   try {
      //1- check if a connection exists, if not create one
      if (!subscriberConnection) {
         subscriberConnection = await amqp.connect(RabbitMqUrl);
      }
      //2- check if a channel exists, if not create one
      if (!subscriberChannel) {
         subscriberChannel = await subscriberConnection.createChannel();
      }
      //3- assert fanout exchange
      await subscriberChannel.assertExchange(exchangeName, "fanout", {
         durable: true,
      });
      //4- assert queue
      await subscriberChannel.assertQueue(queueName, { durable: true });
      //5- bind queue to exchange using am empty routing key
      await subscriberChannel.bindQueue(queueName, exchangeName, "");
      //6- consume message
      await subscriberChannel.consume(
         queueName,
         (consumedMessage: ConsumeMessage | null) => {
            if (consumedMessage) {
               // console.log(
               //    "message consumed from fan out exchagne queue: ",
               //    consumedMessage
               // );
               //ensure message is a valid object
               if (
                  typeof consumedMessage.content !== "object" ||
                  !consumedMessage.content
               ) {
                  console.log("Invalid message format");
                  return null;
               }
               // parse contents of incoming message
               const message: MatchedOrder = JSON.parse(
                  consumedMessage.content.toString()
               );
               // console.log(
               //    `received message from ${queueName} queue, message: `,
               //    message
               // );
               // use the callback function on the message and acknowledge message
               callback(message);
               subscriberChannel.ack(consumedMessage);
            }
         }
      );
   } catch (error) {
      console.log("error in receiving message from queue", error);
      throw error;
   }
};

export { receiveFanOutExchange };
