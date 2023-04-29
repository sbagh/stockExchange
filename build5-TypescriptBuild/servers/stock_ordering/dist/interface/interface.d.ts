interface StockOrderDetails {
    orderID: string;
    userID: number;
    orderType: string;
    ticker: string;
    quantity: number;
    price: number;
    orderTime: Date;
    orderStatus: string;
}
interface UserStockOrders {
    orderID: string;
    orderType: string;
    ticker: string;
    quantity: number;
    price: number;
    orderStatus: string;
    orderTime: Date;
}
interface CanceledOrder {
    orderID: string;
    orderType: string;
    orderStatus: string;
    userID: number;
}
export { StockOrderDetails, UserStockOrders, CanceledOrder };
