FROM node:18-alpine

WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm install --production

# copy source
COPY . .

ENV NODE_ENV=production
EXPOSE 6500

CMD [ "npm", "run", "start" ]
