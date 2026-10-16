FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY public ./public
COPY src ./src
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["npm", "start"]
