// dependencies needed to run the application
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

// connect to the database and calls supervisorView function where all the operation takes place
connection.connect(function(err) {
    if (err) throw err;
    supervisorView();
});

function supervisorView() {
    log(); // just for extra space in the console.log terminal

    // a prompt will ask a supervisor/user to choose on options 
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "Please choose an option: ",
        choices: ["View Product Sales by Department", "Create New Department"]
    }).then(function(answer) {
        // based on the supervisor/user's answer it will either go to one of the function below
        if (answer.options === "View Product Sales by Department") {
            viewProductSales();
        } else {
            createNewDepartment();
        }
    })
};

function viewProductSales() {
    // use query connect to see/read all data in the database.
    // used JOIN property of mysql to get and combine different column from 2 tables
    // total profit was computer here as well
    // set the depatment id in ascending order
    connection.query(
        " SELECT departments.department_id, departments.department_name, departments.over_head_costs, product_sales, ( product_sales - departments.over_head_costs ) AS total_profit  " +
        " FROM products JOIN departments" +
        " ON products.department_name = departments.department_name WHERE departments.department_name IS NOT NULL ORDER BY departments.department_id ASC",
        function(err, res) {
            if (err) throw err;

            // used CLI-table to output in a table the data that we query from our database
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
    // prompts a supervisor/user for the department name 
    inquirer
        .prompt([{
                name: "department_name",
                type: "input",
                message: "Please enter the department name: "
            },
            {
                name: "over_head_costs",
                type: "input",
                message: "What is the over_head_costs for this department? "
            }
        ])
        .then(function(answer) {
            // insert new depatment_name into department table
            var queryStr = " INSERT INTO departments SET ? ";
            connection.query(queryStr, answer, function(err, res) {
                if (err) throw err;

                // console log the newly added department name
                log(chalk.magenta("\n----------------------------------------\n"));
                log("You just add a new department named: " + chalk.green(answer.department_name));
                log();
                log("Over_head_costs for this department is: " + chalk.green(answer.over_head_costs));
                log(chalk.magenta("\n----------------------------------------\n"));
                connection.end();
            });
        });
}