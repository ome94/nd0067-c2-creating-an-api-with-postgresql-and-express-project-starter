# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index
> `GET /products` 
- Show
> `GET /products/:id`
- Create [token required]
> `GET /products`
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
> `GET /users`
- Show [token required]
> `GET /users/user/:username`
- Create N[token required]
> `POST /users`

#### Orders
- Current Order by user (args: user id)[token required]
> `GET /orders/cart`
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
The database schema for each table is defined in a migrations file for each table. Click on the table links to view the table definitions.
#### Product
Products are stored in the [**`products`** table](./migrations/sqls/20230110210717-products-table-up.sql) . 
- id [INTEGER PRIMARY KEY]
- name [VARCHAR(50) NOT NULL]
- price [NUMERIC(7, 2) NOT NULL]
- [OPTIONAL] category [VARCHAR(50)]

#### User
Users data is stored in the [**`users`** table](./migrations/sqls/20221228032925-users-table-up.sql)
- id [INTEGER PRIMARY KEY]
- firstName [VARCHAR(50)]
- lastName [VARCHAR(50)]
- password [VARCHAR NOT NULL]
- username [VARCHAR(50) UNIQUE]. I included this column because I feel its easier to remember username than an ID number.
- status [VARCHAR(10)]. I included this column to grant/restrict access privileges to certain API endpoints.

#### Orders
Orders data is normalized across 2 tables which include:
1. [**`orders`**](./migrations/sqls/20230110211105-orders-table-up.sql)
- id(Order ID) [BIGSERIAL PRIMARY KEY]
- user_id [INTEGER REFERENCES users(id)]
- status of order (active or complete) [VARCHAR(10)]
2. [**`ordered_products`**](./migrations/sqls/20230110211353-ordered-products-table-up.sql)
- order_id [BIGSERIAL REFERENCES orders(id)]
- id of each product in the order [INTEGER REFERENCES products(id)]
- quantity of each product in the order [SMALLINT NOT NULL]

