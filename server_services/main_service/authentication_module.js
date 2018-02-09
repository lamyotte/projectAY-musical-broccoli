const players = require('./database/controllers/players');

function connect(connection, message) {
	players.getByTag(message.tag)
		.then((res) => {
			sendMessage(connection, res);
		})
		.catch((err) => {
			sendMessage(connection, {
				type: "error",
				error : err
			})
		})
}

function sendMessage(connection, message) {
	connection.sendUTF(JSON.stringify({
			issuer: 'authenticator',
            message: message
    }));
}

function route (connection, message) {
	switch (message.command) {
		case 'connect':
			connect(connection,message);
	}
}

module.exports = {
	route
}