const express = require("express");
const morgan = require("morgan");
const {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createUserProduct,
  fetchUserProduct,
} = require("./db");

const server = express();
client.connect();

server.use(express.json());
server.use(morgan("dev"));

const port = process.env.PORT || 3033;
server.listen(port, () => console.log(`server listening on port ${port}`));

server.get("/api/users", async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

server.get("/api/products", async (req, res, next) => {
  try {
    const skills = await fetchProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

server.get("/api/users/:id/userProducts", async (req, res, next) => {
  try {
    const skills = await fetchUserProduct(req.params.id);
    res.send(products);
  } catch (error) {
    next(error);
  }
});