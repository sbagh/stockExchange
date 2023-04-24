interface Stock {
    ticker: string;
    price: number;
    lastUpdate: Date;
}
declare const getStockData: () => Promise<Stock[]>;
declare const updateStockDataAfterMatch: (price: number, time: Date, ticker: string) => Promise<void>;
export { getStockData, updateStockDataAfterMatch };
