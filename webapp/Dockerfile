FROM node:22.11.0-alpine
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
EXPOSE 3000
CMD ["yarn", "dev"]
