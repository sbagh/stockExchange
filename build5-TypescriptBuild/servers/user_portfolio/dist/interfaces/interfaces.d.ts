interface MatchedOrder {
    buyerID: number;
    sellerID: number;
    price: number;
    ticker: string;
    quantity: number;
}
interface UserCashHoldings {
    cash: string;
}
interface UserStockHoldings {
    ticker: string;
    quantity: number;
}
export { MatchedOrder, UserCashHoldings, UserStockHoldings };
