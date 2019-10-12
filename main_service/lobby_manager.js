const updateConnection = require("./game_manager.js").updateConnection;
const initGame = require("./game_manager.js").initGame;
const connections = require("./database/controllers/connections");
const matchlogs = require("./database/controllers/matchlogs");

var waitList = {};

async function addWaitingPlayer(connection, message) {
  let { gameToken, token } = message;
  console.log(message);
  let player = await getPlayerInfos(token);
  if (waitList.hasOwnProperty(gameToken)) {
    if (waitList[gameToken] == connection) return;
    console.log("Starting game!");
    let match = await matchlogs.getByToken(gameToken);
    if (match.status != "LOBBY") return;
    matchlogs.updateStatus(match.id, "ON-GOING");
    console.log(match);
    initGame(
      {
        id: match.player1,
        deckId: match.deck1,
        connection: waitList[gameToken]
      },
      {
        id: match.player2,
        deckId: match.deck2,
        connection: connection
      }
    );
    delete waitList[gameToken];
  } else {
    waitList[gameToken] = connection;
  }
}

async function handle_new_connection(connection, message) {
  let { gameToken, token } = message;
  let match = await matchlogs.getByToken(gameToken);
  console.log(match);
  let player = await getPlayerInfos(token);
  if (match.status == "ARCHIVED") return; // Game has ended connection impossible
  if (match.status == "ON-GOING") {
    updateConnection(player.id, connection);
    return;
  }
  if (waitList.hasOwnProperty(gameToken)) {
    if (waitList[gameToken].token == token) {
      waitList[gameToken].connection = connection;
    } else {
      initGame(
        {
          id: match.player1,
          deckId: match.deck1,
          connection: waitList[gameToken].connection
        },
        {
          id: match.player2,
          deckId: match.deck2,
          connection: connection
        }
      );
      delete waitList[gameToken];
    }
  } else {
    waitList[gameToken] = {
      token: token,
      connection: connection
    };
  }
}

function getPlayerInfos(token) {
  console.log(token);
  return connections.getPlayer(token);
}

function removeWaitingPlayer(index = null, id = null) {
  if (index != null) {
  } else if (id != null) {
  }
}

function sendMessage(connection, message) {
  connection.send(
    JSON.stringify({
      issuer: "lobby-manager",
      message: message
    })
  );
}

function route(connection, message) {
  console.log(message);
  switch (message.command) {
    case "start-game":
      handle_new_connection(connection, message);
  }
}

module.exports = {
  route
};
