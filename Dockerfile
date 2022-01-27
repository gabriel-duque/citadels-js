FROM node:alpine

COPY . /src

WORKDIR /src

RUN npm install && \
    npm install --global cross-env && \
    npm install --prefix srv && \
    npm run prod && \
    cp srv/server.config.template.js srv/server.config.js

ENTRYPOINT ["npm", "--prefix", "srv", "run", "serve"]

