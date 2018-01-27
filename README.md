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
 
 ### Customer view
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

    
    
    
 
 ### Manager View
 
 ### Supervisor view
   
## Copyright
Copyright © 2018 Shirley Ramirez
  



