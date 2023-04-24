interface OrderDetails {
    orderID: string;
    userID: number;
    orderType: string;
    ticker: string;
    quantity: number;
    price: number;
    orderStatus: string;
    orderTime: Date;
}
interface StockOrder {
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
declare const getUserStockOrders: (userID: number) => Promise<StockOrder[]>;
declare const addStockOrder: (orderDetails: OrderDetails) => Promise<void>;
declare const updateOrderStatusToFilled: (buyOrderID: string, sellOrderID: string) => Promise<void>;
declare const updateOrderStatusToCanceled: (canceledOrder: CanceledOrder) => Promise<void>;
declare const getOrderStatus: (orderID: string) => Promise<{
    orderStatus;
}>;
export { getUserStockOrders, addStockOrder, updateOrderStatusToFilled, updateOrderStatusToCanceled, getOrderStatus, };
