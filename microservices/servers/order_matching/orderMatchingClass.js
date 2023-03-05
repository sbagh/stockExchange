//class that matches highest buy order to highest sell order

class orderMatchingClass {
   //buy and sellOrders are arrays of objects containing trade info such as buyer/seller, qty, price, time, type, status..etc
   //e.g: buyOrders = [{buyer: {id: 1, name: "user1"}, symbol: "TSLA", quantity: 10, price:100, time: 18:00 EST, type:buy, status:open}]

   constructor() {
      (this.buyOrders = []), (this.sellOrders = []);
   }

   //add a buy order in buyOrders array
   addBuyOrder(buyer, ticker, quantity, price, orderID) {
      const time = new Date().toString();
      this.buyOrders.push({ buyer, ticker, quantity, price, orderID, time });
   }

   //add a sell order in sellOrders array
   addSellOrder(seller, ticker, quantity, price, orderID) {
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
   removeOrder(orderID, orderType) {
      if (orderType === "buy") {
         const index = this.buyOrders.findIndex(
            (order) => (order.orderID = orderID)
         );
         if (index !== -1) {
            this.buyOrders.splice(index, 1);
            return true;
         }
      } else if (orderType === "sell") {
         const index = this.sellOrders.findIndex(
            (order) => (order.orderID = orderID)
         );
         if (index !== -1) {
            this.sellOrders.splice(index, 1);
            return true;
         }
      }
      return false;
   }

   matchOrders() {
      //first sort buy and sell orders in descending order to get highest value of each, if prices are equal, sort by time (oldest first)
      this.buyOrders.sort((a, b) => {
         if (b.price === a.price) {
            return new Date(b.time) - new Date(a.time);
         } else {
            return b.price - a.price;
         }
      });

      this.sellOrders.sort((a, b) => {
         if (b.price === a.price) {
            return new Date(b.time) - new Date(a.time);
         } else {
            return b.price - a.price;
         }
      });

      let matchedOrders = [];

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
               matchedOrders.push({
                  buyOrderID: this.buyOrders[i].orderID,
                  sellOrderID: this.sellOrders[i].orderID,
                  price: this.sellOrders[i].price,
                  time: new Date(),
                  ticker: this.sellOrders[i].ticker,
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
      return matchedOrders.length > 0 ? matchedOrders : null;
   }
}

module.exports = {
   orderMatchingClass,
};
