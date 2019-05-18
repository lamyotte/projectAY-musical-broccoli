const Connection = require('../database/controllers/connections');

function signin(username, password) {
	return players.getByTag(username)
		.then((res) => {
			return res
		})
		.catch((err) => {
			return err
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
