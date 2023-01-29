//matches highest buy order to highest sell order
class stockMatchingSystem {
   //buy and sellOrders are arrays of objects containing trade info such as buyer/seller, qty, price, time, type, status..etc
   //e.g:
   //buyOrders = [{buyer: {id: 1, name: "user1"}, symbol: "TSLA", quantity: 10, price:100, time: 18:00 EST, type:buy, status:open}]

   constructor() {
      (this.buyOrders = []), (this.sellOrders = []);
   }

   addBuyOrder(buyer, ticker, quantity, price, orderID) {
      const time = new Date().toString();
      this.buyOrders.push({ buyer, ticker, quantity, price, orderID, time });
   }

   addSellOrder(seller, ticker, quantity, price, orderID) {
      const time = new Date().toString();
      this.sellOrders.push({ seller, ticker, quantity, price, orderID, time });
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

      //loop through the buyOrder and sellOrder arrays, if buyOrder price>sellOrder price, executre a trade, else increment the sell order
      let i = 0,
         j = 0;
      while (i < this.buyOrders.length && j < this.sellOrders.length) {
         if (
            this.buyOrders[i].ticker === this.sellOrders[j].ticker &&
            this.buyOrders[i].price >= this.sellOrders[j].price
         ) {
            let tradeQuantity = Math.min(
               this.buyOrders[i].quantity,
               this.sellOrders[j].quantity
            );

            this.buyOrders[i].quantity -= tradeQuantity;
            this.sellOrders[j].quantity -= tradeQuantity;

            if (tradeQuantity > 0) {
               matchedOrders.push({
                  ticker: this.buyOrders[i].ticker,
                  buyer: this.buyOrders[i].buyer,
                  seller: this.sellOrders[j].seller,
                  price: this.sellOrders[j].price,
                  quantity: tradeQuantity,
                  buyID: this.buyOrders[i].orderID,
                  sellID: this.sellOrders[i].orderID,
                  time: new Date().toString(),
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
   stockMatchingSystem,
};
