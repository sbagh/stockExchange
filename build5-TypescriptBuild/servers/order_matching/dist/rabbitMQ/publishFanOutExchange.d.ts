interface MatchedOrder {
    buyOrderID: string;
    sellOrderID: string;
    buyerID: number;
    sellerID: number;
    price: number;
    time: Date;
    ticker: string;
    quantity: number;
}
declare const publishFanOutExchange: (exchangeName: string, message: MatchedOrder) => Promise<void>;
export { publishFanOutExchange };
