const players = require('../database/controllers/players');
const connections = require('../database/controllers/connections');

function signin(username, password) {
	return players.getByTagPassword(username, password)
		.then((player) => {
			if (player.hasOwnProperty('id'))
				return connections.create(player.id)
			else 
				return Promise.reject('Invalid Login')
		})
		.then((connection) => {
			return connection.token;
		})
		.catch((err) => {
			console.log(err)
			return "An error has occured"
		})
}

function getProfile(id) {
	return players.getById(id)
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err
		})
}



module.exports = {
	signin,
	getProfile
}
