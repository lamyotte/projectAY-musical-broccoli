const players = require('./database/controllers/players');
var initGame = require('./game_manager.js').initGame;

var waitList = [];

/**
 * interval function to start games 
 * @param  {array} waitList list of waiting players
 */
function matchmake() {
	if(waitList.length > 1) {
		initGame(waitList[0], waitList[1]);
		waitList.splice(0,2);
	}
}


function addWaitingPlayer(connection, message) {
	console.log("OK?")
	waitList.push({
		id: message.playerId,
		deckId: message.deckId,
		connection: connection
	});
	sendMessage(connection, "Request received wait for second player...");
	matchmake();
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
	console.log(message);
	switch (message.command) {
		case 'start-game':
			addWaitingPlayer(connection,message);
	}
}

module.exports = {
	route,
	matchmake
}