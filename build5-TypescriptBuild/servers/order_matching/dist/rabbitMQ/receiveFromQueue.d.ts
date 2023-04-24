declare const receiveFromQueue: (queueName: string, callback: (message: any) => void) => Promise<void>;
export { receiveFromQueue };
