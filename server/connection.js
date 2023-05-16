const mysql = require("mysql");
//подключаемся к локальной базе данных
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "maternity hospital",
});
//экспорт подключения
module.exports = con;
