const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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
      push_db(order);
    }
    console.log(order);
  });
  res.json({ message: "orders saved" });
});

router.post("/searchOrder", async function (req, res) {
  let orderFilterModel = req.body.OrderFilterModel;
  console.log(orderFilterModel)
  let resData;
  await get_db(orderFilterModel).then((tst) => {
    resData = tst;
    res.json({ arr: resData });
  });
  //res.json({ message: 'order not found' });
});

app.use("/api", router);
app.listen(port);

const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./db/sample.db");
//db.run('CREATE TABLE orders(Id)');

const push_db = (data) => {
  db.run(
    "INSERT INTO orders(Id,BrandId,Price,StoreName,CustomerName,CreatedOn,Status) VALUES (?, ?, ?,?,?,?,?)",
    [
      data["Id"],
      data["BrandId"],
      data["Price"],
      data["StoreName"],
      data["CustomerName"],
      data["CreatedOn"],
      data["Status"],
    ]
  ),
    (err) => {
      console.log("err:", err);
    };
};

const get_db = (body) => {
  return new Promise((resolve, reject) => {
    var sql = 'SELECT * FROM orders WHERE (CreatedOn BETWEEN ? AND ?)  AND  (Status BETWEEN ? AND ? ) ORDER BY ? ASC LIMIT ? OFFSET ?;';
    let offset = body.PageSize * (body.PageNumber - 1);
    //console.log("offset",offset);
    //console.log("PageSize",body.PageSize);
    db.all(sql,[body.StartDate, body.EndDate, body.Statuses[0],body.Statuses[1], body.SortBy, body.PageSize, offset],(err, rows) => {
        console.log("err",err);
        resolve(rows);
    });
  });
};
