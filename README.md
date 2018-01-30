# bamazon

# Description
  - an amazon like store using ***Node.js & MySQL***
  - This app will take in orders from customers and deplete stock from the store's inventory.
  
## Library Used
- mysql - used to connect and querry to the database
- inquirer - used for user input
- chalk - used to prettify the terminal output
- cli-table - used to create table for the terminal output

## Notes
- Initialize a `package.json` file at your project root by running *npm init*.

## There are 3 Challenges needed to be done 
 
 ### First - Customer view
   - Created a database called `bamazon`in mysql workbench
   
   - Then a table inside the database with the following columns
   
   - Populate this database with around 10 different products as shown below

![screen shot 2018-01-26 at 5 39 32 pm](https://user-images.githubusercontent.com/31137669/35466653-ed8b076c-02c2-11e8-8cd7-4ad12e594803.png)
    

- Then created a node application called `bamazonCustomer.js`.
    - Command needed to run the application:
    
          - node bamazonCustomer.js
    
    - Running this application will first display all of the items available for sale. 
    - Include the ids, names, and prices of products for sale
    - It will then prompt the user/buyer with two messages:
      - The first should ask them the ID of the product they would like to buy.
      - The second message should ask how many units of the product they would like to buy. 
    - Once the customer has placed the order, `bamazon` application should check the store if it has enough of the product to meet the  customer's request.
     - If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through like the shown below.

![screen shot 2018-01-26 at 5 44 08 pm](https://user-images.githubusercontent.com/31137669/35466777-43316e26-02c4-11e8-8de5-8fabe27fe7e6.png)

 -  However, if your store does have enough of the product, you should fulfill the customer's order.
      - This means updating the SQL database to reflect the remaining quantity.
 
 ![screen shot 2018-01-26 at 5 39 18 pm](https://user-images.githubusercontent.com/31137669/35466890-8301db02-02c5-11e8-805d-b5e42464d556.png)
 
 
    - Once the update goes through, it will show the customer the total cost of their purchase.
   
 ![screen shot 2018-01-26 at 5 38 30 pm](https://user-images.githubusercontent.com/31137669/35466804-7f49f180-02c4-11e8-9789-0c8c1dfea0a1.png)

    
### Second - Manager View
  - Created a new Node application called `bamazonManager.js`. Running this application will list a set of menu options like shown below:
 
 ![screen shot 2018-01-27 at 7 37 07 pm](https://user-images.githubusercontent.com/31137669/35478408-074321ee-039a-11e8-8350-aada08e0426d.png)

- If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

![screen shot 2018-01-27 at 7 44 19 pm](https://user-images.githubusercontent.com/31137669/35478430-882dded4-039a-11e8-91cd-5e206542bf3c.png)

- If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

![screen shot 2018-01-27 at 7 46 34 pm](https://user-images.githubusercontent.com/31137669/35478440-d342bc46-039a-11e8-842b-f880d4d2998f.png)

- If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

![screen shot 2018-01-27 at 7 48 46 pm](https://user-images.githubusercontent.com/31137669/35478449-23ed8414-039b-11e8-891d-0f093c10b646.png)

-If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

![screen shot 2018-01-27 at 7 54 04 pm](https://user-images.githubusercontent.com/31137669/35478482-e069376e-039b-11e8-8aa9-291298670bc7.png)

 
 ### Supervisor view
   - Created a new MySQL table called `departments` with the following columns:
      - department_id
      - department_name 
      - over_head_costs (A dummy number you set for each department)
  - Modified the products table so that there's a product_sales column
  
![screen shot 2018-01-29 at 11 33 26 pm](https://user-images.githubusercontent.com/31137669/35551544-d9541572-054c-11e8-8c6e-443bb269d567.png)

- Modified the `bamazonCustomer.js` app so that this value is updated with each individual products total revenue from each sale, and in the database's column. Terminal output are shown below as well as the updated values in mysql database.

![screen shot 2018-01-28 at 12 40 58 pm](https://user-images.githubusercontent.com/31137669/35486331-ff684bb2-0429-11e8-90c5-63a659d3555d.png)

![screen shot 2018-01-28 at 12 41 36 pm](https://user-images.githubusercontent.com/31137669/35486336-0be010a0-042a-11e8-8adb-9d65f8ae83af.png)

![screen shot 2018-01-28 at 12 41 55 pm](https://user-images.githubusercontent.com/31137669/35486344-1a2bb2fe-042a-11e8-857b-b27f55fe4403.png)

Making sure that our app still updates the inventory listed in the products column.

- Created another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options as shown below:

![screen shot 2018-01-29 at 11 12 58 pm](https://user-images.githubusercontent.com/31137669/35551132-08d87574-054b-11e8-82d4-f579f604c6eb.png)

- When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. 

![screen shot 2018-01-29 at 10 43 29 pm](https://user-images.githubusercontent.com/31137669/35551213-59fe509a-054b-11e8-907c-658e2a349d3c.png)

    - The total_profit column was calculated on the fly using the difference between over_head_costs and product_sales. 
    - It was not stored in any database. Used a custom alias for total_profit.

- When a supervisor selects Create New Department, below is the output in the terminal

 ![screen shot 2018-01-29 at 11 13 32 pm](https://user-images.githubusercontent.com/31137669/35551336-dd81f656-054b-11e8-9bbd-610d81b241d5.png)
 
 - and the database is updated as well.
 
 ![screen shot 2018-01-29 at 11 13 51 pm](https://user-images.githubusercontent.com/31137669/35551447-5d20966a-054c-11e8-8326-51a786128a67.png)
 
   
## Copyright
Copyright © 2018 Shirley Ramirez
  



