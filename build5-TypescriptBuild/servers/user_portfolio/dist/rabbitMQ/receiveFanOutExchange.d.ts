interface MatchedOrder {
    buyerID: number;
    sellerID: number;
    price: number;
    ticker: string;
    quantity: number;
}
declare const receiveFanOutExchange: (exchangeName: string, queueName: string, callback: (message: MatchedOrder) => void) => Promise<void>;
export { receiveFanOutExchange };
