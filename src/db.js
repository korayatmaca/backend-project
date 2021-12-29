const tstDB = () => {
  console.log("test");
};

const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("C:/myProjects/backend-project/db/sample.db");
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
    var sql = 'SELECT * FROM orders WHERE (CreatedOn BETWEEN ? AND ?)  AND (StoreName = ? OR CustomerName = ? ) AND  (Status BETWEEN ? AND ? ) ORDER BY ? ASC LIMIT ? OFFSET ?;';
    let offset = body.PageSize * (body.PageNumber - 1);
    //console.log("offset",offset);
    //console.log("PageSize",body.PageSize);
    console.log()
    db.all(sql,[body.StartDate, body.EndDate,body.SearchText,body.SearchText, body.Statuses[0],body.Statuses[1], body.SortBy, body.PageSize, offset],(err, rows) => {
        //console.log("err",err);
        resolve(rows);
    });
  });
};


module.exports = {
    tstDB,
    push_db,
    get_db
};