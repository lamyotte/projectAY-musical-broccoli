FROM node:10

RUN mkdir -p /usr/src/app/matchmaking_service
WORKDIR /usr/src/app/matchmaking_service

COPY matchmaking_service/package.json /usr/src/app/matchmaking_service
RUN npm install
COPY ./matchmaking_service /usr/src/app/matchmaking_service
COPY ./database /usr/src/app/database

RUN cd /usr/src/app/database && npm install

EXPOSE 8083