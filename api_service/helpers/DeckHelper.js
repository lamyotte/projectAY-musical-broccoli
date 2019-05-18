const players = require('../database/controllers/players');
const decks = require('../database/controllers/decks');

function getDecks(message) {
	return decks.getByPlayerDecksOnly(message.user)
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err
		})
}

module.exports = {
	getDecks
}
