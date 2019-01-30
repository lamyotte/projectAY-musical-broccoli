var assert = require('chai').assert;
var useHeroPower = require('../game_manager.js').useHeroPower;
var defaultGameData = require('./data/gameDataDefault').gameData;

describe('Hero power tests', () => {
  describe('Black mage', () => {
  	let gameData;
	beforeEach(() => {
		gameData = JSON.parse(JSON.stringify(defaultGameData));
		gameData.player1.job = {
			specs: {
				type: 'dmg',
				potency: 2
			}
		}
		gameData.player1.powerActions = 1;
		gameData.player1.mana = 2;
	});
    it('should damage targetted friendly creature', () => {
    	gameData.player1.board.push({
    		uid: 1,
    		cHP: 3
    	});
    	let message = { 
    		playerId: 1,
    		defender: 1
    	}
    	useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player1.board[0].cHP, 1);
    	assert.equal(gameData.player1.powerActions, 0);
    });
	it('should damage targetted ennemy creature', () => {
		gameData.player2.board.push({
    		uid: 2,
    		cHP: 3
    	});
		let message = { 
			playerId: 1,
			defender: 2
		}
		useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player2.board[0].cHP, 1);
    	assert.equal(gameData.player1.powerActions, 0);
	});
	it('should kill targetted ennemy creature', () => {
		gameData.player2.board.push({
    		uid: 2,
			cHP: 2,
			specs : {
				abilities : {}
			}
    	});
		let message = { 
			playerId: 1,
			defender: 2
		}
		useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player2.board.length, 0);
    	assert.equal(gameData.player1.powerActions, 0);
	});
	it('should damage self', () => {
		gameData.player1.HP = 30;
		let message = { 
			playerId: 1,
			defender: 'local'
		}
		useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player1.HP, 28);
    	assert.equal(gameData.player1.powerActions, 0);
	});
	it('should damage oponent', () => {
		gameData.player2.HP = 30;
		let message = { 
			playerId: 1,
			defender: 'adversary'
		}
		useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player2.HP, 28);
    	assert.equal(gameData.player1.powerActions, 0);
	});
	it('should fail to use twice', () => {
		gameData.player2.HP = 30;
		let message = { 
			playerId: 1,
			defender: 'adversary'
		}
		useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player2.HP, 28);
    	assert.equal(gameData.player1.powerActions, 0);
    	useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player2.HP, 28);
    	assert.equal(gameData.player1.powerActions, 0);
	});
  });
  describe('Dragoon', () => {
  	let gameData;
	beforeEach(() => {
		gameData = JSON.parse(JSON.stringify(defaultGameData));
		gameData.player1.job = {
			specs: {
				type: 'dmg',
				potency: 2,
				target: "adversary"
			}
		}
		gameData.player1.powerActions = 1;
		gameData.player1.mana = 2;
	});
    it('should damage oponent', () => {
    	gameData.player2.HP = 30;
		let message = { 
			playerId: 1
		}
		useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player2.HP, 28);
    	assert.equal(gameData.player1.powerActions, 0);
    });
    it('should ignore damage to creature and damage face instead', () => {
    	gameData.player2.HP = 30;
    	gameData.player2.board.push({
    		uid: 2,
    		cHP: 3
    	});
		let message = { 
			playerId: 1,
			defender: 2
		}
		useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player2.HP, 28);
    	assert.equal(gameData.player2.board[0].cHP, 3);
    	assert.equal(gameData.player1.powerActions, 0);
    });
  });
  describe('White mage', () => {
  	let gameData;
	beforeEach(() => {
		gameData = JSON.parse(JSON.stringify(defaultGameData));
		gameData.player1.job = {
			specs: {
				type: 'heal',
				potency: 2
			}
		}
		gameData.player1.powerActions = 1;
		gameData.player1.mana = 2;
	});
    it('should heal targetted friendly creature', () => {
    	gameData.player1.board.push({
    		uid: 1,
    		cHP: 1,
    		specs: {
    			HP: 4
    		}
    	});
    	let message = { 
    		playerId: 1,
    		defender: 1
    	}
    	useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player1.board[0].cHP, 3);
    	assert.equal(gameData.player1.powerActions, 0);
    });
	it('should heal targetted ennemy creature', () => {
		gameData.player2.board.push({
    		uid: 2,
    		cHP: 1,
    		specs: {
    			HP: 2
    		}
    	});
		let message = { 
			playerId: 1,
			defender: 2
		}
		useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player2.board[0].cHP, 2);
    	assert.equal(gameData.player1.powerActions, 0);
	});
	it('should heal self', () => {
		gameData.player1.HP = 28;
		let message = { 
			playerId: 1,
			defender: 'local'
		}
		useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player1.HP, 30);
    	assert.equal(gameData.player1.powerActions, 0);
	});
	it('should heal oponent', () => {
		gameData.player2.HP = 24;
		let message = { 
			playerId: 1,
			defender: 'adversary'
		}
		useHeroPower(message, gameData, (message) => {console.log(message)});
    	assert.equal(gameData.player2.HP, 26);
    	assert.equal(gameData.player1.powerActions, 0);
	});
  });
});