const players = require("./database/controllers/players");
const matchlogs = require("./database/controllers/matchlogs");

var waitList = [];

/**
 * Interval function to start games
 * @param  {array} waitList list of waiting players
 */
function matchmake() {
  if (waitList.length > 1) {
    initGame(waitList[0], waitList[1]);
    waitList.splice(0, 2);
  }
}
async function initGame(player1, player2) {
  let log = await matchlogs.create(
    player1.player.id,
    player2.player.id,
    player1.deck.id,
    player2.deck.id
  );
  sendMessage(player1.connection, {
    gameToken: log.matchToken
  });
  sendMessage(player2.connection, {
    gameToken: log.matchToken
  });
  player1.connection.close();
  player2.connection.close();
}

function addWaitingPlayer(connection, player, deck) {
  waitList.push({
    player: player,
    deck: deck,
    connection: connection
  });
  sendMessage(connection, "Request received wait for second player...");
  matchmake();
}

function removeWaitingPlayer(index = null, id = null) {
  if (index != null) {
  } else if (id != null) {
  }
}

function sendMessage(connection, message) {
  connection.send(
    JSON.stringify({
      issuer: "matchmaker",
      message: message
    })
  );
}
module.exports = {
  addWaitingPlayer
};
