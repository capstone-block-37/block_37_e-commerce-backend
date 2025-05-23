# E-Commerce Backend

This repository contains the backend for an e-commerce application, developed as part of the Full Stack Academy coursework. It provides RESTful APIs to manage products, users, orders, and other core functionalities required for an online store.

## Features

- User authentication and authorization
- Product catalog management (CRUD)
- Shopping cart and order processing
- Secure API endpoints
- Database integration

## Technologies Used

- Node.js
- Express.js
- PostgreSQL (with Sequelize ORM)
- JWT for authentication

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd block_37_e-commerce-backend
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**  
    Create a `.env` file based on `.env.example`.

4. **Run database migrations and seeders:**
    ```bash
    npm run db:migrate
    npm run db:seed
    ```

5. **Start the server:**
    ```bash
    npm start
    ```

## API Documentation

See the [API Docs](./docs/API.md) for detailed endpoint information.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is for educational purposes.
