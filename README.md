# Express MongoDB eCommerce API

## Overview
This repository hosts a Node.js Express API designed for eCommerce applications, integrating MongoDB for efficient product and user management. It's a practical solution for handling CRUD operations in an eCommerce context.

## Features
- Comprehensive CRUD operations for both products and users.
- Advanced query capabilities for product search, including price filtering and regex-based name searching.
- Seamless integration with MongoDB for robust data handling.

## Installation and Setup
To get this project up and running on your local machine, follow these steps:

1. **Clone the Repository**
   ```sh
   git clone https://github.com/TheodoreRed/express-mongodb-simple-ecommerce-api.git
   ```

2. **Install Dependencies**
   ```sh
   cd express-mongodb-simple-ecommerce-api
   npm install
   ```

3. **Start the Server**
   ```sh
   npm start
   ```

## API Endpoints

### Products
- **GET `/products`** - Retrieve all products or filter by query parameters.
- **GET `/products/:id`** - Get a specific product by its ID.
- **POST `/products`** - Add a new product to the database.
- **PUT `/products/:id`** - Update details of an existing product.
- **DELETE `/products/:id`** - Remove a product from the database.
- **PATCH `/products/:id/sale`** - Apply a sale/discount to a product.

### Users
- **GET `/users/:id`** - Fetch a single user's details.
- **POST `/users`** - Register a new user.
- **PUT `/users/:id`** - Update a user's information.
- **DELETE `/users/:id`** - Delete a user's account.

