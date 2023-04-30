//class that matches highest buy order to highest sell order

//import typescript interfaces
import type {
   BuyOrder,
   SellOrder,
   MatchedOrder,
} from "../interfaces/interfaces";

class orderMatchingClass {
   buyOrders: BuyOrder[];
   sellOrders: SellOrder[];
   matchedOrders: MatchedOrder[];

   constructor() {
      (this.buyOrders = []), (this.sellOrders = []), (this.matchedOrders = []);
   }

   //add a buy order in buyOrders array
   addBuyOrder(
      buyer: number,
      ticker: string,
      quantity: number,
      price: number,
      orderID: string
   ): void {
      const time = new Date().toString();
      this.buyOrders.push({ buyer, ticker, quantity, price, orderID, time });
   }

   //add a sell order in sellOrders array
   addSellOrder(
      seller: number,
      ticker: string,
      quantity: number,
      price: number,
      orderID: string
   ): void {
      const time = new Date().toString();
      this.sellOrders.push({
         seller,
         ticker,
         quantity,
         price,
         orderID,
         time,
      });
   }

   //remove an order from buyOrders or sellOrders array, given an order id and type. (used if a user cancels their trade order)
   removeOrder(orderID: string, orderType: string): boolean {
      if (orderType === "buy") {
         const index = this.buyOrders.findIndex(
            (order) => order.orderID === orderID
         );
         if (index !== -1) {
            this.buyOrders.splice(index, 1);
            return true;
         }
      } else if (orderType === "sell") {
         const index = this.sellOrders.findIndex(
            (order) => order.orderID === orderID
         );
         if (index !== -1) {
            this.sellOrders.splice(index, 1);
            return true;
         }
      }
      return false;
   }

   // match buy and sell orders and add to matchedOrders array
   matchOrders(): MatchedOrder[] | null {
      //first sort buy and sell orders in descending order to get highest value of each, if prices are equal, sort by time (oldest first)
      this.buyOrders.sort((a, b) => {
         if (b.price === a.price) {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
         } else {
            return b.price - a.price;
         }
      });

      this.sellOrders.sort((a, b) => {
         if (b.price === a.price) {
            return new Date(b.time).getTime() - new Date(a.time).getTime();
         } else {
            return b.price - a.price;
         }
      });

      //loop through the buyOrders and sellOrders arrays, if buyOrders price > sellOrders price, execute a trade, else increment the sell order
      let i = 0,
         j = 0;

      while (i < this.buyOrders.length && j < this.sellOrders.length) {
         if (
            this.buyOrders[i].ticker === this.sellOrders[j].ticker &&
            this.buyOrders[i].price >= this.sellOrders[j].price
         ) {
            let trade_quantity = Math.min(
               this.buyOrders[i].quantity,
               this.sellOrders[j].quantity
            );

            this.buyOrders[i].quantity -= trade_quantity;
            this.sellOrders[j].quantity -= trade_quantity;

            //if the overlap trade quantity is greater than 0, push the min amount into the matched orders array
            if (trade_quantity > 0) {
               this.matchedOrders.push({
                  buyOrderID: this.buyOrders[i].orderID,
                  sellOrderID: this.sellOrders[j].orderID,
                  buyerID: this.buyOrders[i].buyer,
                  sellerID: this.sellOrders[j].seller,
                  price: this.sellOrders[j].price,
                  time: new Date(),
                  ticker: this.sellOrders[j].ticker,
                  quantity: trade_quantity,
               });
            }

            if (this.buyOrders[i].quantity === 0) {
               i++;
            } else {
               j++;
            }
         } else {
            if (this.buyOrders[i].price < this.sellOrders[j].price) {
               i++;
            } else {
               j++;
            }
         }
      }
      // remove orders from buyOrders and sellOrders array if they have quanitity = 0
      this.buyOrders = this.buyOrders.filter((order) => order.quantity > 0);
      this.sellOrders = this.sellOrders.filter((order) => order.quantity > 0);

      // return matchedOrders array
      return this.matchedOrders.length ? this.matchedOrders : null;
   }
}

export { orderMatchingClass };
