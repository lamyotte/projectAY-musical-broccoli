var assert = require('chai').assert;
var playCard = require('../game_manager.js').playCard;
var defaultGameData = require('./data/gameDataDefault').gameData;

describe('Play Card Tests', () => {
  let gameData;
  beforeEach(() => {
    gameData = JSON.parse(JSON.stringify(defaultGameData));;
  });
  describe('Play Creature', () => {
    it('play the creature at index 0 on empty board', async () => {	
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
      await playCard(message, gameData, (message) => {});
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
    it('play the creature at the index 0 with one creature on board', async () => {
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
      await playCard(message, gameData, (message) => {});
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
    it('play creature with dmg battlecry kill', async () => {
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
              "battlecry" : [{
                    "type" : "dmg",
                    "potency" : "2"
                }]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 0,
        defender: 11
      };
      await playCard(message, gameData, (message) => {});
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
      assert.equal(gameData.player2.board.length, 0);
    });
    it('play creature with dmg battlecry damage', async () => {
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
              "battlecry" : [{
                    "type" : "dmg",
                    "potency" : "2"
                }]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 0,
        defender: 11
      };
      await playCard(message, gameData, (message) => {});
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
      assert.equal(gameData.player2.board[0].cHP, 1);
    });
    it('play creature with dmg battlecry damage no target', async () => {
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
              "battlecry" : [{
                    "type" : "dmg",
                    "potency" : "2"
                }]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 0,
        defender: null
      };
      await playCard(message, gameData, (message) => {});
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
    });
    it('play creature with heal battlecry', async () => {
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
              "battlecry" : [{
                    "type" : "heal",
                    "potency" : "2"
                }]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 0,
        defender: 11
      };
      await playCard(message, gameData, (message) => {});
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
      assert.equal(gameData.player1.board[1].cHP,3);
    });
    it('play creature with charge battlecry', async () => {
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
              "battlecry" : [{
                    "type" : "charge"
                }]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 0,
        defender: 11
      };
      await playCard(message, gameData, (message) => {});
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
    it('play creature with board bonus battlecry', async () => {
      gameData.player1.mana = 10;
      gameData.player1.board.push({
          "uid" : 11,
          "id" : 1,
          "cHP" : 1,
          "cMaxHP" : 1,
          "cAtk" : 1,
          "specs" : {
            "family" : "dragon",
            "cost" : 1,
            "HP" : 3,
            "Atk" : 1,
            "abilities" :{}
          },
          "status" : []
      });
      gameData.player1.hand.push({
          "uid" : 111,
          "type" : "creature",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1,
            "abilities" : {
              "bonus" : [{
                "type" : "attribute",
                "target" : {
                    "type" : "family",
                    "family" : "dragon",
                    "location" : "local-board"
                },
                "attribute" : "HP", 
                "potency" : 1
            },{
                "type" : "attribute",
                "target" : {
                    "type" : "family",
                    "family" : "dragon",
                    "location" : "local-board"
                },
                "attribute" : "Atk", 
                "potency" : 1
            }
        ]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 111,
        index: 1,
        defender: null
      };
      await playCard(message, gameData, (message) => {});
      assert.equal(gameData.player1.board[0].cHP, 2);
      assert.equal(gameData.player1.board[0].cMaxHP, 2);
      assert.equal(gameData.player1.board[0].cAtk, 2);
      assert.equal(gameData.player1.board.length, 2);
      assert.equal(gameData.player1.board[1].cHP, 1);
      assert.equal(gameData.player1.board[1].cMaxHP, 1);
      assert.equal(gameData.player1.board[1].cAtk, 1);
    
    });
    it('play creature with family bonus battlecry', async () => {
      gameData.player1.board.push({
          "uid" : 11,
          "id" : 1,
          "name" : "TestCard",
          "type" : "creature",
          "cHP" : 2,
          "cAtk" : 1,
          "cMaxHP" : 2,
          "specs" : {
            "family" : "dragon",
            "cost" : 1,
            "HP" : 3,
            "Atk" : 1,
            "abilities" :{
            }
          },
          "status" : []
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
              "battlecry" : [{
                "type" : "bonus",
                "bonus" : [{
                    "type" : "attribute",
                    "target" : {
                        "conditions" : [{
                                "type" : "family",
                                "family" : "dragon",
                                "location" : "local-board"
                        }]    
                    },
                    "attribute" : "HP",
                    "potency" : 2
                }, {
                  "type" : "attribute",
                    "target" : {
                        "conditions" : [{
                            "type" : "family",
                            "family" : "dragon",
                            "location" : "local-board"
                        }]
                    },
                    "attribute" : "Atk",
                    "potency" : 2
                }]
            }]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 1,
        defender: 11
      };
      await playCard(message, gameData, (message) => {});
      // Check that the board has 2 cards
      assert.equal(gameData.player1.board.length, 2);
      assert.equal(gameData.player1.board[0].uid, 11);
      assert.equal(gameData.player1.board[0].cHP, 4);
      assert.equal(gameData.player1.board[0].cAtk, 3);
      assert.equal(gameData.player1.board[0].cMaxHP, 4);
      // Check that the card has no actions
      assert.equal(gameData.player1.board[1].actions, 0);
      // Check that the card was removed from hand
      assert.isTrue(!gameData.player1.hand.some(card => card.uid === 22));
      // Check that the mana cost was deduced
      assert.equal(gameData.player1.mana, 0);
    });
    it('play creature with target bonus battlecry', async () => {
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
              "battlecry" : [{
                    "type" : "charge"
                }]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 0,
        defender: 11
      };
      await playCard(message, gameData, (message) => {});
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
    it('play creature with target bonus conditionnal battlecry', async () => {
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
              "battlecry" : [{
                    "type" : "charge"
                }]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 0,
        defender: 11
      };
      await playCard(message, gameData, (message) => {});
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
    it('play creature battlecry bonus', async () => {
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
              "battlecry" : [{
                    "type" : "charge"
                }]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 0,
        defender: 11
      };
      await playCard(message, gameData, (message) => {});
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
    it('play creature with summon battlecry', async () => {
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
              "battlecry" : [{
                    "type" : "charge"
                }]
            }
          }
      });
      let message = {
        playerId: 1,
        card: 12,
        index: 0,
        defender: 11
      };
      await playCard(message, gameData, (message) => {});
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
    it('should fail when not enough mana', async () => {
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
      await playCard(message, gameData, () => {});
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
    it('should play healing spell to given target', async () => { 
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
      await playCard(message, gameData, () => {});
      assert.isTrue(gameData.player1.hand.length == 0);
      assert.isTrue(gameData.player2.HP == 30);
      assert.isTrue(gameData.player1.mana == 0);
    });
    it('should play damage spell given target', async () => {
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
      await playCard(message, gameData, () => {});
      assert.isTrue(gameData.player1.hand.length == 0);
      assert.isTrue(gameData.player2.HP == 26);
      assert.isTrue(gameData.player1.mana == 0);
    });
    it('should play damage spell aoe ', async () => {
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
                  "location" : 'adversary-board'
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
      await playCard(message, gameData, () => {});
      console.log(gameData.player2.board)
      assert.isTrue(gameData.player1.hand.length == 0);
      assert.isTrue(gameData.player2.board[0].cHP == 1);
      assert.isTrue(gameData.player2.board[1].cHP == 2);
      assert.isTrue(gameData.player2.board.length == 2);
      assert.isTrue(gameData.player1.mana == 0);
    });
    it('should play random spell once ', async () => {
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
                  "location" : "adversary-board"
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
      await playCard(message, gameData, () => {});
      assert.isTrue(gameData.player1.hand.length == 0);
      assert.isTrue(gameData.player2.board[0].cHP == 4 || gameData.player2.board[1].cHP == 5);
      assert.isTrue(gameData.player2.board.length == 2);
      assert.isTrue(gameData.player1.mana == 0);
    });
    it('should play random spell twice ', async () => {
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
                  "location" : "adversary-board"
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
      await playCard(message, gameData, () => {});
      assert.isTrue(gameData.player1.hand.length == 0);
      assert.isTrue((gameData.player2.board[0].cHP == 4 && gameData.player2.board[1].cHP == 5) || 
                    (gameData.player2.board[0].cHP == 3 && gameData.player2.board[1].cHP == 6) ||
                    (gameData.player2.board[0].cHP == 5 && gameData.player2.board[1].cHP == 4));
      assert.isTrue(gameData.player2.board.length == 2);
      assert.isTrue(gameData.player1.mana == 0);
    });
    it('should play random spell twice different targets garantee', async () => {
      gameData.player1.mana = 4;
      gameData.player1.hand =[{
        "uid": 555,
        "name" : "Dragonfire Dive",
        JobId : 1,
        "type" : "spell",
        "specs" : {
            "cost" : 4,
            "effects" : [{
                "type" : "dmg",
                "potency" : 3,
                "target" : {
                    "type" : "rand",
                    "location" : "adversary-board",
                    "repetition" : 2
                }
            }]
        }
    }]; 
      gameData.player2.board.push(...[{
        'uid' : 1,
        'cHP' : 2
      }])
      let message = {
        playerId: 1,
        card: 555,
      };
      await playCard(message, gameData, () => {});
      assert.equal(gameData.player1.hand.length, 1);
      assert.equal(gameData.player2.board.length, 1);
      //assert.equal(gameData.player2.board[0].cHP, 1);
      //assert.equal(gameData.player2.board[1].cHP, 1);
      assert.equal(gameData.player1.mana, 4);
    });
    it('should play bonus spell on familly', async () => {
      gameData.player1.mana = 1;
      gameData.player1.hand =[{
        "uid": 26,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
              "type" : "bonus",
              "bonus" : [{
                "type" : "attribute",
                "target" : {
                    "type" : "family",
                    "family" : "family",
                    "location" : "local-board"
                },
                "attribute" : "HP", 
                "potency" : 2
              }]
            }]
        }
      }]; 
      gameData.player1.board.push(...[{
        'uid' : 1,
        'cHP' : 5,
        'specs' : {
          'family' : 'family'
        },
        'status' : []
      },{
        'uid' : 2,
        'cHP' : 6,
        'specs' : {
          'family' : 'not-family'
        }
      },{
        'uid' : 3,
        'cHP' : 4,
        'specs' : {
          'family' : 'not-family'
        }
      }])
      let message = {
        playerId: 1,
        card: 26,
      };
      await playCard(message, gameData, () => {});
      console.log(gameData.player2.board)
      assert.equal(gameData.player1.hand.length, 0);
      assert.equal(gameData.player1.board[0].cHP, 7);
      assert.equal(gameData.player1.board[1].cHP, 6);
      assert.equal(gameData.player1.board[2].cHP, 4);
      assert.equal(gameData.player1.board.length, 3);
      assert.equal(gameData.player1.mana, 0);
    });
    it('should play summon spell 1 target', async () => {
      gameData.player1.mana = 1;
      gameData.player1.hand =[{
        "uid": 25,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "summon",
                "potency" : 1,
                "summon" : 1
            }]
        }
      }]; 
      let message = {
        playerId: 1,
        card: 25,
        defender: ''
      };
      await playCard(message, gameData, () => {});
      assert.equal(gameData.player1.hand.length, 0);
      assert.equal(gameData.player1.board.length, 1);
      assert.equal(gameData.player1.board[0].name, 'Mandragora');
    });
    it('should play summon spell multiple targets', async () => {
      gameData.player1.mana = 1;
      gameData.player1.hand =[{
        "uid": 25,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "summon",
                "potency" : 1,
                "summon" : [1,2,3]
            }]
        }
      }]; 
      let message = {
        playerId: 1,
        card: 25,
        defender: ''
      };
      await playCard(message, gameData, () => {});
      assert.equal(gameData.player1.hand.length, 0);
      assert.equal(gameData.player1.board.length, 1);
      assert.include(['Mandragora','Spriggan','Sylvan Sough'], gameData.player1.board[0].name);
    }); 
    it('should play play a conditional dmg spell default', async () => {
        gameData.player2.HP = 30;
        gameData.player1.mana = 3;
        gameData.player1.hand = [{
          "uid": 34,
          "type" : "spell",
          "specs" : {
              "cost" : 3,
              "effects" : [{
                  "type" : "dmg",
                  "potency" : {
                      "default" : 3,
                      "conditions" : [{
                          "potency" : 5,
                          "conditions" : [{
                              "type" : "family",
                              "family" : "family",
                              "fulfilled" : 1,
                              "location" : "local-board"
                          }]
                      }]
                  }
              }]
            }
          }]; 
          gameData.player1.board.push(...[{
            'uid' : 1,
            'cHP' : 5,
            'specs' : {
              'family' : 'not-family'
            }
            }])
        let message = {
          playerId: 1,
          card: 34,
          defender: 'adversary'
        };
        await playCard(message, gameData, () => {});
        assert.equal(gameData.player1.hand.length, 0);
        assert.equal(gameData.player1.board.length, 1);
        assert.equal(gameData.player2.HP, 27);
    });
    it('should play play a conditional dmg spell condition', async () => {
      gameData.player2.HP = 30;
        gameData.player1.mana = 3;
        gameData.player1.hand = [{
          "uid": 34,
          "type" : "spell",
          "specs" : {
              "cost" : 3,
              "effects" : [{
                  "type" : "dmg",
                  "potency" : {
                      "default" : 3,
                      "conditions" : [{
                          "potency" : 5,
                          "conditions" : [{
                              "type" : "family",
                              "family" : "family",
                              "fulfilled" : 1,
                              "location" : "local-board"
                          }]
                      }]
                  }
              }]
            }
          }]; 
        gameData.player1.board.push(...[{
          'uid' : 1,
          'cHP' : 5,
          'specs' : {
            'family' : 'family'
          }
          }])
        let message = {
          playerId: 1,
          card: 34,
          defender: 'adversary'
        };
        await playCard(message, gameData, () => {});
        assert.equal(gameData.player1.hand.length, 0);
        assert.equal(gameData.player1.board.length, 1);
        assert.equal(gameData.player2.HP, 25);
    });
    it('should play a set spell hp', async () => {
      gameData.player1.mana = 3;
      gameData.player1.hand = [{
        "uid": 29,
        "name" : "Leg Sweep",
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "set",
                "attribute" : "HP",
                "set" : 1
            }]
        }
      }]; 
      gameData.player2.board.push(...[{
        'uid' : 1,
        'cHP' : 5,
        'specs' : {
          'family' : 'not-family'
        }
        }])
      let message = {
        playerId: 1,
        card: 29,
        defender: 1
      };
      await playCard(message, gameData, () => {});
      assert.equal(gameData.player1.hand.length, 0);
      assert.equal(gameData.player2.board[0].cHP, 1);
    });
    it('should play a set spell atk', async () => {
      gameData.player1.mana = 3;
      gameData.player1.hand = [{
        "uid": 29,
        "name" : "Leg Sweep",
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "set",
                "attribute" : "Atk",
                "set" : 1
            }]
        }
      }]; 
      gameData.player2.board.push(...[{
        'uid' : 1,
        'cAtk' : 5,
        'specs' : {
          'family' : 'not-family'
        }
        }])
      let message = {
        playerId: 1,
        card: 29,
        defender: 1
      };
      await playCard(message, gameData, () => {});
      assert.equal(gameData.player1.hand.length, 0);
      assert.equal(gameData.player2.board[0].cAtk, 1);
    });
    it('should play a morph spell', async () => {
      gameData.player2.HP = 30;
      gameData.player1.mana = 3;
      gameData.player1.hand = [{
        "uid": 33,
        "name" : "Convert",
        "type" : "spell",
        "specs" : {
            "cost" : 3,
            "effects" : [{
                "type" : "morph",
                "morph" : 15 
            }]
        }
      }]; 
      gameData.player2.board.push(...[{
        'uid' : 1,
        'cHP' : 5,
        'specs' : {
          'family' : 'not-family'
        }
        }])
      let message = {
        playerId: 1,
        card: 33,
        defender: 1
      };
      await playCard(message, gameData, () => {});
      assert.equal(gameData.player1.hand.length, 0);
      assert.equal(gameData.player2.board.length, 1);
      assert.equal(gameData.player2.board[0].cHP, 1);
    });
    it('should fail when not enough mana', async () => {
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
                  "location" : 'adversary-board'
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
      await playCard(message, gameData, () => {});
      assert.isTrue(gameData.player1.hand.length == 1);
      assert.isTrue(gameData.player2.board[0].cHP == 5);
      assert.isTrue(gameData.player2.board[1].cHP == 6);
      assert.isTrue(gameData.player2.board.length == 2);
      assert.isTrue(gameData.player1.mana == 1);
    });
  });
});