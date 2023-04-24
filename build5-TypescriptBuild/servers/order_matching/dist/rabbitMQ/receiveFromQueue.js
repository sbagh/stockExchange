"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveFromQueue = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const RabbitMqUrl = "amqp://127.0.0.1:5672";
let recieverConnection;
let recieverChannel;
// receive messages from a queue, given a queue name
const receiveFromQueue = async (queueName, callback) => {
    try {
        // 1- check if a connection exists, if not create one
        if (!recieverConnection) {
            recieverConnection = await amqplib_1.default.connect(RabbitMqUrl);
        }
        // 2- check if a channel exists, if not create one
        if (!recieverChannel) {
            recieverChannel = await recieverConnection.createChannel();
        }
        //3- assert que
        await recieverChannel.assertQueue(queueName, { durable: true });
        //4- consume message from que
        await recieverChannel.consume(queueName, (consumedMessage) => {
            if (consumedMessage) {
                // console.log("consumed message from queue: ", consumedMessage);
                // ensure message is a valid object
                if (typeof consumedMessage !== "object" ||
                    !consumedMessage.content) {
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
            }
            else {
                console.log(`no messages in ${queueName} queue`);
            }
        }, { noAck: false });
    }
    catch (error) {
        console.log("error in receiving message from queue", error);
        throw error;
    }
};
exports.receiveFromQueue = receiveFromQueue;
//# sourceMappingURL=receiveFromQueue.js.map