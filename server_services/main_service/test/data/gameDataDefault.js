var gameData = {
  "player1": {
      "id": 1,
      "tag": "Livvy",
      "job": {},
      "HP" : 30,
      "battlecries" : [],
      "hand": [{
          "id" : 1,
          "uid" : 1,
          "name" : "name",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1
          }
        }, {
          "id" : 2,
          "uid" : 2,
          "name" : "name",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1
          }
        }, {
          "id" : 2,
          "uid" : 3,
          "name" : "name",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1
          }
        }],
      "manapool": 0,
      "mana": 1,
      "deck": [{
          "id" : 5,
          "uid" : 4,
          "name" : "name",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1
          }
        }, {
          "id" : 5,
          "uid" : 5,
          "name" : "name",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1
          }
        }, {
          "id" : 5,
          "uid" : 6,
          "name" : "name",
          "specs" : {
            "cost" : 1,
            "HP" : 1,
            "Atk" : 1
          }
        }],
      "graveward": [],
      "deckid": 1,
      "board": [],
      "weapon": {}
  },
  "player2": {
      "id": 2,
      "tag": "Phil714",
      "job": {},
      "HP" : 30,
      "battlecries" : [],
      "hand": [],
      "manapool": 0,
      "mana": 0,
      "deck": [],
      "graveward": [],
      "deckid": 2,
      "board": [],
      "weapon": {}
    },
    playing : 'player1',
    nextID : 888
  }

module.exports = {
  gameData
}