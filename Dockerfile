# Base image
FROM node:18

# Set working directory
WORKDIR /app


# Install necessary dependencies for Prisma
# RUN apk update && apk add openssl1.1-compat

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install


# Copy source code
COPY . .

ENV DATABASE_URL=""
ENV JWT_SECRET=""
ENV ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC=""



# Prisma generate before running app
RUN npx prisma generate --schema prisma/schema.prisma

# Expose the app port
EXPOSE 3000

# Run the app

CMD ["npm", "run", "start:dev"]