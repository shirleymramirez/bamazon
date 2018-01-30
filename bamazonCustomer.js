// dependencies needed to run the application
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
const chalk = require("chalk");

// constant declaration for chalk library and console.log
const error = chalk.bold.red;
const warning = chalk.keyword("orange");
const log = console.log;

// this line will read and connect what's in the bamazon_db database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

// read what is in the database through connection.query "SELECT", 
// then output it in the table using CLI-table packages
connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT item_id, product_name, price, product_sales FROM products", function(err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['Item Id#', 'Product Name', 'Price', 'Product Sales'],
            style: {
                head: ['blue'],
                compact: false,
                colAligns: ['center']
            }
        });

        // this part of the code will loop through each result data and push in the table 
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].product_sales]);
        }
        log();
        log(chalk.yellow.underline.bold("Welcome to bamazon Online Store ") + chalk.green.underline.bold("by Shirley Ramirez"));
        log();
        log(table.toString());
        log();
        startOrder();
    });
});

// ask customer for an input(purchase item and quantity)
// validate the input if it is a number or not
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
        // store in a var the user's answer for the quantity
        var stockQuantity = answer.quantity;
        var queryStr = "SELECT * FROM products WHERE ?";

        // then read the database through the item-id 
        connection.query(queryStr, { item_id: answer.itemId }, function(err, res) {
            var productData = res[0];
            // check if the item ID exists or not in the database
            if (res.length === 0) {
                log();
                log(error("Item not found, enter a valid" + chalk.green(" Item ID")));
                log();
                startOrder();
            } else {
                // check if there's enough stocks in the database
                if (stockQuantity <= productData.stock_quantity) {
                    log();
                    log("We have enough stocks for you, placing your order now ...");
                    log();

                    // this query here is for the stock_quantity update in the mysql database 
                    // which is the only requirement when customer is purchasing an item (first part)
                    var updateQueryStr = "UPDATE products SET stock_quantity = " + (productData.stock_quantity - stockQuantity) + " WHERE ?";
                    connection.query(updateQueryStr, { item_id: productData.item_id, }, function(err, res) {
                        if (err) throw err;
                        log(chalk.green("Your order has been placed."));
                        log();
                        log(chalk.magenta("\n----------------------------------------\n"));
                        log(chalk.yellow(stockQuantity) + " items purchased");
                        log(chalk.cyan(productData.product_name) + " which cost" + " $" + chalk.yellow(productData.price) + " each");
                        log("Your " + chalk.cyan("Total Cost ") + "is $" + chalk.yellow(productData.price * stockQuantity));
                        log("Thank you for shopping with us!");
                        log(chalk.magenta("\n---------------------------------------\n"));

                        // this query here is for the product sale update in the mysql database 
                        // which is the requirement under supervisor view(third part)
                        var updateQueryStrSales = "UPDATE products SET product_sales = " + (productData.price * stockQuantity) + " WHERE ?";
                        connection.query(updateQueryStrSales, { item_id: productData.item_id, }, function(err, res) {
                            if (err) throw err;
                            process.exit(1);
                        })
                    })

                } else {
                    // when there's not enough stock it will show a log saying ... 
                    console.log();
                    log(error("Sorry, we have insufficient quantity of ") + chalk.green(productData.product_name));
                    log(error("Please modify your order."));
                    log(chalk.magenta("\n-----------------------------------------\n"));
                    process.exit(1);
                }
            }
        });
    })
}