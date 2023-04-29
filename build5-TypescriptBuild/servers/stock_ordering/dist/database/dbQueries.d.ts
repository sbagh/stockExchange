import type { StockOrderDetails, UserStockOrders, CanceledOrder } from "../interface/interface";
declare const getUserStockOrders: (userID: number) => Promise<UserStockOrders[]>;
declare const addStockOrder: (orderDetails: StockOrderDetails) => Promise<void>;
declare const updateOrderStatusToFilled: (buyOrderID: string, sellOrderID: string) => Promise<void>;
declare const updateOrderStatusToCanceled: (canceledOrder: CanceledOrder) => Promise<void>;
declare const getOrderStatus: (orderID: string) => Promise<{
    orderStatus;
}>;
export { getUserStockOrders, addStockOrder, updateOrderStatusToFilled, updateOrderStatusToCanceled, getOrderStatus, };
