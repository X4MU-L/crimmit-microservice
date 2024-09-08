# Stage 1: Base Image
FROM node:18 AS base

# Set working directory
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
# Install dependencies
RUN yarn install --frozen-lockfile



# Stage 2: Development
FROM base AS dev
COPY . .
CMD ["yarn", "start:dev", "order-service"]



# Stage 3: Build
FROM base AS build
COPY . .
RUN yarn build


# Stage 4: Production
FROM node:16 AS prod
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/package.json /usr/src/app/yarn.lock ./

RUN yarn install --production --frozen-lockfile
EXPOSE 3000
CMD ["node", "dist/order-service/main.js"]