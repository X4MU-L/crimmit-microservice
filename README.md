<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Crimmit Microservice

This repository contains a microservices architecture built with NestJS for an interview assessment. It consists of three services: Owner Service, Products Service, and Order Service. The services communicate via RabbitMQ and gRPC, with MongoDB as the database. A REST API sit between the communication, emits message pattern to the desire microservice using rabbiMQ and returns a HTTP to the client.

## Overview

_Owner Service:_ Manages owner profiles and also handles the auth for the microservices, will this could have also been a microservice of it's own, for the purpose of this project will serve. Also emits RabbitMQ events when an owner's details are updated.

_Products Service:_ Manages product details and listens for updates from the Owner Service

_Order Service:_ Manages orders, listens for product updates

## Repository Structure

_libs/shared/src/proto/:_ Contains the proto files for gRPC communication.

_owner-service/:_ Implementation of the Owner Service.
_products-service/:_ Implementation of the Products Service.
_order-service/:_ Implementation of the Order Service.

## Communication Flow

_Api Service_: Listen's for HTTP request from outside and is the only exposed service, upon recieving a request emits a rabbitMQ messagepattern to the desired service of the HTTP requests for processing and returns a HTTP response to the client.

_Owner Service_: Handle creation of user and managing of user profiles, Upon updating user details, it emits a RabbitMQ event.

_Products Service_: Handles creation of products and Listens for gRPC call to update the user details.

_Order Service_: Handles the Orders and Listens for product updates and updates orders accordingly.

## Retry Logic

> [!IMPORTANT] The system includes a retry mechanism for failed events, although it is not fully implemented due to time constraints. If an event fails, the request will keep retrying without a logging event emitted.

## Getting Started

To run this application, follow these steps:

### Clone the Repository:

```bash
$ git clone https://github.com/X4MU-L/crimmit-microservice
$ cd crimmit-microservice
```

### Install dependancies

```bash
$ yarn install
```

### Generate TypeScript Files for proto assests:

Run the following command to generate TypeScript files for the proto files:

```bash
$ make generate
```

> [!IMPORTANT] Open the generated TypeScript files `.ts` in [libs/shared/src/proto](libs/shared/src/proto/) and change all `Id`to `_id` with the type `string | ObjectId`. this is because typescript does not generate `_` (underscore) in variable name.

e.g

```ts
import { ObjectId } from "typeorm";

type Example {
    // Id: string (commented out)
    _id: string | ObjectId;
}
```

### Set Environment Variables:

Create a .env file in the root directory and add the following variables:

```conf
RABBITMQ_DEFAULT_USER=
RABBITMQ_DEFAULT_PASS=
RABBITMQ_USER=
RABBITMQ_PASS=
RABBITMQ_HOST=localhost:5672 # use rabbitmq:5672 if running with container
RABBITMQ_OWNER_QUEUE=
RABBITMQ_PRODUCT_QUEUE=
RABBITMQ_ORDER_QUEUE=

JWT_SECRET=

MONGO_HOST=localhost # use mongoDB if running with container
MONGO_PORT=
MONGO_DATABASE=

# Service ports
PRODUCT_SERVICE_PORT=
ORDER_SERVICE_PORT=

# gRPC
GRPC_HOST=
```

### Run the Application:

Use Docker Compose to run the application:

> [!IMPORTANT] having set the environment virables..

```bash
$ docker-compose up -d
```

Or

### Run each Service independently

Each microsevrice can as well be started independendtlly...

> [!IMPORTANT] having set the environment virables..

```bash
$ yarn start:dev owner-service # start the owner service
$ yarn start:dev product-service # start the product service
$ yarn start:dev order-service # start the orderservice
$ yarn start:dev api # start the api

```

## Access the API:

You can access the API through `http://localhost:3000`.

Endpoints

### User Signup

**Endpoint:** `POST http://localhost:3000/auth/signup`

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "username": "johndoe",
  "password": "StrongPassword123!"
}
```

Curl Command:

```bash
curl -X POST http://localhost:3000/auth/signup \
-H "Content-Type: application/json" \
-d '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "username": "johndoe",
  "password": "StrongPassword123!"
}'
```

### User Sign In

**Endpoint:** `POST http://localhost:3000/auth/signin`

**Request Body:**

```json
{
  "username": "johndoe",
  "password": "StrongPassword123!"
}
```

Curl Command:

```bash
curl -X POST http://localhost:3000/auth/signin \
-H "Content-Type: application/json" \
-d '{
  "username": "johndoe",
  "password": "StrongPassword123!"
}'
```

## User Operations (Protected Routes)

### Get User Information

**Endpoint:** `GET http://localhost:3000/user`

Curl Command:

```bash
curl -X GET http://localhost:3000/user \
-H "Authorization: Bearer <your_token>"
```

### Update User Information

**Endpoint:** `PATCH http://localhost:3000/user/update`

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "username": "janedoe"
}
```

Curl Command:

```bash
curl -X PATCH http://localhost:3000/user/update \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{
  "firstName": "Jane",
  "lastName": "Doe",
  "username": "janedoe"
}'
```

## Product Operations (Protected Routes)

### Get All Products

**Endpoint:** `GET http://localhost:3000/product`

Curl Command:

```bash
curl -X GET http://localhost:3000/product \
-H "Authorization: Bearer <your_token>"
```

### Get Product by ID

**Endpoint:** `GET http://localhost:3000/product/:id`

Curl Command:

```bash
curl -X GET http://localhost:3000/product/<product_id> \
-H "Authorization: Bearer <your_token>"
```

### Create a Product

**Endpoint:** `POST http://localhost:3000/product/create`

**Request Body:**

```json
{
  "name": "Sample Product",
  "price": 29.99,
  "description": "This is a sample product."
}
```

Curl Command:

```bash
curl -X POST http://localhost:3000/product/create \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{
  "name": "Sample Product",
  "price": 29.99,
  "description": "This is a sample product."
}'
```

### Update a Product

**Endpoint:** `PATCH http://localhost:3000/product/update/:id`

**Request Body:**

```json
{
  "name": "Updated Product",
  "price": 39.99,
  "description": "This is an updated product."
}
```

Curl Command:

```bash
curl -X PATCH http://localhost:3000/product/update/<product_id> \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{
  "name": "Updated Product",
  "price": 39.99,
  "description": "This is an updated product."
}'
```

### Get Products by User ID

**Endpoint:** `GET http://localhost:3000/product/user/:id`

Curl Command:

```bash
curl -X GET http://localhost:3000/product/user/<user_id> \
-H "Authorization: Bearer <your_token>"
```

## Order Operations (Not Fully Implemented | Protected routes)

> [!NOTE] The Order services endpoints are not yet fully functional, this is due to time contraints

### Get All Orders of a User

**Endpoint:** `GET http://localhost:3000/order`

Curl Command:

```bash
curl -X GET http://localhost:3000/order \
-H "Authorization: Bearer <your_token>"
```

### Get Order by ID

**Endpoint:** `GET http://localhost:3000/order/:id`

Curl Command:

```bash
curl -X GET http://localhost:3000/order/<order_id> \
-H "Authorization: Bearer <your_token>"
```

### Create an Order

**Endpoint:** `POST http://localhost:3000/order/create`

**Request Body:**

```json
{
  "productIds": ["<product_id_1>", "<product_id_2>"],
  "quantity": 2,
  "totalPrice": 59.98
}
```

Curl Command:

```bash
curl -X POST http://localhost:3000/order/create \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{
  "productIds": ["<product_id_1>", "<product_id_2>"],
  "quantity": 2,
  "totalPrice": 59.98
}'
```

### Update an Order

**Endpoint:** `PATCH http://localhost:3000/order/update/:id`

**Request Body:**

```json
{
  "productIds": ["<product_id_1>", "<product_id_2>"],
  "quantity": 3,
  "totalPrice": 89.97
}
```

Curl Command:

```bash
curl -X PATCH http://localhost:3000/order/update/<order_id> \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_token>" \
-d '{
  "productIds": ["<product_id_1>", "<product_id_2>"],
  "quantity": 3,
  "totalPrice": 89.97
}'
```

> [!NOTE] Replace <your_token>, <product_id>, <user_id>, and <order_id> with actual values. Ensure the server is running on localhost:3000 before making requests.

This microservices architecture demonstrates proficiency in building applications with NestJS, implementing inter-service communication via RabbitMQ and gRPC, due to time constrainst i wasn't able to implement and utilize caching mechanisms.
