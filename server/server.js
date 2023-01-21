const express = require("express");
const {
   getUserPortfolio,
   getStockData,
   updateUserPortfolioFile,
} = require("./Stocks/userInteractionAPI");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const PORT = 5555;

// respond to userPortfolio fetch request from ui
app.get("/userPortfolio", async (req, res) => {
   const userData = await getUserPortfolio(req.query.user);
   res.send(userData);
});

// respond to stockData fetch request from ui
app.get("/stockData", async (req, res) => {
   const stockData = await getStockData(req.query.ticker);
   res.send(stockData);
});

// update userPortfolio through startBuyOrder axios call from ui
// app.put("/updateUserProfile", async(req,res) => {
//    const updatedData = req.body
//    const result = await updateUserPortfolioFile(updateData)
// })



app.listen(PORT, () => console.log("listening to PORT", PORT));
