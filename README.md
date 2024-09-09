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

Owner Service: Manages owner profiles and emits RabbitMQ events when an owner's details are updated.
Products Service: Manages product details and listens for updates from the Owner Service.
Order Service: Manages orders, listens for product updates, and implements caching for product details using Redis.
Repository Structure
libs/shared/src/proto/: Contains the proto files for gRPC communication.
owner-service/: Implementation of the Owner Service.
products-service/: Implementation of the Products Service.
order-service/: Implementation of the Order Service.
Communication Flow
Owner Service: Upon updating user details, it emits a RabbitMQ event.
Products Service: Listens for the event and makes a gRPC call to update the user details.
Order Service: Listens for product updates and updates orders accordingly.
Retry Logic
The system includes a retry mechanism for failed events, although it is not fully implemented due to time constraints. If an event fails, the request will keep retrying without a logging event emitted.

## Getting Started

To run this application, follow these steps:

## Clone the Repository:

```bash
$ git clone https://github.com/X4MU-L/crimmit-microservice
$ cd crimmit-microservice
```

```bash
$ yarn install
```

### Generate TypeScript Files for proto assests:

Run the following command to generate TypeScript files for the proto files:

```bash
$ make generate
```

Note: Open the generated TypeScript files `.ts` in [libs/shared/src/proto](libs/shared/src/proto/) and change all Id to _id with the type string | ObjectId. this is because typescript does not generate _ (underscore) in variable name.

e.g

```ts
import { ObjectId } from "typeorm";

type Example {
    // Id: string (commented out)
    _id: string | ObjectId;
}
```

## Set Environment Variables:

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

Run the Application:
Use Docker Compose to run the application:

```bash
$ docker-compose up -d
```

each microsevrice can as well be started independendtlly...

having set the environment virables..

```bash

$ yarn start:dev owner-service # start the owner service 
$ yarn start:dev product-service # start the product service 
$ yarn start:dev order-service # start the orderservice 
$ yarn start:dev api # start the api

```
## Access the API:

You can access the API through localhost:3000.

This microservices architecture demonstrates proficiency in building applications with NestJS, implementing inter-service communication via RabbitMQ and gRPC, due to time constrainst i wasn't able to implement and utilize caching mechanisms.
