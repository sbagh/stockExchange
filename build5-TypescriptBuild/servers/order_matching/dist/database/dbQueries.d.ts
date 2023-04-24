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
declare const updateMatchedOrdersTable: (matchedOrder: MatchedOrder) => Promise<void>;
export { updateMatchedOrdersTable };
