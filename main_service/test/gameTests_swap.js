var assert = require('chai').assert
var swapCards = require('../game_manager.js').swapCards;
var defaultGameData = require('./data/gameDataDefault').gameData;

describe('Swap Cards Test', () => {
  describe('Swapping', () => {
  	let gameData;
  	beforeEach(() => {
  		gameData = JSON.parse(JSON.stringify(defaultGameData));
  	});
    it('should swap one card', () => {	
    	let message = {
            playerId: 1,
            swaps: [2]
    	}
    	swapCards(message,gameData, () => {});
    	assert.isTrue(gameData.player1.hand[0].uid == 1);
    	assert.isTrue(gameData.player1.hand[1].id == 5);
    	assert.isTrue(gameData.player1.hand[2].uid == 3);
    	assert.isTrue(gameData.player1.swapped == 1);
        assert.isTrue(gameData.player1.deck.length == 3);
    });
    it('should swap no card', () => {
    	let message = {
            playerId: 1,
            swaps: []
    	}
    	swapCards(message,gameData, () => {});
    	assert.isTrue(gameData.player1.hand[0].uid == 1);
    	assert.isTrue(gameData.player1.hand[1].uid == 2);
    	assert.isTrue(gameData.player1.hand[2].uid == 3);
    	assert.isTrue(gameData.player1.swapped == 0);
        assert.isTrue(gameData.player1.deck.length == 3);
    });
    it('should swap all cards', () => {
    	let message = {
            playerId: 1,
            swaps: [1,2,3]
    	}
    	swapCards(message,gameData, () => {});
    	assert.isTrue(gameData.player1.hand[0].id == 5);
    	assert.isTrue(gameData.player1.hand[1].id == 5);
    	assert.isTrue(gameData.player1.hand[2].id == 5);
    	assert.isTrue(gameData.player1.swapped == 3);
        assert.isTrue(gameData.player1.deck.length == 3);
    });
    it('should fail when the user has already swapped', () => {
    	let message = {
            playerId: 1,
            swaps: [1]
    	}
    	swapCards(message,gameData, () => {});
    	message = {
          playerId: 1,
          swaps: [2,2]
      }
    	swapCards(message,gameData, (conn, err, message) => {
    		assert.isTrue('Cards already swapped please wait' == message);
    	});
    	assert.isTrue(gameData.player1.hand[0].id == 5);
    	assert.isTrue(gameData.player1.hand[1].uid == 2);
    	assert.isTrue(gameData.player1.hand[2].uid == 3);
    	assert.isTrue(gameData.player1.swapped == 1);
        assert.isTrue(gameData.player1.deck.length == 3);
    });
  });
});