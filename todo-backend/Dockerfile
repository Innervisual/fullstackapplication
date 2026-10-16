FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY app.js ./
COPY bin ./bin
COPY routes ./routes
RUN mkdir -p data && chown -R node:node /app
USER node
ENV HOST=0.0.0.0
EXPOSE 5000
CMD ["npm", "start"]
