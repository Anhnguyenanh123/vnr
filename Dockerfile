# Stage 1: Build Next.js app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run Next.js app
FROM node:18

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 25577
CMD ["npm", "start"]
