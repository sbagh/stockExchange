"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveFanOutExchange = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const RabbitMqUrl = "amqp://127.0.0.1:5672";
let subscriberConnection;
let subscriberChannel;
// recieve messages from a fan out exchange, then run the callback function on each message
const receiveFanOutExchange = async (exchangeName, queueName, callback) => {
    try {
        //1- check if a connection exists, if not create one
        if (!subscriberConnection) {
            subscriberConnection = await amqplib_1.default.connect(RabbitMqUrl);
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
        await subscriberChannel.consume(queueName, (consumedMessage) => {
            if (consumedMessage) {
                // console.log(
                //    "message consumed from fan out exchagne queue: ",
                //    consumedMessage
                // );
                //ensure message is a valid object
                if (typeof consumedMessage.content !== "object" ||
                    !consumedMessage.content) {
                    console.log("Invalid message format");
                    return null;
                }
                // parse contents of incoming message
                const message = JSON.parse(consumedMessage.content.toString());
                // console.log(
                //    `received message from ${queueName} queue, message: `,
                //    message
                // );
                // use the callback function on the message and acknowledge message
                callback(message);
                subscriberChannel.ack(consumedMessage);
            }
        });
    }
    catch (error) {
        console.log("error in receiving message from queue", error);
        throw error;
    }
};
exports.receiveFanOutExchange = receiveFanOutExchange;
//# sourceMappingURL=receiveFanOutExchange.js.map