const AWS = reqiure("aws-sdk");

// create instance of SQS class
const sqs = new AWS.SQS({ apiVersion: "2012-11-05", region: "us-east-1" });

// SQS queue URL
const queueUrl =
   "https://sqs.us-east-1.amazonaws.com/684639648140/sendStockOrders.fifo";

// send message to SQS queue
const sendToQueue = async (queueUrl, message) => {
    // configure params for SQS
   const params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: queueUrl,
      DelaySeconds: 0,
   };
   // send message to SQS queue
   try {
      await sqs.sendMessage(params).promise();
      console.log(`Message sent to ${queueUrl}, message: `, message);
   } catch (error) {
      console.log(`Error in sending message to ${queueUrl}, error: `, error);
      throw error;
   }
};

// usage:
await sendToQueue(queueUrl, orderDetails);
