var assert = require('chai').assert;
var attack = require('../game_manager.js').attack;
var defaultGameData = require('./data/gameDataDefault').gameData;

describe('Attack tests', () => {
  describe('Attacking', () => {
  	let gameData;
	beforeEach(() => {
		gameData = JSON.parse(JSON.stringify(defaultGameData));
		 gameData.player2.board.push({
          "uid" : 12,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 1,
          "cAtk" : 2,
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" :{
            }
          }
	     });
	     gameData.player1.board.push({
	      "uid" : 13,
	      "name" : "TestCard",
	      "type" : "creature",
	      "cHP" : 1,
          "cAtk" : 1,
          "actions": 1,
	      "specs" : {
	        "cost" : 1,
	        "HP" : 1,
	        "Atk" : 1,
	        "abilities" :{
	        }
	      }
	  	});
	});
    it('should kill defender', () => {
    	gameData.player1.board[0].cAtk = 999;
      gameData.player1.board[0].cHP = 999;
      gameData.player2.board[0].cAtk = 1;
	    let message = {
        playerId: 1,
        defender: 12,
        attacker: 13
    	};
    	attack(message, gameData, (message) => {});
    	assert.isTrue(gameData.player2.board.length == 0);
    	assert.isTrue(gameData.player1.board.length == 1);
    	assert.isTrue(gameData.player1.board[0].cHP == 998);
    	assert.isTrue(gameData.player1.board[0].actions == 0);

    });
    it('should kill attacker', () => {
    	gameData.player1.board[0].cHP = 1;
    	gameData.player1.board[0].cAtk = 1;
    	gameData.player2.board[0].cHP = 999;
    	gameData.player2.board[0].cAtk = 999;
	    let message = {
	        playerId: 1,
	        defender: 12,
	        attacker: 13
      	};
      	attack(message, gameData, (message) => {});
      	assert.isTrue(gameData.player2.board.length == 1);
      	assert.isTrue(gameData.player1.board.length == 0);
      	assert.isTrue(gameData.player2.board[0].cHP == 998);
    });
    it('should damage defender and attacker', () => {
    	gameData.player1.board[0].cHP = 2;
    	gameData.player1.board[0].cAtk = 1;
    	gameData.player2.board[0].cHP = 2;
    	gameData.player2.board[0].cAtk = 1;
	    let message = {
	        playerId: 1,
	        defender: 12,
	        attacker: 13
      	};
      	attack(message, gameData, (message) => {});
      	assert.isTrue(gameData.player2.board.length == 1);
      	assert.isTrue(gameData.player1.board.length == 1);
      	assert.isTrue(gameData.player2.board[0].cHP == 1);
      	assert.isTrue(gameData.player2.board[0].cHP == 1);
      	assert.isTrue(gameData.player1.board[0].actions == 0);
    });
    it('should attack face', () => {
  		gameData.player1.board[0].cAtk = 1;
	    let message = {
	        playerId: 1,
	        defender: -1,
	        attacker: 13
      	};
      	attack(message, gameData, (message) => {});
      	assert.isTrue(gameData.player2.board.length == 1);
      	assert.isTrue(gameData.player1.board.length == 1);
      	assert.isTrue(gameData.player2.HP == 29);
      	assert.isTrue(gameData.player1.board[0].actions == 0);
    });
    it('should kill face', () => {		
	    gameData.player1.board[0].cAtk = 999;
	    let message = {
	        playerId: 1,
	        defender: -1,
	        attacker: 13
      	};
      	attack(message, gameData, (message) => {});
      	assert.isTrue(gameData.player2.board.length == 1);
      	assert.isTrue(gameData.player1.board.length == 1);
      	assert.isTrue(gameData.player1.board[0].actions == 0);
      	assert.isTrue(gameData.player2.HP <= 0);
      	assert.isTrue(gameData.status == 3);
    });
    it('should fail to attack creature with blocking taunt', () => {
    	gameData.player1.board[0].cHP = 2;
    	gameData.player1.board[0].cAtk = 999;
    	gameData.player2.board[0].cHP = 1;
    	gameData.player2.board[0].cAtk = 1;
    	gameData.player2.board.push({
          "uid" : 14,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 1,
          "cAtk" : 2,
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" : {
            	"taunt" : ""
        	}}
	    });
	    let message = {
	        playerId: 1,
	        defender: 12,
	        attacker: 13
      	};
      	attack(message, gameData, (message) => {});
      	assert.isTrue(gameData.player2.board.length == 2);
      	assert.isTrue(gameData.player1.board.length == 1);
      	assert.isTrue(gameData.player1.board[0].actions == 1);
      	assert.isTrue(gameData.player2.board[0].cHP == 1);

    });
    it('should fail to attack face with blocking taunt', () => {
    	gameData.player2.board.push({
          "uid" : 14,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 1,
          "cAtk" : 2,
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" : {
            	"taunt" : ""
        	}}
	    });
	    let message = {
	        playerId: 1,
	        defender: -1,
	        attacker: 13
      	};
      	attack(message, gameData, (message) => {});
      	assert.isTrue(gameData.player2.board.length == 2);
      	assert.isTrue(gameData.player1.board.length == 1);
      	assert.isTrue(gameData.player1.board[0].actions == 1);
      	assert.isTrue(gameData.player2.HP == 30);
    });
    it('should attack a taunt creature when another taunt is present', () => {
    	gameData.player1.board[0].cHP = 2;
    	gameData.player1.board[0].cAtk = 1;
    	gameData.player2.board[0].cHP = 1;
    	gameData.player2.board[0].cAtk = 1;
    	gameData.player2.board.push({
          "uid" : 14,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 2,
          "cAtk" : 1,
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" : {
            	"taunt" : ""
        	}}
	    });
	    gameData.player2.board.push({
          "uid" : 15,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 2,
          "cAtk" : 1,
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" : {
            	"taunt" : ""
        	}}
	    });
	    let message = {
	        playerId: 1,
	        defender: 14,
	        attacker: 13
      	};
      	attack(message, gameData, (message) => {});
      	assert.isTrue(gameData.player2.board.length == 3);
      	assert.isTrue(gameData.player1.board.length == 1);
      	assert.isTrue(gameData.player1.board[0].actions == 0);
      	assert.isTrue(gameData.player1.board[0].cHP == 1);
      	assert.isTrue(gameData.player2.board[1].cHP == 1);

    });
    it('should fail to attack twice with the same creature', () => {
      	gameData.player1.board[0].cHP = 2;
		gameData.player1.board[0].cAtk = 1;
		gameData.player2.board[0].cHP = 2;
		gameData.player2.board[0].cAtk = 1;
		let message = {
	        playerId: 1,
	        defender: 12,
	        attacker: 13
      	};
		attack(message, gameData, (message) => {});
		attack(message, gameData, (message) => {});
		assert.isTrue(gameData.player2.board.length == 1);
      	assert.isTrue(gameData.player1.board.length == 1);
      	assert.isTrue(gameData.player2.board[0].cHP == 1);
      	assert.isTrue(gameData.player1.board[0].cHP == 1);
      	assert.isTrue(gameData.player1.board[0].actions == 0);
    });
    it('should fail to attack friendly creature', () => {
    	gameData.player1.board[0].cHP = 2;
		gameData.player1.board[0].cAtk = 1;
      	gameData.player1.board.push({
          "uid" : 14,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 2,
          "cAtk" : 1,
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" : {
            	"taunt" : ""
        	}}
	    });
	    let message = {
	        playerId: 1,
	        defender: 14,
	        attacker: 13
      	};
		attack(message, gameData, (message) => {});
		assert.isTrue(gameData.player2.board.length == 1);
      	assert.isTrue(gameData.player1.board.length == 2);
      	assert.isTrue(gameData.player1.board[1].cHP == 2);
      	assert.isTrue(gameData.player1.board[0].cHP == 2);
      	assert.isTrue(gameData.player1.board[0].actions == 1);
    }); 
    it('should fail to attack when its not the players turn', () => {
      	gameData.player1.board[0].cHP = 2;
		gameData.player1.board[0].cAtk = 1;
		gameData.player2.board[0].cHP = 2;
		gameData.player2.board[0].cAtk = 1;
		let message = {
	        playerId: 2,
	        defender: 13,
	        attacker: 12
      	};
      	attack(message, gameData, (message) => {});
		assert.isTrue(gameData.player2.board.length == 1);
      	assert.isTrue(gameData.player1.board.length == 1);
      	assert.isTrue(gameData.player2.board[0].cHP == 2);
      	assert.isTrue(gameData.player1.board[0].cHP == 2);
    });
     it('should fail to attack with an oponents creature', () => {
      	gameData.player1.board[0].cHP = 2;
		gameData.player1.board[0].cAtk = 1;
		gameData.player2.board[0].cHP = 2;
		gameData.player2.board[0].cAtk = 1;
		let message = {
	        playerId: 1,
	        defender: 12,
	        attacker: 13
      	};
      	assert.isTrue(gameData.player2.board.length == 1);
      	assert.isTrue(gameData.player1.board.length == 1);
      	assert.isTrue(gameData.player2.board[0].cHP == 2);
      	assert.isTrue(gameData.player1.board[0].cHP == 2);
    });
  });
});