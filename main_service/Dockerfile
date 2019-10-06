FROM node:10

RUN mkdir -p /usr/src/app/main_service
WORKDIR /usr/src/app/main_service

COPY main_service/package.json /usr/src/app/main_service
RUN npm install
COPY ./main_service /usr/src/app/main_service
COPY ./database /usr/src/app/database

RUN cd /usr/src/app/database && npm install

EXPOSE 8084