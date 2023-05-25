FROM node:latest
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY ./ ./
EXPOSE 4000
CMD ["ts-node", "src/index.ts"]