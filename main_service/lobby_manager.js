var initGame = require("./game_manager.js").initGame;
const connections = require("./database/controllers/connections");

var waitList = {};

async function addWaitingPlayer(connection, message) {
  let { gameToken, token } = message;
  console.log(message);
  let player = await getPlayerInfos(token);
  if (waitList.hasOwnProperty(gameToken)) {
    console.log("Starting game!");
    initGame(waitList[gameToken], player);
    delete waitList[gameToken];
  } else {
    waitList[gameToken] = player;
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
      addWaitingPlayer(connection, message);
  }
}

module.exports = {
  route
};
