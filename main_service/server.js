var WebSocketServer = require("ws");

var http = require("http");
var matchmaker = require("./matchmaker.js").route;
var authentication_module = require("./authentication_module.js").route;
var global_manager = require("./global_manager.js").route;
var game_manager = require("./game_manager.js").route;
var lobby_manager = require("./lobby_manager.js").route;

const controllers = require("./database/controllers");

var connections = {}; // Ongoing connections by id
var waitingPlayers = []; // Waiting list for players looking to play
var nextId = 0; // Next unallocated connection id
var nextGameId = 0; // Next unallocated game id
var games = {}; // Ongoing games

var server = http.createServer(function(request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8084, "0.0.0.0", function() {
  console.log("Listening to port:  " + 8084);
});

wsServer = new WebSocketServer.Server({ server });

/**
 * detect wether the specifier origin is allowed
 * @param  {[type]} origin the origin of the request
 * @return {boolean}        true if the origin is allowed
 */
function originIsAllowed(origin) {
  return true;
}

wsServer.on("connection", function(connection) {
  // Verifying origin of request
  if (!originIsAllowed(connection.origin)) {
    connection.reject();
    console.log(
      new Date() + " Connection from origin " + connection.origin + " rejected."
    );
    return;
  }

  //Accept and save connection
  connection.send(
    JSON.stringify({
      message: "Connection Accepted"
    })
  );
  connections[nextId] = connection;
  let currentId = nextId;
  nextId++;
  console.log(new Date() + " Connection accepted.");
  //
  connection.on("message", function(message) {
    let request = JSON.parse(message);
    if (request.hasOwnProperty("target")) {
      switch (request.target) {
        case "matchmaker":
          matchmaker(connection, request.message);
          break;
        case "authenticator":
          authentication_module(connection, request.message);
          break;
        case "global-manager":
          global_manager(connection, request.message);
          break;
        case "game-manager":
          game_manager(connection, request.message);
          break;
        case "lobby-manager":
          lobby_manager(connection, request.message);
          break;
      }
    }
    console.log("Received Message: " + message);
  });
  connection.on("close", function(reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
    // Logic to remove from saved connections ...
    // See id attribition logic
    // Consider garbage collector
  });
});

/**
 * Retrieves player connections and send start game signal
 * @param  {object} connection the connection object
 * @param  {object} request    the start game request
 * @param  {number} id         the id of the connection
 */
function startGame(connection, request, id) {
  connection.send(
    JSON.stringify({
      command: "sys",
      message: "Player info received, matching player..."
    })
  );
  if (waitingPlayers.length === 0) {
    waitingPlayers.push({
      ID: id,
      data: request.data
    });
  } else {
    let opponent = waitingPlayers[0];
    waitingPlayers.splice(0, 1);
    games[nextGameId] = {
      player1: request.data,
      player2: opponent.data
    };
    //Send game details to waiting oponent
    connections[opponent.ID].send(
      JSON.stringify({
        command: "startGame",
        opData: request.data,
        loData: opponent.data,
        gameId: nextGameId
      })
    );
    //Send game details to current connection
    connection.send(
      JSON.stringify({
        command: "startGame",
        opData: opponent.data,
        loData: request.data,
        gameId: nextGameId
      })
    );
    nextGameId++;
    console.log(waitingPlayers);
  }
}
