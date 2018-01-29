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
    log();
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "Please choose an option: ",
        choices: ["View Product Sales by Department", "Create New Department"]
    }).then(function(answer) {
        if (answer.options === "View Product Sales by Department") {
            viewProductSales();
        } else {
            createNewDepartment();
        }
    })
}

function viewProductSales() {
    connection.query(
        " SELECT departments.department_id, departments.department_name, departments.over_head_costs, product_sales, (product_sales-departments.over_head_costs) AS total_profit  " +
        " FROM products JOIN departments" +
        " ON products.department_name = departments.department_name WHERE departments.department_name IS NOT NULL ",
        function(err, res) {
            if (err) throw err;
            var table = new Table({
                head: [
                    "department_id",
                    "department_name",
                    "over_head_costs",
                    "product_sales",
                    "total_profit"
                ],
                style: {
                    head: ["blue"],
                    compact: false,
                    allign: ["center"]
                }
            });

            for (var i = 0; i < res.length; i++) {
                table.push([
                    res[i].department_id,
                    res[i].department_name,
                    res[i].over_head_costs,
                    res[i].product_sales,
                    res[i].total_profit
                ]);
            }
            log();
            log(table.toString());
            log();
            connection.end();
        }
    );
}

function createNewDepartment() {

}