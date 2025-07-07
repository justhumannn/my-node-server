var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Aa20091027!',
    database: 'game'
});
db.connect();
module.exports = db;