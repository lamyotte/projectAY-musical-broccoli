"use strict";

const Hapi = require("@hapi/hapi");
const DeckHelper = require("./helpers/DeckHelper");
const TokenHelper = require("./helpers/TokenHelper");
const UserHelper = require("./helpers/UserHelper");

const init = async () => {
  const server = Hapi.server({
    port: 3002,
    host: "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
        additionalHeaders: ["cache-control", "x-requested-with"]
      }
    }
  });

  server.route({
    method: "PUT",
    path: "/signup",
    handler: function(request, h) {
      const payload = request.payload;
      return `New User ${encodeURIComponent(payload.username)}!`;
    }
  });

  server.route({
    method: "POST",
    path: "/signin",
    handler: async function(request, h) {
      const payload = request.payload;
      console.log(payload);
      return await UserHelper.signin(payload.username, payload.password);
    }
  });

  server.route({
    method: "GET",
    path: "/users/{user}",
    handler: async function(request, h) {
      const params = request.params;
      return await UserHelper.getProfile(params.user);
    }
  });

  server.route({
    method: "GET",
    path: "/users/{user}/decks",
    handler: async function(request, h) {
      return await DeckHelper.getDecks(request.params);
    }
  });

  server.route({
    method: "PUT",
    path: "/users/{user}/decks",
    handler: function(request, h) {
      const payload = request.payload;
      return `Creating new deck for ${encodeURIComponent(
        request.params.user
      )}!`;
    }
  });

  server.route({
    method: "POST",
    path: "/token/game/request",
    handler: function(request, h) {
      const payload = request.payload;
      return `Resquesting game token ${encodeURIComponent(payload.user)}!`;
    }
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
