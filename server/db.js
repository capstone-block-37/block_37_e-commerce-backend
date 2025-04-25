const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_ecomm_db"
);

const createTables = async () => {
  const SQL = `
        DROP TABLE IF EXISTS user_products;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS products;

        CREATE TABLE products(
            id UUID PRIMARY KEY NOT NULL,
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
            mailing_address VARCHAR(255) NOT NULL,
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

const createUser = async (
  username,
  password,
  is_admin,
  name,
  email_address,
  mailing_address,
  phone_number,
  billing_address
) => {
  const SQL = `INSERT INTO users(id, username, password, is_admin, name, email_address, mailing_address, phone_number, billing_address) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`;
  const hashed_password = await bcrypt.hash(password, 5);

  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    hashed_password,
    is_admin,
    name,
    email_address,
    mailing_address,
    phone_number,
    billing_address,
  ]);

  return response.rows[0];
};

const createProduct = async (description, img_url, price) => {
  const SQL = `INSERT INTO products(id, description, img_url, price) VALUES($1, $2, $3, $4) RETURNING *;`;

  const response = await client.query(SQL, [
    uuid.v4(),
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
    const SQL = `INSERT INTO products(id, user_id, product_id, quantity) VALUES($1, $2, $3, $4) RETURNING *;`;

    const response = await client.query(SQL, [
      uuid.v4(),
      user_id,
      product_id,
      quantity,
    ]);

    return response.rows[0];
  };

    const fetchUserProduct = async () => {
      const SQL = `SELECT * from user_products WHERE user_id = $1;`;

      const response = await client.query(SQL);

      return response.rows;
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
};
