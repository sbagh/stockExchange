// typescript interfaces in stock ordering microservice

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

//interface
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

export { StockOrderDetails, UserStockOrders, CanceledOrder, MatchedOrder };
