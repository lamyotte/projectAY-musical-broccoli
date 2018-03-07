var assert = require('chai').assert;
var playCard = require('../game_manager.js').playCard;
var defaultGameData = require('./data/gameDataDefault').gameData;

describe('Play Card Tests', () => {
  let gameData;
  beforeEach(() => {
    gameData = JSON.parse(JSON.stringify(defaultGameData));;
  });
  describe('Play Creature', () => {
    it('play the creature at index 0 on empty board', () => {	
      gameData.player1.hand.push({
          "uid" : 11,
          "name" : "TestCard",
          "type" : "creature",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" :{
            }
          }
      });
      let message = {
        playerId: 1,
        card: 11,
        index: 0
      };
      playCard(message, gameData, (message) => {console.log(message)});
      // Check that the board is not empty anymore
      assert.isTrue(gameData.player1.board.length == 1);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].id, 11);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 0);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.id === 11));
      // Check that the mana cost was deduced
      assert.equal(gameData.player1.mana, 0);
    });
    it('play the creature at the index 0 with one creature on board', () => {
      gameData.player1.board.push({
          "uid" : 11,
          "name" : "TestCard",
          "type" : "creature",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" :{
            }
          }
      });
      gameData.player1.hand.push({
          "uid" : 22,
          "name" : "TestCard",
          "type" : "creature",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" :{
            }
          }
      });
      let message = {
        playerId: 1,
        card: 22,
        index: 0
      };
      playCard(message, gameData, (message) => {console.log(message)});
      // Check that the board has 2 cards
      assert.isTrue(gameData.player1.board.length == 2);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].id, 22);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 0);
      // Check that the other card was moved
      assert.equal(gameData.player1.board[1].id, 11);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.id === 22));
      // Check that the mana cost was deduced
      assert.equal(gameData.player1.mana, 0);
    });
    it('play creature with dmg battlecry kill', () => {
      gameData.player2.board.push({
          "uid" : 11,
          "id" : 1,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 1,
          "cAtk" : 1,
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" :{
            }
          }
      });
      gameData.player1.hand.push({
          "uid" : 12,
          "id" : 1,
          "name" : "TestCard",
          "type" : "creature",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" :{
              "battlecry" : {
                    "type" : "heal",
                    "potency" : "2"
                }
            }
          }
      });
      let message = {
        playerId: 1,
        card: 22,
        index: 0,
        target: 11
      };
      playCard(message, gameData, (message) => {console.log(message)});
      // Check that the board has 2 cards
      assert.isTrue(gameData.player1.board.length == 2);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].uid, 12);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 0);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.id === 22));
      // Check that the mana cost was deduced
      assert.equal(gameData.player1.mana, 0);
      // Check that the target card died
      assert.isTrue(gameData.player2.board.length == 0);
    });
    it('play creature with dmg battlecry damage', () => {
      gameData.player2.board.push({
          "uid" : 11,
          "id" : 1,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 3,
          "cAtk" : 1,
          "specs" : {
            "cost" : 1,
            "HP" : 3,
            "Atk" : 1,
            "abilities" :{
            }
          }
      });
      gameData.player1.hand.push({
          "uid" : 12,
          "id" : 1,
          "name" : "TestCard",
          "type" : "creature",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" : {
              "battlecry" : {
                    "type" : "dmg",
                    "potency" : "2"
                }
            }
          }
      });
      let message = {
        playerId: 1,
        card: 22,
        index: 0,
        target: 11
      };
      playCard(message, gameData, (message) => {console.log(message)});
      // Check that the board has 2 cards
      assert.isTrue(gameData.player1.board.length == 2);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].uid, 12);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 0);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.id === 22));
      // Check that the mana cost was deduced
      assert.equal(gameData.player1.mana, 0);
      // Check that the target card is still there
      assert.isTrue(gameData.player2.board.length == 1);
      // Check that the target card is missing hp
      assert.isTrue(gameData.player2.board[0].HP == 1);
    });
    it('play creature with heal battlecry', () => {
      gameData.player1.board.push({
          "uid" : 11,
          "id" : 1,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 2,
          "cAtk" : 1,
          "specs" : {
            "cost" : 1,
            "HP" : 3,
            "Atk" : 1,
            "abilities" :{
            }
          }
      });
      gameData.player1.hand.push({
          "uid" : 12,
          "id" : 1,
          "name" : "TestCard",
          "type" : "creature",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" : {
              "battlecry" : {
                    "type" : "heal",
                    "potency" : "2"
                }
            }
          }
      });
      let message = {
        playerId: 1,
        card: 22,
        index: 0,
        target: 11
      };
      playCard(message, gameData, (message) => {console.log(message)});
      // Check that the board has 2 cards
      assert.isTrue(gameData.player1.board.length == 2);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].uid, 12);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 0);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.id === 22));
      // Check that the mana cost was deduced
      assert.equal(gameData.player1.mana, 0);
      // Check that the target card has healed to max hp
      assert.isTrue(gameData.player1.board[1].cHP == 3);
    });
    it('play creature with charge battlecry', () => {
      gameData.player1.board.push({
          "uid" : 11,
          "id" : 1,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 2,
          "cAtk" : 1,
          "specs" : {
            "cost" : 1,
            "HP" : 3,
            "Atk" : 1,
            "abilities" :{
            }
          }
      });
      gameData.player1.hand.push({
          "uid" : 12,
          "id" : 1,
          "name" : "TestCard",
          "type" : "creature",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" : {
              "battlecry" : {
                    "type" : "charge"
                }
            }
          }
      });
      let message = {
        playerId: 1,
        card: 22,
        index: 0,
        target: 11
      };
      playCard(message, gameData, (message) => {console.log(message)});
      // Check that the board has 2 cards
      assert.isTrue(gameData.player1.board.length == 2);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].uid, 12);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 1);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.id === 22));
      // Check that the mana cost was deduced
      assert.equal(gameData.player1.mana, 0);
    });
    it('should fail when not enough mana', () => {
      gameData.player1.hand.push({
          "uid" : 11,
          "name" : "TestCard",
          "type" : "creature",
          "specs" : {
            "cost" : 99,
            "HP" : 1,
            "Atk" : 1,
            "abilities" :{
            }
          }
      });
      let message = {
        playerId: 1,
        card: 11,
        index: 0
      };
      // Creature was not placed on board
      assert.isTrue(gameData.player1.board.length == 0);
      // Cost was NOT deduced
      assert.isTrue(gameData.player1.mana == 1);
      // Card still in hand 
      assert.isTrue(gameData.player1.hand[3].uid == 11);
    });
  });
  describe('Play Weapon', () => {
    it('should place weapon in empty hand', () => { 
      // TO DO 
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should replace weapon in busy hand', () => {
      // TO DO
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should replace weapon in busy hand with death rattle', () => {
      // TO DO
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should fail when not enough mana', () => {
      // TO DO
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
  describe('Play Spell', () => {
    it('should play healing spell', () => {  
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should play damage spell', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should play bonus spell', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it('should fail when not enough mana', () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});