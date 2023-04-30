import type { BuyOrder, SellOrder, MatchedOrder } from "../interfaces/interfaces";
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
