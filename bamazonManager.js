// dependencies needed for the application to run
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
const chalk = require("chalk");

// constant declaration for console.log
const log = console.log;

// this line will read and connect what's in the bamazon_db database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

// connect to the database and calls managerView function where all the operation takes place
connection.connect(function(err) {
    if (err) throw err;
    managerView();
});

// prompt a manager a lists of options
function managerView() {
    log(); // this log here is added just to add space in the console log terminal
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
        })
        .then(function(answer) {
            log(); // this log here is added just to add space in the console log terminal
            // switch case statement based on the manager's answer
            switch (answer.options) {
                // manager can view all the product for sale
                case "View Products for Sale":
                    productsForSale();
                    break;

                    //  manager can view inventory lower than 5 items
                case "View Low Inventory":
                    lowInventory();
                    break;

                    // manager can add product to the existing inventory
                case "Add to Inventory":
                    addInventory();
                    break;

                    // manager can add totally new product to the database
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
    // manager can view all products for sale through connection.query"SELECT" and
    // outputted using CLI-table packages
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
    // manager can view all products for that is lower than 5 number of stocks
    // through connection.query"SELECT" and
    // outputted using CLI-table packages
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
    log(); // this will add space on our console log terminal

    // prompts a manager with a message asking for an input for item ID and number of
    // items to add, also validates if the value entered was a number or not
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
            // reading the database depending on th item id inputted by the manager
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
                // 2nd query is to update the database base on the input item id and number of stocks by the manager
                // console log the updated or added item id and product name
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
    // series of user prompt to add a totally new item on our database
    inquirer.prompt([{
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
        // initialize product_sales to 0, this is to avoid getting an error when adding new item
        // since product_sales doesn't have any value in our schema
        answer.product_sales = 0;

        // log all the details about the new item that has been added
        log(chalk.magenta("\n----------------------------------------\n"));
        log("Adding New Item: \n    product_name = " + answer.product_name + "\n" + "    department_name = " + answer.department_name + "\n" + "    price = " + answer.price +
            "\n" + "    stock_quantity = " + answer.stock_quantity);

        // this will insert new column data into the table named "product"
        // update the console log the items that has been added as well with its item id
        var queryStr = "INSERT INTO products SET ?";
        connection.query(queryStr, answer, function(err, res, fields) {
            if (err) throw err;

            log();
            log(chalk.magenta("\n----------------------------------------\n"));
            log("New product has been added to the inventory under Item ID " + res.insertId + ".");
            log(chalk.magenta("\n----------------------------------------\n"));
            connection.end();
        });
    });
}