const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createUserProduct,
  fetchUserProduct,
  fetchProductById,
} = require("./db");

const server = express();
client.connect();

server.use(express.json());
server.use(morgan("dev"));
  server.use(cors());

const port = process.env.PORT || 3033;
server.listen(port, () => console.log(`server listening on port ${port}`));

server.get("/api/users", async (req, res, next) => {
  try {
    const users = await fetchUsers();
    console.log(users)
    res.send(users);
  } catch (error) {
    next(error);
  }
});

server.get("/api/products", async (req, res, next) => {
  try {
    console.log("hello")
    const products = await fetchProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

server.get("/api/users/:id/userProducts", async (req, res, next) => {
  try {
    const products = await fetchUserProduct(req.params.id);
    res.send(products);
  } catch (error) {
    next(error);
  }
});


server.get("/api/product/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await fetchProductById(id); 
    if (!product) {
      res.status(404).send({ error: "Product not found" }); 
    } else {
      res.send(product);
    }
  } catch (error) {
    next(error)
  }
});