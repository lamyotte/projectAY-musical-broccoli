var WebSocketServer = require("ws");

var http = require("http");
var matchmaker = require("./matchmaker.js");
const Connection = require("./database/controllers/connections");
const Deck = require("./database/controllers/decks");

var connections = {}; // Ongoing connections by id
var nextId = 0; // Next unallocated connection id

var server = http.createServer(function(request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8083, "0.0.0.0", function() {
  console.log("Listening to port:  " + 8083);
});

wsServer = new WebSocketServer.Server({ server });

/**
 * Detect wether the specifier origin is allowed
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
  connection.on("message", async function(message) {
    // Possible requests
    // 1) Queue for game
    let request = JSON.parse(message);
    // 1) Get player and validate token
    player = await validatToken(request.token);
    if (player === false)
      connection.send(
        JSON.stringify({
          command: "err",
          message: "Connection Refused"
        })
      );
    // 2) Q player
    // Get deck
    let deck = await Deck.getById(request.deck);
    matchmaker.addWaitingPlayer(connection, player, deck);

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

async function validatToken(token) {
  player = await Connection.getByPlayerToken(token);
  if (!player.hasOwnProperty("id")) return false;
  return player;
}
