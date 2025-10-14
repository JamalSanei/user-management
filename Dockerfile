# Base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./

# Install application dependencies using `npm install`
RUN npm install

# Copy source code
COPY . .

# Prisma generate before running app
RUN npx prisma generate --schema prisma/schema.prisma

# Expose the app port
# EXPOSE 3000

# Run the app

CMD ["npm", "run", "start:dev"]
# ENTRYPOINT ["/bin/sh", "-c", "npm run start:dev"]