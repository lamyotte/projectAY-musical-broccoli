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
      playCard(message, gameData, (message) => {});
      // Check that the board is not empty anymore
      assert.isTrue(gameData.player1.board.length == 1);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].uid, 11);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 0);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.uid === 11));
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
      playCard(message, gameData, (message) => {});
      // Check that the board has 2 cards
      assert.isTrue(gameData.player1.board.length == 2);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].uid, 22);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 0);
      // Check that the other card was moved
      assert.equal(gameData.player1.board[1].uid, 11);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.uid === 22));
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
                    "type" : "dmg",
                    "potency" : "2"
                }
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 0,
        defender: 11
      };
      playCard(message, gameData, (message) => {});
      // Check that the board has 2 cards
      assert.isTrue(gameData.player1.board.length == 1);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].uid, 12);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 0);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.uid === 22));
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
        card: 12,
        index: 0,
        defender: 11
      };
      playCard(message, gameData, (message) => {});
      // Check that the board has 2 cards
      assert.isTrue(gameData.player1.board.length == 1);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].uid, 12);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 0);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.uid === 22));
      // Check that the mana cost was deduced
      assert.equal(gameData.player1.mana, 0);
      // Check that the target card is still there
      assert.isTrue(gameData.player2.board.length == 1);
      // Check that the target card is missing hp
      assert.isTrue(gameData.player2.board[0].cHP == 1);
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
        card: 12,
        index: 0,
        defender: 11
      };
      playCard(message, gameData, (message) => {});
      // Check that the board has 2 cards
      assert.isTrue(gameData.player1.board.length == 2);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].uid, 12);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 0);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.uid === 22));
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
        card: 12,
        index: 0,
        defender: 11
      };
      playCard(message, gameData, (message) => {});
      // Check that the board has 2 cards
      assert.isTrue(gameData.player1.board.length == 2);
      // Check that the card was placed
      assert.equal(gameData.player1.board[0].uid, 12);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[0].actions, 1);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.uid === 22));
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
      playCard(message, gameData, () => {});
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
    it('should play healing spell to given target', () => { 
      gameData.player2.HP = 26;
      gameData.player1.mana = 1;
      gameData.player1.hand =[{
        "uid": 25,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "heal",
                "potency" : 4
            }]
        }
      }]; 
      let message = {
        playerId: 1,
        card: 25,
        defender: 'adversary'
      };
      playCard(message, gameData, () => {});
      assert.isTrue(gameData.player1.hand.length == 0);
      assert.isTrue(gameData.player2.HP == 30);
      assert.isTrue(gameData.player1.mana == 0);
    });
    it('should play damage spell given target', () => {
      gameData.player2.HP = 30;
      gameData.player1.mana = 1;
      gameData.player1.hand =[{
        "uid": 25,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "dmg",
                "potency" : 4
            }]
        }
      }]; 
      let message = {
        playerId: 1,
        card: 25,
        defender: 'adversary'
      };
      playCard(message, gameData, () => {});
      assert.isTrue(gameData.player1.hand.length == 0);
      assert.isTrue(gameData.player2.HP == 26);
      assert.isTrue(gameData.player1.mana == 0);
    });
    it('should play damage spell aoe ', () => {
      gameData.player1.mana = 1;
      gameData.player1.hand =[{
        "uid": 25,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "dmg",
                "potency" : 4,
                "target" : {
                  "type" : "aoe",
                  "target" : 'adversary-board'
                }
            }]
        }
      }]; 
      gameData.player2.board.push(...[{
        'uid' : 1,
        'cHP' : 5
      },{
        'uid' : 2,
        'cHP' : 6
      },{
        'uid' : 3,
        'cHP' : 4
      }])
      let message = {
        playerId: 1,
        card: 25,
      };
      playCard(message, gameData, () => {});
      console.log(gameData.player2.board)
      assert.isTrue(gameData.player1.hand.length == 0);
      assert.isTrue(gameData.player2.board[0].cHP == 1);
      assert.isTrue(gameData.player2.board[1].cHP == 2);
      assert.isTrue(gameData.player2.board.length == 2);
      assert.isTrue(gameData.player1.mana == 0);
    });
    it('should play random spell once ', () => {
      gameData.player1.mana = 1;
      gameData.player1.hand =[{
        "uid": 25,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "dmg",
                "potency" : 1,
                "target" : {
                  "type" : "rand",
                  "target" : "adversary-board"
                }
            }]
        }
      }]; 
      gameData.player2.board.push(...[{
        'uid' : 1,
        'cHP' : 5
      },{
        'uid' : 2,
        'cHP' : 6
      }])
      let message = {
        playerId: 1,
        card: 25,
      };
      playCard(message, gameData, () => {});
      assert.isTrue(gameData.player1.hand.length == 0);
      assert.isTrue(gameData.player2.board[0].cHP == 4 || gameData.player2.board[1].cHP == 5);
      assert.isTrue(gameData.player2.board.length == 2);
      assert.isTrue(gameData.player1.mana == 0);
    });
    it('should play random spell twice ', () => {
      gameData.player1.mana = 1;
      gameData.player1.hand =[{
        "uid": 25,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "dmg",
                "potency" : 1,
                "target" : {
                  "type" : "rand",
                  "target" : "adversary-board"
                },
                "repetition" : 2
            }]
        }
      }]; 
      gameData.player2.board.push(...[{
        'uid' : 1,
        'cHP' : 5
      },{
        'uid' : 2,
        'cHP' : 6
      }])
      let message = {
        playerId: 1,
        card: 25,
      };
      playCard(message, gameData, () => {});
      assert.isTrue(gameData.player1.hand.length == 0);
      assert.isTrue((gameData.player2.board[0].cHP == 4 && gameData.player2.board[1].cHP == 5) || 
                    (gameData.player2.board[0].cHP == 3 && gameData.player2.board[1].cHP == 6) ||
                    (gameData.player2.board[0].cHP == 5 && gameData.player2.board[1].cHP == 4));
      assert.isTrue(gameData.player2.board.length == 2);
      assert.isTrue(gameData.player1.mana == 0);
    });
    it('should play bonus spell', () => {
      assert.equal([1,2,3].indexOf(4), 0);
    });
    it('should fail when not enough mana', () => {
      gameData.player1.mana = 1;
      gameData.player1.hand =[{
        "uid": 25,
        "type" : "spell",
        "specs" : {
            "cost" : 2,
            "effects" : [{
                "type" : "dmg",
                "potency" : 4,
                "target" : {
                  "type" : "aoe",
                  "target" : 'adversary-board'
                }
            }]
        }
      }]; 
      gameData.player2.board.push(...[{
        'uid' : 1,
        'cHP' : 5
      },{
        'uid' : 2,
        'cHP' : 6
      }])
      let message = {
        playerId: 1,
        card: 25,
      };
      playCard(message, gameData, () => {});
      assert.isTrue(gameData.player1.hand.length == 1);
      assert.isTrue(gameData.player2.board[0].cHP == 5);
      assert.isTrue(gameData.player2.board[1].cHP == 6);
      assert.isTrue(gameData.player2.board.length == 2);
      assert.isTrue(gameData.player1.mana == 1);
    });
  });
});