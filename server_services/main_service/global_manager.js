const players = require('./database/controllers/players');
const decks = require('./database/controllers/decks');

function getDeck(connection, message) {
	decks.getByPlayer(message.playerId)
		.then((res) => {
			sendMessage(connection, res);
		})
		.catch((err) => {
			console.log(err);
			sendMessage(connection, {
				type: "error",
				error : err
			})
		})
}

function sendMessage(connection, message) {
	connection.sendUTF(JSON.stringify({
			issuer: 'global-manager',
            message: message
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