const players = require('./database/controllers/players');

var waitList = [];

/**
 * interval function to start games 
 * @param  {array} waitList list of waiting players
 */
function matchmake() {
	if(waitList.length > 1) {

	}
}

function addWaitingPlayer(connection, message) {
	players.getByTag('Livvy')
		.then((res) => {
			console.log(res);
		})
}

function getPlayerInfos(id) {

}

function removeWaitingPlayer(index = null, id = null) {
	if(index != null) {

	}
	else if(id != null) {

	}
}

function sendMessage(connection, message) {
	connection.sendUTF(JSON.stringify({
			issuer: 'matchmaker',
            message: message
    }));
}
function route (connection, message) {
	switch (message.command) {
		case 'looking_to_play':
			addWaitingPlayer(connection,message);
	}
}

module.exports = {
	route,
	matchmake
}