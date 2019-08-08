let config = require('../config');

var mysql = require("mysql");

var connection = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

exports.getConnection = function (callback) {
  connection.getConnection(callback);
};
