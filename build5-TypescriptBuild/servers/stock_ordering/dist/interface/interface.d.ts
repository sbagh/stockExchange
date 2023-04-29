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
export { StockOrderDetails };
