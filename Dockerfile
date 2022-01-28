FROM node:alpine

COPY . /src

WORKDIR /src

RUN npm install && \
    npm install --global cross-env && \
    npm install --prefix app && \
    npm run prod && \
    cp app/server.config.template.js app/server.config.js

ENTRYPOINT ["npm", "--prefix", "app", "run", "serve"]

