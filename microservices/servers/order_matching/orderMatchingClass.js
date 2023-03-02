//class that matches highest buy order to highest sell order

class orderMatchingClass {
   //buy and sell_orders are arrays of objects containing trade info such as buyer/seller, qty, price, time, type, status..etc
   //e.g: buy_orders = [{buyer: {id: 1, name: "user1"}, symbol: "TSLA", quantity: 10, price:100, time: 18:00 EST, type:buy, status:open}]

   constructor() {
      (this.buy_orders = []), (this.sell_orders = []);
   }

   //add a buy order in buy_orders array
   addBuyOrder(buyer, ticker, quantity, price, order_id) {
      const time = new Date().toString();
      this.buy_orders.push({ buyer, ticker, quantity, price, order_id, time });
   }

   //add a sell order in sell_orders array
   addSellOrder(seller, ticker, quantity, price, order_id) {
      const time = new Date().toString();
      this.sell_orders.push({
         seller,
         ticker,
         quantity,
         price,
         order_id,
         time,
      });
   }

   //remove an order from buy_orders or sell_orders array, given an order id and type. (used if a user cancels their trade order)
   removeOrder(order_id, order_type) {
      if (order_type === "buy") {
         const index = this.buy_orders.findIndex(
            (order) => (order.order_id = order_id)
         );
         if (index !== -1) {
            this.buy_orders.splice(index, 1);
            return true;
         }
      } else if (order_type === "sell") {
         const index = this.sell_orders.findIndex(
            (order) => (order.order_id = order_id)
         );
         if (index !== -1) {
            this.sell_orders.splice(index, 1);
            return true;
         }
      }
      return false;
   }

   matchOrders() {
      //first sort buy and sell orders in descending order to get highest value of each, if prices are equal, sort by time (oldest first)
      this.buy_orders.sort((a, b) => {
         if (b.price === a.price) {
            return new Date(b.time) - new Date(a.time);
         } else {
            return b.price - a.price;
         }
      });

      this.sell_orders.sort((a, b) => {
         if (b.price === a.price) {
            return new Date(b.time) - new Date(a.time);
         } else {
            return b.price - a.price;
         }
      });

      let matchedOrders = [];

      //loop through the buy_orders and sell_orders arrays, if buy_orders price > sell_orders price, execute a trade, else increment the sell order
      let i = 0,
         j = 0;

      while (i < this.buy_orders.length && j < this.sell_orders.length) {
         if (
            this.buy_orders[i].ticker === this.sell_orders[j].ticker &&
            this.buy_orders[i].price >= this.sell_orders[j].price
         ) {
            let trade_quantity = Math.min(
               this.buy_orders[i].quantity,
               this.sell_orders[j].quantity
            );

            this.buy_orders[i].quantity -= trade_quantity;
            this.sell_orders[j].quantity -= trade_quantity;

            //if the overlap trade quantity is greater than 0, push the min amount into the matched orders array
            if (trade_quantity > 0) {
               matchedOrders.push({
                  buy_order_id: this.buy_orders[i].order_id,
                  sell_order_id: this.sell_orders[i].order_id,
                  price: this.sell_orders[i].price,
                  time: new Date(),
                  ticker: this.sell_orders[i].ticker,
                  quantity: trade_quantity,
               });
            }

            if (this.buy_orders[i].quantity === 0) {
               i++;
            } else {
               j++;
            }
         } else {
            if (this.buy_orders[i].price < this.sell_orders[j].price) {
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
