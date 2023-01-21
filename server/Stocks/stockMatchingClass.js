//matches highest buy order to highest sell order
class stockMatchingSystem {
   //buy and sellOrders are arrays of objects containing trade info such as buyer/seller, qty, price, time, type, status..etc
   //e.g:
   //buyOrders = [{buyerID: "11123", symbol: "TSLA", quantity: 10, price:100, time: 18:00 EST, type:buy, status:open}]

   constructor() {
      (this.buyOrders = []), (this.sellOrders = []);
   }

   addBuyOrder(order) {
      this.buyOrders.push(order);
   }

   addSellOrder(order) {
      this.sellOrders.push(order);
   }


   matchOrders() {
      //first sort buy and sell orders in descending order to get highest value of each
      this.buyOrders.sort((a, b) => b.price - a.price);
      this.sellOrders.sort((a, b) => b.price - a.price);

      let matchedOrders = [];

      //loop through the buyOrder and sortOrder arrays, if buyOrder price>sellOrder price, executre a trade, else increment the sell order
      let i = 0,
         j = 0;
      while (i < this.buyOrders.length && j < this.sellOrders.length) {
         if (this.buyOrders[i].price >= this.sellOrders[j].price) {
            let tradeQuanity = Math.min(
               this.buyOrders[i].quantity,
               this.sellOrders[j].quantity
            );

            this.buyOrders[i].quantity -= tradeQuanity;
            this.sellOrders[j].quantity += tradeQuanity;

            matchedOrders.push({
               buyer: this.buyOrders[i].buyer,
               seller: this.sellOrders[j].seller,
               price: this.sellOrders[j].price,
               quantity: tradeQuanity,
            });

            if (this.buyOrders[i] === 0) {
               i++;
            } else {
               j++;
            }
         } else {
            j++;
         }
      }
      return matchedOrders;
   }
}

module.exports = {
    stockMatchingSystem
}