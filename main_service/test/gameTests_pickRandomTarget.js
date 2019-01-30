var assert = require('chai').assert;
var pickRandomTarget = require('../game_manager.js').pickRandomTarget;
var defaultGameData = require('./data/gameDataDefault').gameData;

describe('PickRandomTarget tests', () => {
  describe('PickRandomTarget', () => {
  	let gameData;
	beforeEach(() => {
		gameData = JSON.parse(JSON.stringify(defaultGameData));
	});
    it('should pick random target', () => {
    	gameData.player1.board.push({
			uid: '12',
			actions: 0
		})
		gameData.player2.board.push({
			uid: '11',
			actions: 0
		})
    	let target = pickRandomTarget(gameData, undefined);
		console.log(target);
		if (target.hasOwnProperty('id')) 
    		assert.isTrue(target.id == 1 || target.id == 2);
    	else 
    		assert.isTrue(target.board[target.index].uid == '11' || target.board[target.index].uid == '12');
    });
	it('should pick random target on oponent board', () => {
		gameData.player1.board.push({
			uid: '12',
			actions: 0
		})
		gameData.player2.board.push({
			uid: '11',
			actions: 0
		})
    	let target = pickRandomTarget(gameData, "adversary-board");
    	console.log(target);
    	assert.isTrue(target.board[target.index].uid == '11');
	});
	it('should pick random target on local board', () => {
		gameData.player1.board.push({
			uid: '12',
			actions: 0
		})
		gameData.player2.board.push({
			uid: '11',
			actions: 0
		})
    	let target = pickRandomTarget(gameData, "local-board");
    	console.log(target);
    	assert.isTrue(target.board[target.index].uid == '12')
	});
  });
});