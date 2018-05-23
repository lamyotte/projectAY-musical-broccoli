const cards = [
    {
        "id": 1,
        "name" : "Mandragora",
        JobId : -1,
        "type" : "creature",
        "specs" : {
            "HP" : 1,
            "Atk" : 2,
            "cost" : 1,
            "abilities" : {
                "battlecry" : [{
                    "type" : "heal",
                    "potency" : "2"
                }]
            }
        }
    },{
        "id": 2,
        "name" : "Spriggan",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "family" : "dragon",
        "HP" : 1,
        "Atk" : 1,
        "cost" : 1,
        "abilities" : {
            "battlecry" : [{
                "type" : "charge"
            }]
        }
    }
    },{
        "id": 3,
        "name" : "Sylvan Sough",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "family" : "sylph",
        "HP" : 1,
        "Atk" : 2,
        "cost" : 1,
        "abilities" : {  
        }
    }
    },{
        "id": 4,
        "name" : "Raptor",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "family" : "monster",
        "HP" : 3,
        "Atk" : 2,
        "cost" : 2,
        "abilities" :{
        }
    }
    },{
        "id": 5,
        "name" : "Mammet",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 1,
        "Atk" : 1,
        "cost" : 2,
        "abilities" : {
            "battlecry" : [{
                "type" : "draw",
                "target" : "local",
                "potency" : "1"
            }]
        }
    }
    },{
        "id": 6,
        "name" : "Ahriman",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "family" : "monster",
        "HP" : 2,
        "Atk" : 3,
        "cost" : 2,
        "abilities" : {
        }
    }
    },{
        "id": 7,
        "name" : " Qiqirn",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 1,
        "Atk" : 3,
        "cost" : 3,
        "abilities" : {
            "battlecry" : [{
                "type" : "charge"
            }]
        }
    }
    },{
        "id": 8,
        "name" : "Puksi Piko the Shaggysong",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 2,
        "Atk" : 2,
        "cost" : 2,
        "abilities" : {
            "bonus" : {
                "type" : "atk",
                "potency" : "1"
            }
        }
    }
    },{
        "id": 9,
        "name" : "Tonberry Creeper",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 1,
        "Atk" : 5,
        "cost" : 3,
        "abilities" : {
        }
    }
    },{
        "id": 10,
        "name" : "Dullahan",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 5,
        "Atk" : 3,
        "cost" : 4,
        "abilities" : {
            "taunt" : ""
        }
    }
    },{
        "id": 11,
        "name" : "Adamantoise",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "family" : "dragon",
        "HP" : 7,
        "Atk" : 2,
        "cost" : 4,
        "abilities" : {
        }
    }
    },{
        "id": 12,
        "name" : "Cactuar",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 4,
        "Atk" : 4,
        "cost" : 5,
        "abilities" : {
            "battlecry" : [{
                "type" : "dmg",
                "potency" : "4",
                "target" : "adversary"
            }]
        }
        }
    },{
        "id": 13,
        "name" : "Raubahn",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 2,
        "Atk" : 5,
        "cost" : 6,
        "abilities" : {
            "battlecry" : [{
                "type" : "charge"
            }]
        }
    }
    },{
        "id": 14,
        "name" : "Goobue",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 7,
        "Atk" : 6,
        "cost" : 6,
        "abilities" : {
        }
    }
    },
    {
        "id": 15,
        "name" : "Beetle",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 1,
        "Atk" : 1,
        "cost" : 1,
        "abilities" : {
        }
    }
    },{
        "id": 16,
        "name" : "Tamed Warbear",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 3,
        "Atk" : 3,
        "cost" : 3,
        "abilities" : {
            "taunt" : ""
        }
    }
    },{
        "id": 17,
        "name" : "Ak-Mena Varlet",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 2,
        "Atk" : 3,
        "cost" : 3,
        "abilities" : {
            "battlecry" : [{
                "type" : "bonus",
                "target" : {
                    "conditions" : [{
                        "type" : "location",
                        "location" : "local-board"
                    }]
                },
                "bonus" : [{
                        "type" : "attribute",
                        "attribute" : "HP",
                        "potency" : 1
                    }, {
                        "type" : "attribute",
                        "attribute" : "Atk", 
                        "potency" : 1
                }]
            }] 
        }
    }
    }, {
        "id": 18,
        "name" : "Lone Yeti",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 5,
        "Atk" : 4,
        "cost" : 4,
        "abilities" : {
        }
    }
    }, {
        "id": 19,
        "name" : "Gaelicat",
        JobId : -1,
        "type" : "creature",
        "specs" : {
        "HP" : 4,
        "Atk" : 2,
        "cost" : 4,
        "abilities" : {
            "battlecry" : [{
                "type" : "draw",
                "target" : "local",
                "potency" : 1
            }]
        }
    }
    } ,  {
        "id": 39,
        "name" : "Place Holderrr",
        JobId : -1,
        "type" : "creature",
        "specs" : {
            "family" : "dragon",
            "HP" : 3,
            "Atk" : 2,
            "cost" : 2,
            "abilities" : {
            }
        }
    },  {
        "id": 40,
        "name" : "Place Holderrr again",
        JobId : -1,
        "type" : "creature",
        "specs" : {
            "HP" : 3,
            "Atk" : 2,
            "cost" : 3,
            "abilities" : {
                "battlecry" : [{
                    "type" : "summon",
                    "summon" : 41,
                    "potency" : 1
                }]
            }
        }
    },  {
        "id": 41,
        "name" : "The place hoder summon",
        JobId : -1,
        "type" : "creature",
        "specs" : {
            "family" : "dragon",
            "HP" : 1,
            "Atk" : 1,
            "cost" : 1,
            "abilities" : {
            }
        }
    }
]

module.exports = {
    cards
}