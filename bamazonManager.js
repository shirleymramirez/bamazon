var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
const chalk = require("chalk");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("Connection as id: " + connection.threadId);
    managerView();
});

function managerView() {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "Choose an option: ",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function(answer) {
        switch (answer.options) {
            case "View Products for Sale":
                productsForSale();
                break;

            case "View Low Inventory":
                lowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addNewProduct();
                break;
        }
    });
}

function productsForSale() {

}

function lowInventory() {

}

function addInventory() {

}

function addNewProduct() {

}