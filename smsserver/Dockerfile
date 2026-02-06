# Dockerfile (Node)
FROM node:20-alpine

WORKDIR /usr/src/app

# copy only package files first for better caching
COPY package*.json ./
RUN npm ci

# then copy app code
COPY . .

EXPOSE 3000
CMD ["npm","run","start-prod"]
#CMD ["npm","run","start-dev"]