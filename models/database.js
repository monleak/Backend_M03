/*  MYSQL
//Database trả về kết nối với cơ sở dữ liệu
var mysql = require('mysql');

var db = mysql.createConnection({
   host: 'localhost', 
   port: 6969,
   user: 'root', 
   password: 'root', 
   database: 'SP17_LTCT'
}); 

db.connect(function(err) {
    if (err) throw err;
    console.log("DB connected!");
    db.query("show tables;", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
  });
module.exports = db; 
//lệnh exports để xuất (public) ra, cho ngoài module dùng được db
*/

//POSTGRESQL

var psql = require('pg');
/*
var db = new psql.Client({
  host: 'sp-17-production-db.fly.dev',
  port: 5432,
  user: 'postgres',
  password: 'lvI5yXgQkZFfkVq',
  database: 'postgres',
});
*/
var db = new psql.Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'root',
  database: 'postgres',
});

db.connect(function(err) {
    if (err) {
      console.error('connection error', err.stack);
    } else {
      console.log('DB connected');
    }
    db.query('SELECT tablename FROM pg_catalog.pg_tables where schemaname=\'public\';', (err, res) => {
        if (err) throw err;
        console.log(res.rows);
        // db.end();r
    });
});
module.exports = db;
