var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");


// packages used for color changes in the console log output
const chalk = require("chalk");

// assigned constant for colors to be used for console log
const error = chalk.bold.red;
const warning = chalk.keyword("orange");
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
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['Item Id#', 'Product Name', 'Price'],
            style: {
                head: ['blue'],
                compact: false,
                colAligns: ['center']
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price]);
        }
        log();
        log(chalk.yellow.underline.bold("Welcome to bamazon Online Store ") + chalk.green.underline.bold("by Shirley Ramirez"));
        log();
        log(table.toString());
        log();
        startOrder();
    });
});

function startOrder() {

    inquirer.prompt([{
        name: "itemId",
        type: "input",
        message: "Please enter the item ID of the product you would like to purchase",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "quantity",
        type: "input",
        message: "How many unit do you need?",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        var stockQuantity = answer.quantity;
        var queryStr = "SELECT * FROM products WHERE ?";

        connection.query(queryStr, { item_id: answer.itemId }, function(err, res) {
            var productData = res[0];
            if (stockQuantity <= productData.stock_quantity) {
                log();
                log("We have enough stocks for you, placing your order now ...");
                log();
                var updateQueryStr = "UPDATE products SET stock_quantity = " + (productData.stock_quantity - stockQuantity) + ' WHERE ?';
                connection.query(updateQueryStr, { item_id: productData.item_id }, function(err, res) {
                    if (err) throw err;
                    log(chalk.green("Your order has been placed."));
                    log();
                    log(chalk.magenta("\n----------------------------------------\n"));
                    log(chalk.yellow(stockQuantity) + " items purchased");
                    log(chalk.cyan(productData.product_name) + ' which cost' + " $" + chalk.yellow(productData.price) + ' each');
                    log("Your " + chalk.cyan("Total Cost ") + "is $" + chalk.yellow(productData.price * stockQuantity));
                    log("Thank you for shopping with us!");
                    log(chalk.magenta("\n---------------------------------------\n"));
                    process.exit(1);
                });
            } else {
                console.log();
                log(error("Sorry, we have insufficient quantity of ") + chalk.green(productData.product_name));
                log(error("Please modify your order."));
                log(chalk.magenta("\n-----------------------------------------\n"));
                process.exit(1);
            }
        });
    })
}