const players = require("./database/controllers/players");
const connections = require("./database/controllers/connections");
const matchlogs = require("./database/controllers/matchlogs");

function connect(connection, message) {
  players
    .getByTag(message.gamerTag)
    .then(res => {
      sendMessage(connection, res);
    })
    .catch(err => {
      sendMessage(connection, {
        type: "error",
        error: err
      });
    });
}

function validate_token(gameToken, userToken) {
  return connections.getByToken(userToken).then(connection => {
    console.log(connection);
    return matchlogs.getByTokenPlayer(gameToken, connection.UserId);
  });
}

function sendMessage(connection, message) {
  connection.send(
    JSON.stringify({
      issuer: "authenticator",
      message: message
    })
  );
}

function route(connection, message) {
  switch (message.command) {
    case "connect":
      connect(
        connection,
        message
      );
  }
}

module.exports = {
  route
};
