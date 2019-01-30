const players = require('./database/controllers/players');
const decks = require('./database/controllers/decks');

function getDeck(connection, message) {
	decks.getByPlayer(message.playerId)
		.then((res) => {
			sendMessage(connection, message.command, res);
		})
		.catch((err) => {
			console.log(err);
			sendMessage(connection, message.command, {
				type: "error",
				error : err
			})
		})
}

function sendMessage(connection, command, message) {
	connection.sendUTF(JSON.stringify({
			issuer: 'global-manager',
            message: message,
            command: command
    }));
}

function route (connection, message) {
	switch (message.command) {
		case 'get-decks':
			getDeck(connection,message);
	}
}

module.exports = {
	route
}