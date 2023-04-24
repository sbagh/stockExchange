interface BuyOrder {
    buyer: number;
    ticker: string;
    quantity: number;
    price: number;
    orderID: string;
    time: string;
}
interface SellOrder {
    seller: number;
    ticker: string;
    quantity: number;
    price: number;
    orderID: string;
    time: string;
}
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
declare class orderMatchingClass {
    buyOrders: BuyOrder[];
    sellOrders: SellOrder[];
    matchedOrders: MatchedOrder[];
    constructor();
    addBuyOrder(buyer: number, ticker: string, quantity: number, price: number, orderID: string): void;
    addSellOrder(seller: number, ticker: string, quantity: number, price: number, orderID: string): void;
    removeOrder(orderID: string, orderType: string): boolean;
    matchOrders(): MatchedOrder[] | null;
}
export { orderMatchingClass };
