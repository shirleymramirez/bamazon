DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
	item_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NULL,
    department_name VARCHAR(50) NULL,
    price INTEGER(10) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (item_id)
);



INSERT INTO products (product_name, department_name, price, stock_quantity)

VALUES ('shoes',        'clothing,shoes and jewelry','20.00',  '30' ),
       ('frying pan',   'home and kitchen',          '18.00',  '10' ),
       ('chocolates',   'grocery and Gourment food', '8.00',   '50' ),
       ('desk lamp',    'beauty and personal care',  '29.00',  '11' ),
       ('camping tent', 'sports and outdoor',        '267.00', '17' ),
       ('bed',          'home and kitchen',          '526.00', '14' ),
       ('tv',           'home and kitchen',          '1200.00','27' ),
       ('microwave',    'home and kitchen',          '62.92',  '40' ),
       ('soccer',       'home and kitchen',          '20.28',  '65' ),
       ('gucci perfume','beauty and personal care',  '59.90',  '110');


USE bamazon_db;

ALTER TABLE products
ADD product_sales INTEGER(10) NOT NULL;

CREATE TABLE departments(
	department_id INTEGER(10) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50) NULL,
    over_head_costs INTEGER(10) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments(department_name, over_head_costs)
VALUES ('garden',        10000),
	   ('pets',          20000),
       ('kids ',         10000),
	   ('books',         10000),
       ('movies',        10000),
       ('music',         10000),
       ('toys and baby', 10000),
       ('school supply', 10000)



