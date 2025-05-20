const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv");

const connectionString = process.env.DATABASE_URL 
//  "postgres://localhost/acme_ecomm_db";

const client = new pg.Client({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"
      ? { rejectUnauthorized: false }
      : undefined,
});

const findUserByToken = async (token) => {
  //verify the token
  const { id } = await jwt.verify(token, process.env.JWT || "hello");

  console.log("hello id", id);

  const SQL = `SELECT * FROM users WHERE id = $1`;

  const response = await client.query(SQL, [id]);

  return response.rows[0];
};

const createTables = async () => {
  const SQL = `
        DROP TABLE IF EXISTS user_products;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;

        CREATE TABLE products(
            id UUID PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            img_url VARCHAR(255) NOT NULL,
            price FLOAT NOT NULL
        );

        CREATE TABLE users(
            id UUID PRIMARY KEY NOT NULL,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            is_admin BOOLEAN NOT NULL DEFAULT false,
            name VARCHAR(255) NOT NULL,
            email_address VARCHAR(255),
            mailing_address VARCHAR(255),
            phone_number VARCHAR(255),
            billing_address VARCHAR(255)
);

        CREATE TABLE user_products(
            id UUID PRIMARY KEY NOT NULL,
            user_id UUID REFERENCES users(id) NOT NULL,
            product_id UUID REFERENCES products(id) NOT NULL,
            quantity INT NOT NULL
        );
    `;

  await client.query(SQL);
};

const createUser = async ({ fullname, username, password, email }) => {
  const SQL = `INSERT INTO users(id, name, username, password, email_address) VALUES($1, $2, $3, $4, $5) RETURNING *;`;
  const hashed_password = await bcrypt.hash(password, 5);

  const response = await client.query(SQL, [
    uuid.v4(),
    fullname,
    username,
    password,
    email,
  ]);

  return response.rows[0];
};

const createProduct = async (name, description, img_url, price) => {
  const SQL = `INSERT INTO products(id, name, description, img_url, price) VALUES($1, $2, $3, $4, $5) RETURNING *;`;

  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    description,
    img_url,
    price,
  ]);

  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `SELECT * from users;`;

  const response = await client.query(SQL);

  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `SELECT * from products;`;

  const response = await client.query(SQL);

  return response.rows;
};

const createUserProduct = async (user_id, product_id, quantity) => {
  const SQL = `INSERT INTO user_products(id, user_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *;`;

  const response = await client.query(SQL, [
    uuid.v4(),
    user_id,
    product_id,
    quantity,
  ]);

  return response.rows[0];
};

const fetchUserProduct = async (id) => {
  const SQL = `SELECT * from user_products WHERE user_id = $1;`;
  const response = await client.query(SQL, [id]);

  return response.rows;
};

async function destroyUserProducts(id, user_id) {
  const SQL = `DELETE FROM user_products WHERE id=$1 AND user_id=$2`;
  await client.query(SQL, [id, user_id]);
}

const fetchProductById = async (id) => {
  const SQL = `SELECT * FROM products WHERE id = $1;`;

  const response = await client.query(SQL, [id]);

  return response.rows[0];
};

module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createUserProduct,
  fetchUserProduct,
  destroyUserProducts,
  fetchProductById,
  findUserByToken,
};
