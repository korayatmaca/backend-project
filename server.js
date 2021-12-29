const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require('./src/db.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
const orders = [];

var router = express.Router();
router.get("/", function (req, res) {
  res.json({ message: "Welcome Chatbot Api" });
});

router.post("/saveOrder", function (req, res) {
  let orderList = [];
  orderList = req.body.Orders;
  orderList.forEach((order) => {
    if (order.BrandId !== 0) {
      //orders.push(order);
      db.push_db(order);
    }
    //console.log(order);
  });
  res.json({ message: "orders saved" });
});

router.post("/searchOrder", async function (req, res) {
  let orderFilterModel = req.body.OrderFilterModel;
  //console.log(orderFilterModel)
  let resData;
  await db.get_db(orderFilterModel).then((tst) => {
    resData = tst;
    res.json({ arr: resData });
  });
  //res.json({ message: 'order not found' });
});

app.use("/api", router);
app.listen(port);
