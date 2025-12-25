# E-commerce Backend (Node.js + Express + MongoDB)

This folder contains three small services used by the Next.js frontend:

- User service (port 3001)
- Product service (port 3002)
- Order service (port 3003)

All services share a single MongoDB database, configured via `MONGODB_URI`.

## Setup

1. Go to the backend folder:

   cd backend

2. Install dependencies (using your preferred package manager):

   pnpm install
   # or
   npm install

3. Create a `.env` file:

   cp .env.example .env

   Then edit `.env` and set `MONGODB_URI` to your MongoDB connection string.

## Running the services

Development with auto-reload (nodemon):

- User service:

  pnpm run dev:user-service

- Product service:

  pnpm run dev:product-service

- Order service:

  pnpm run dev:order-service

Or without nodemon:

- User service: pnpm run user-service
- Product service: pnpm run product-service
- Order service: pnpm run order-service

## Frontend URLs

The Next.js frontend reads the backend base URLs from the root `.env` file using these variables:

- `NEXT_PUBLIC_USERS_SERVICE_URL`
- `NEXT_PUBLIC_PRODUCTS_SERVICE_URL`
- `NEXT_PUBLIC_ORDERS_SERVICE_URL`

In your current setup these point to the deployed Render services, for example:

- Users: `https://users-service-ngb3.onrender.com/users`
- Products: `https://product-service-ad0t.onrender.com/products`
- Orders: `https://order-service-12rh.onrender.com/orders`

For local development, you can instead set the `.env` values to use your local ports:

- `NEXT_PUBLIC_USERS_SERVICE_URL=http://localhost:3001`
- `NEXT_PUBLIC_PRODUCTS_SERVICE_URL=http://localhost:3002`
- `NEXT_PUBLIC_ORDERS_SERVICE_URL=http://localhost:3003`

The services respond with the following shapes, which the frontend expects:

- User: `{ _id, name, email }`
- Product: `{ _id, title, author, price }`
- Order: `{ _id, userId, productId, quantity }`
