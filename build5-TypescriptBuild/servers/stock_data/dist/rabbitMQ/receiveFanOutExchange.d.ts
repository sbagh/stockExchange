interface MatchedOrder {
    price: number;
    time: Date;
    ticker: string;
}
declare const receiveFanOutExchange: (exchangeName: string, queueName: string, callback: (message: MatchedOrder) => void) => Promise<void>;
export { receiveFanOutExchange };
