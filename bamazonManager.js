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
    managerView();
});

function managerView() {
    log();
    inquirer
        .prompt({
            name: "options",
            type: "list",
            message: "Choose an option: ",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function(answer) {
            log();
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
                default:
                    connection.end();
                    break;
            }
        });
}

function productsForSale() {
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products",
        function(err, res) {
            if (err) throw err;
            var table = new Table({
                head: ["Item Id#", "Product Name", "Price", "Quantity"],
                style: {
                    head: ["blue"],
                    compact: false,
                    colAligns: ["center"]
                }
            });
            for (var i = 0; i < res.length; i++) {
                table.push([
                    res[i].item_id,
                    res[i].product_name,
                    res[i].price,
                    res[i].stock_quantity
                ]);
            }
            log();
            log(table.toString());
            log();
            connection.end();
            log();
        }
    );
}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5 ", function(err, res) {
        if (err) throw err;
        log("Products with Low inventory");
        var table = new Table({
            head: ["Item Id#", "Product Name", "Price", "Quantity"],
            style: {
                head: ["blue"],
                compact: false,
                colAligns: ["center"]
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push([
                res[i].item_id,
                res[i].product_name,
                res[i].price,
                res[i].stock_quantity
            ]);
        }
        log();
        log(table.toString());
        log();
        connection.end();
        log();
    });
}

function addInventory() {
    log();
    inquirer.prompt([{
                name: "itemId",
                type: "input",
                message: "Please enter the item ID you wish to add.",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to add? ",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ])
        .then(function(answer) {
            var addQuantity = parseInt(answer.quantity);
            var queryStr = "SELECT * FROM products WHERE ? ";
            connection.query(queryStr, { item_id: answer.itemId }, function(err, res) {
                if (err) throw err;
                var productData = res[0];
                log(chalk.magenta("\n----------------------------------------\n"));
                log();
                log(chalk.green("Updating the inventory..."));
                log();
                log(chalk.magenta("\n----------------------------------------\n"));
                var resStockQuantity = parseInt(productData.stock_quantity);
                var updateQueryStr = "UPDATE products SET stock_quantity = " + (resStockQuantity + addQuantity) + " WHERE ?";
                connection.query(updateQueryStr, { item_id: productData.item_id },
                    function(err, res) {
                        if (err) throw err;
                        log();
                        log("Stock count for Item ID " + productData.item_id + ", " +
                            "item- " + chalk.green(productData.product_name) + " has been updated to " + chalk.cyan(resStockQuantity + addQuantity) + ".");
                        log();
                        log(chalk.magenta("\n----------------------------------------\n"));
                    }
                );
                connection.end();
            });
        });
}

function addNewProduct() {
    inquirer.prompt([{
            name: "item_id",
            type: "input",
            message: "Please enter the item ID: "
        },
        {
            name: "product_name",
            type: "input",
            message: "Please enter the name of the product: "
        },
        {
            name: "department_name",
            type: "input",
            message: "Please enter the department name of the product: "
        },
        {
            name: "price",
            type: "input",
            message: "Please enter the price of the item: ",
            validation: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "Please enter the quantity of the item: "
        }
    ]).then(function(answer) {
        answer.product_sales = 0;
        log(chalk.magenta("\n----------------------------------------\n"));
        log("Adding New Item: \n    product_name = " + answer.product_name + "\n" + "    department_name = " + answer.department_name + "\n" + "    price = " + answer.price +
            "\n" + "    stock_quantity = " + answer.stock_quantity);

        var queryStr = "INSERT INTO products SET ?";
        connection.query(queryStr, answer, function(err, res, fields) {
            if (err) throw err;
            log();
            log(chalk.magenta("\n----------------------------------------\n"));
            log("New product has been added to the inventory under Item ID " + res.insertId + ".");
            log(chalk.magenta("\n----------------------------------------\n"));
            // var newqueryStr = "SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE product_sales IS NOT NULL ?";
            connection.end();
        });
    });
}