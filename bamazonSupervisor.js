var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
const chalk = require("chalk");

const log = console.log;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    supervisorView();
});

function supervisorView() {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "Please choose an option: ",
        choices: ["View Product Sales by Department", "Create New Department"]
    }).then(function(answer) {
        if (answer.options === "View Product Sales by Department") {

        } else {

        }
    })
}