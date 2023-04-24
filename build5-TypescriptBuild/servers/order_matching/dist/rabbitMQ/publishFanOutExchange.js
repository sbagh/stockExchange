"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishFanOutExchange = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const RabbitMqUrl = "amqp://127.0.0.1:5672";
let publisherConnection;
let publisherChannel;
// fan-out exchange to publish messages to any queue that subscribes
const publishFanOutExchange = async (exchangeName, message) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1- check if a connection exists, if not create one
            if (!publisherConnection) {
                publisherConnection = await amqplib_1.default.connect(RabbitMqUrl);
            }
            // 2- check if a channel exists, if not create one
            if (!publisherChannel) {
                publisherChannel = await publisherConnection.createChannel();
            }
            //3- assert fanout Exchange
            await publisherChannel.assertExchange(exchangeName, "fanout", {
                durable: true,
            });
            //4- publish message to exchange, keep queuename as empty string so any queueu can subscribe
            await publisherChannel.publish(exchangeName, "", Buffer.from(JSON.stringify(message)));
            // console.log(`message sent to ${exchangeName} exchange: `, message);
            resolve();
            // 5- close channel and connection
            // setTimeout(() => {
            //    publisherChannel.close();
            //    publisherConnection.close();
            //    resolve();
            // }, 500);
        }
        catch (error) {
            console.log(`error in sending order to ${exchangeName} exchange, error: `, error);
            reject(error);
        }
    });
};
exports.publishFanOutExchange = publishFanOutExchange;
//# sourceMappingURL=publishFanOutExchange.js.map