import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().valid('dev', 'prod', 'stage').required(),
  // postgres env variables
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),

  // rabbit mqenv variables
  RABBITMQ_DEFAULT_USER: Joi.string().required(),
  RABBITMQ_DEFAULT_PASS: Joi.string().required(),
  RABBITMQ_PASS: Joi.string().required(),
  RABBITMQ_HOST: Joi.string().required(),
  RABBITMQ_OWNER_QUEUE: Joi.string().required(),
  RABBITMQ_PRODUCT_QUEUE: Joi.string().required(),
  RABBITMQ_ORDER_QUEUE: Joi.string().required(),

  // mongo connection
  MONGO_HOST: Joi.string().required(),
  MONGO_PORT: Joi.string().required(),
  MONGO_DATABASE: Joi.string().required(),

  PRODUCT_SERVICE_PORT: Joi.string().required(),
  ORDER_SERVICE_PORT: Joi.string().required(),

  GRPC_HOST: Joi.string().required(),
});
