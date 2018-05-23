const cards = [
    {
        "id": 20,
        "name" : "Ice Sprite",
        JobId : 2,
        "type" : "creature",
        "specs" : {
            "family" : 'aetherials',
            "HP" : 6,
            "Atk" : 3,
            "cost" : 4,
            "abilities" : {
            }
        }
    },
    {
        "id": 21,
        "name" : "Thunder II",
         JobId : 2,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [ {
                "type" : "dmg",
                "potency" : 1,
                "target" : {
                    "type": 'rand',
                    "location": "adversary"
                },
                "repetition" : 3
            }]
        }
    }, 
    {
        "id": 22,
        "name" : "Blizzard I",
         JobId : 2,
        "type" : "spell",
        "specs" : {
            "cost" : 2,
            "effects" : [{
                "type" : "dmg",
                "potency" : 3
            }]
        }
    },
    {
        "id": 23,
        "name" : "Sharpcast",
         JobId : 2,
        "type" : "spell",
        "specs" : {
            "cost" : 3,
            "effects" : [ {
                "type" : "draw",
                "target" : "local",
                "potency" : 2
            }]
                
        }
    },
    {
        "id": 24,
        "name" : "Fire III",
         JobId : 2,
        "type" : "spell",
        "specs" : {
            "cost" : 4,
            "effects" : [{
                "type" : "dmg",
                "potency" : 6
            }]
        }
    },
    {
        "id": 25,
        "name" : "Flare",
         JobId : 2,
        "type" : "spell",
        "specs" : {
            "cost" : 7,
            "effects" : [{
                "type" : "dmg",
                "potency" : 4,
                "target" : {
                    "type" : 'aoe',
                    "location" : "adversary-board"
                }
            }]
        }
    },
    {
        "id": 26,
        "name" : "Convert",
         JobId : 2,
        "type" : "spell",
        "specs" : {
            "cost" : 4,
            "effects" : [{
                "type" : "morph",
                "morph" : 15 
            }]
        }
    }
]

module.exports = {
    cards
}