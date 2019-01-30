var assert = require('chai').assert;
var endTurn = require('../game_manager.js').endTurn;
var defaultGameData = require('./data/gameDataDefault').gameData;

describe('EndTurn tests', () => {
  describe('EndTurn', () => {
  	let gameData;
	beforeEach(() => {
		gameData = JSON.parse(JSON.stringify(defaultGameData));
	});
    it('should end turn on empty boards no mana', () => {
    	let message = { 
    		playerId: 1
    	}
    	endTurn(message, gameData, (message) => {console.log(message)});
    	assert.isTrue(gameData.playing == 'player2');
    	assert.isTrue(gameData.player2.powerActions == 1);
    	assert.isTrue(gameData.player2.mana == 1);
    	assert.isTrue(gameData.player2.manapool == 1);
    });
	it('should end turn on empty boards max mana', () => {
		gameData.player2.manapool = 10;
		let message = { 
			playerId: 1
		}
		endTurn(message, gameData, (message) => {console.log(message)});
		assert.isTrue(gameData.playing == 'player2');
    	assert.isTrue(gameData.player2.powerActions == 1);
		assert.isTrue(gameData.player2.mana == 10);
		assert.isTrue(gameData.player2.manapool == 10);
	});
	it('should end turn with creatures on board', () => {
		gameData.player2.board.push({
			uid: '12',
			actions: 0
		})
		let message = { 
			playerId: 1
		}
		endTurn(message, gameData, (message) => {console.log(message)});
		assert.isTrue(gameData.playing == 'player2');
    	assert.isTrue(gameData.player2.board[0].actions == 1);
    	assert.isTrue(gameData.player2.mana == 1);
    	assert.isTrue(gameData.player2.powerActions == 1);
    	assert.isTrue(gameData.player2.manapool == 1);
	});
	it('should end turn with end turn special', () => {
		gameData.player2.board.push({
			uid: '12',
			actions: 0
		})
		let message = { 
			playerId: 1
		}
		endTurn(message, gameData, (message) => {console.log(message)});
		assert.isTrue(gameData.playing == 'player2');
    	assert.isTrue(gameData.player2.board[0].actions == 1);
    	assert.isTrue(gameData.player2.mana == 1);
    	assert.isTrue(gameData.player2.powerActions == 1);
    	assert.isTrue(gameData.player2.manapool == 1);
	});
  });
});