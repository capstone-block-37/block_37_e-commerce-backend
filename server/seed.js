const {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createUserProduct,
  destroyUserProducts,
} = require("./db");

const seed = async () => {
  await client.connect();
  createTables();
  console.log("table created ", createTables);

  const [omar, radio, phone, watch, computer] = await Promise.all([
    createUser({
      "fullname": "Omar Brimfield",
      "email": "o@gmail.com",
      "username": "OmarB",
      "password": "pass123!",
}),
    createProduct(
      "radio",
      "Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio",
      "https://unsplash.com/photos/a-red-square-object-with-a-question-mark-on-it-_HrwmmfEJFc",
      79.99
    ),
    createProduct(
      "Phone",
      "Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio",
      "https://unsplash.com/photos/gray-rotary-telephone-on-brown-table-NKKvASHfrG4",
      79.99
    ),
    createProduct(
      "Watch",
      "Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio",
      "https://unsplash.com/photos/a-watch-sitting-on-top-of-a-black-leather-belt-Tk7mHxJUA6I",
      1299.0
    ),
    createProduct(
      "Computer",
      "Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio",
      "https://unsplash.com/photos/a-computer-monitor-sitting-on-top-of-a-desk-uqdEKKUhPfQ",
      2899.99
    ),
  ]);
  console.log("users and products created");

  console.log(await fetchUsers());
  console.log(await fetchProducts());

  return;
  const [userProduct1] = await Promise.all([
    createUserProduct({
      description:
        "Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio.",
      img_url:
        "https://unsplash.com/photos/a-red-square-object-with-a-question-mark-on-it-_HrwmmfEJFc",
      price: "79.99",
      user_id: omar.id,
    }),
    createUserProduct({
      description:
        "Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio.",
      img_url:
        "https://unsplash.com/photos/gray-rotary-telephone-on-brown-table-NKKvASHfrG4",
      price: "29.99",
      user_id: andy.id,
    }),
    createUserProduct({
      description:
        "Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio.",
      img_url:
        "https://unsplash.com/photos/a-watch-sitting-on-top-of-a-black-leather-belt-Tk7mHxJUA6I",
      price: "1229.99",
      user_id: gemar.id,
    }),
    createUserProduct({
      description:
        "Al contrario del pensamiento popular, el texto de Lorem Ipsum no es simplemente texto aleatorio.",
      img_url:
        "https://unsplash.com/photos/a-computer-monitor-sitting-on-top-of-a-desk-uqdEKKUhPfQ",
      price: "2899.99",
      user_id: andy.id,
    }),
  ]);
  console.log("products created");

  console.log(await fetchProducts());

  await destroyUserProducts(userProduct1.id);

};


seed();
