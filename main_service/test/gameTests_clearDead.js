var assert = require('chai').assert;
var clearDead = require('../game_manager.js').clearDead;
var defaultGameData = require('./data/gameDataDefault').gameData;

describe('Clear dead Tests', () => {
  let gameData;
  beforeEach(() => {
    gameData = JSON.parse(JSON.stringify(defaultGameData));;
  });
  describe('Clear dead', () => {
    it('destroys creature giving bonus full hp', async () => {	
      gameData.player1.board = [
        {
          uid : 1,
          cAtk : 2,
          cHP : 2,
          cMaxHP : 2,
          specs : { 
            abilities : {}
          },
          status : {
            11 : [{
              "type" : "bonus",
              "potency" : 1,
              "attribute" : "HP"
            }, {
              "type" : "bonus",
              "potency" : 1,
              "attribute" : "Atk"
            }
            ]
          }
      }, {
        uid : 11,
        cHP : 0,
        specs : {
          abilities : {
            "bonus" : {}
          }
        },
        status : {}
      }]
      clearDead(gameData, { 
        index : 1,
        board : gameData.player1.board
      }, (message) => {});
      assert.equal(gameData.player1.board.length, 1);
      assert.equal(gameData.player1.board[0].cHP, 1);
      assert.equal(gameData.player1.board[0].cMaxHP, 1);
      assert.equal(gameData.player1.board[0].cAtk, 1);
     
    });
    it('destroys creature giving bonus missing hp', async () => {	
      gameData.player1.board = [
        {
          uid : 1,
          cAtk : 2,
          cHP : 2,
          cMaxHP : 5,
          specs : {
            abilities : {},
          },
          status : {
            11 : [{
              "type" : "bonus",
              "potency" : 1,
              "attribute" : "HP"
            }, {
              "type" : "bonus",
              "potency" : 1,
              "attribute" : "Atk"
            }
            ]
          }
      }, {
        uid : 11,
        cHP : 0,
        specs : {
          abilities : {
           "bonus" : {}
          }
        },
        status : {}
      }]
      clearDead(gameData, { 
        index : 1,
        board : gameData.player1.board
      }, (message) => {});
      assert.equal(gameData.player1.board.length, 1);
      assert.equal(gameData.player1.board[0].cHP, 2);
      assert.equal(gameData.player1.board[0].cMaxHP, 4);
      assert.equal(gameData.player1.board[0].cAtk, 1);
     
    });
  });
});