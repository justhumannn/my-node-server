var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'svc.sel5.cloudtype.app',
    user: 'root',
    password: 'Aa20091027!',
    database: 'game',
    port: '30622'
});
db.connect();
module.exports = db;