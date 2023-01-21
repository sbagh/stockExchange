const volatility = 0.1;
let old_price = 100;

setInterval(() => {
   const rnd = Math.random(); // generate number, 0 <= x < 1.0
   let change_percent = 2 * volatility * rnd;
   if (change_percent > volatility) {
      change_percent -= 2 * volatility;
   }
   let change_amount = old_price * change_percent;
   old_price = old_price + change_amount;
   console.log(old_price);
}, 1000);
