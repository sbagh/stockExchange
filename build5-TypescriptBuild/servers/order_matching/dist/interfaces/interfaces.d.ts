interface StockOrderDetails {
    userID: number;
    ticker: string;
    quantity: number;
    price: number;
    orderID: string;
    orderType: string;
}
interface CanceledOrderDetails {
    orderID: string;
    orderType: string;
    orderStatus: string;
    userID: number;
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
export { StockOrderDetails, CanceledOrderDetails, MatchedOrder, BuyOrder, SellOrder, };
