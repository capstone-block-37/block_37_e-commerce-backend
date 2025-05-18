const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
  destroyUserProducts,
  findUserByToken,
} = require("./db");

const server = express();
client.connect();

server.use(express.json());
server.use(morgan("dev"));
server.use(cors());

server.use(async (req, res, next) => {
  try {
    //get the token from the request
    const token = req.header("Authorization");

    if (token) {
      const user = await findUserByToken(token);

      if (!user || !user.id) {
        next({
          name: "Authorization Header Error",
          message: "Authorization token malformed",
        });
        return;
      } else {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const port = process.env.PORT || 3033;
server.listen(port, () => console.log(`server listening on port ${port}`));

server.get("/api/users", async (req, res, next) => {
  try {
    const users = await fetchUsers();
    console.log(users);
    res.send(users);
  } catch (error) {
    next(error);
  }
});

server.get("/api/products", async (req, res, next) => {
  try {
    console.log("hello");
    const products = await fetchProducts();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

server.get("/api/users/userProducts", async (req, res, next) => {
  try {
    console.log(req.user);
    const products = await fetchUserProduct(req.user.id);
    res.send(products);
  } catch (error) {
    next(error);
  }
});

server.post("/api/users/userProducts", async (req, res, next) => {
  try {
    console.log(req.user);
    const products = await createUserProduct(req.user.id, req.body.product_id, req.body.quantity);
    res.send(products);
  } catch (error) {
    next(error);
  }
});

server.delete("/api/users/userProducts/:id", async (req, res, next) => {
  try {
    const products = await destroyUserProducts(req.params.id, req.user.id);
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
    next(error);
  }
});

server.post("/api/register", async (req, res, next) => {
  try {
    const { fullname, username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT) || 5
    );

    const user = await createUser({
      fullname,
      username,
      password: hashedPassword,
      email,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT || "hello");

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

server.post("/api/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const users = await fetchUsers();
    const user = users.find((user) => user.username === username);

    if (!user) {
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      res.status(401).send({ error: "Invalid username or password" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT || "hello");

    res.send({ token });
  } catch (error) {
    next(error);
  }
});
