FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm install
COPY . .
EXPOSE 5173 5001
CMD ["npm", "run", "dev"]
