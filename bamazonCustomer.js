var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connection as id: " + connection.threadId);
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        console.log();
        startOrder();
    });
});

function startOrder() {

    inquirer.prompt([{
        name: "itemId",
        type: "input",
        message: "Please enter the item ID of the product you would like to purchase?",
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
                console.log();
                console.log("We have enough stocks for you, placing your order now...");
                var updateQueryStr = "UPDATE products SET stock_quantity = " + (productData.stock_quantity - stockQuantity) + ' WHERE ?';
                connection.query(updateQueryStr, { item_id: productData.item_id }, function(err, res) {
                    if (err) throw err;
                    console.log("Your order has been placed.");
                    console.log("Your Total Cost is $ " + (productData.price * stockQuantity));
                    console.log("Thank you for shopping with us!");
                    console.log("\n------------------------------------\n")
                    process.exit(1);
                });
            } else {
                console.log("Sorry, Insufficient quantity!");
                console.log("Please modify your order.");
                console.log("\n------------------------------------\n");
            }
        });
    })
}