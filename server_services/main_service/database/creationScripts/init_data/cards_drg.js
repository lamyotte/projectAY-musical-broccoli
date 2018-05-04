const cards = [
    {
        "id": 27,
        "name" : "Warden Hound",
        JobId : 1,
        "type" : "creature",
        "specs" : {
            "family" : 'dragon',
            "HP" : "1",
            "Atk" : "1",
            "cost" : "1",
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
    },
    {
        "id": 28,
        "name" : "Piercing Talon",
         JobId : 1,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [ {
                "type" : "dmg",
                "potency" : 1
            }]
        }
    }, 
    {
        "id": 29,
        "name" : "Leg Sweep",
         JobId : 1,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "set",
                "attribute" : "HP",
                "set" : 1
            }]
        }
    },
    {
        "id": 30,
        "name" : "Dragon Companion",
        JobId : 1,
        "type" : "spell",
        "specs" : {
            "cost" : 3,
            "effects" : [ {
                "type" : "summon",
                "summon" : [ 31, 32, 33],
                "potency" : 1

            }]   
        }
    },
    {
        "id": 31,
        "name" : "Gullinkambi",
        JobId : 1,
        "type" : "creature",
        "specs" : {
            "family" : 'dragon',
            "HP" : "2",
            "Atk" : "4",
            "cost" : "3",
            "abilities" : {
                "battlecry" : {
                    "type" : "charge"
                }
            }
        }
    },
    {
        "id": 32,
        "name" : "Kal Myhk",
        JobId : 1,
        "type" : "creature",
        "specs" : {
            "family" : 'dragon',
            "HP" : "4",
            "Atk" : "2",
            "cost" : "3",
            "abilities" : {
                "bonus" : [{
                    "type" : "attribute",
                    "target" : {
                        "type" : "aoe",
                        "location" : "local-board"
                    },
                    "attribute" : "Atk", 
                    "potency" : 1
                    }
                ]
            }
        }
    },
        {
        "id": 33,
        "name" : "Vidofnir",
        JobId : 1,
        "type" : "creature",
        "specs" : {
            "family" : 'dragon',
            "HP" : "4",
            "Atk" : "4",
            "cost" : "3",
            "abilities" : {
                "taunt" : ""
            }
        }
    },
    {
        "id": 34,
        "name" : "Spineshatter Dive",
         JobId : 1,
        "type" : "spell",
        "specs" : {
            "cost" : 3,
            "effects" : [{
                "type" : "dmg",
                "target" : {
                    "conditions" :[{
                        "type" : "location",
                        "location" : "adversary-board"
                    }]
                },
                "potency" : {
                    "default" : 3,
                    "conditions" : [{
                        "potency" : 5,
                        "conditions" : [{
                            "type" : "family",
                            "family" : "dragon",
                            "fulfilled" : 1,
                            "location" : "local-board"
                        }]
                    }]
                }
            }]
        }
    },
    {
        "id": 35,
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
    }, {
        "id": 36,
        "name" : "Place Holder 1",
        JobId : 1,
        "type" : "creature",
        "specs" : {
            "family" : 'dragon',
            "HP" : "3",
            "Atk" : "4",
            "cost" : "4",
            "abilities" : {
                "battlecry" : {
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
                }  
            }
            }
    }, {
        "id": 37,
        "name" : "Place Holder 2",
        JobId : 1,
        "type" : "creature",
        "specs" : {
            "family" : 'dragon',
            "HP" : "5",
            "Atk" : "2",
            "cost" : "5",
            "abilities" : {
                "bonus" : [{
                   "type" : "ability",
                    "target" : {
                        "type" : "family",
                        "family" : "dragon",
                        "location" : "local-board"
                    },
                    "ability" : {
                        "battlecry" : {
                            "charge" : ""
                        }
                    }
                }]
            }
            }
    },  {
        "id": 38,
        "name" : "Place Holder 3",
        JobId : 1,
        "type" : "creature",
        "specs" : {
            "family" : 'dragon',
            "HP" : "2",
            "Atk" : "3",
            "cost" : "5",
            "abilities" : {
                "bonus" : [{
                   "type" : "ability",
                    "target" : {
                        "type" : "family",
                        "family" : "dragon",
                        "location" : "local-board"
                    },
                    "ability" : {
                        "battlecry" : {
                            "type" : "draw",
                            "target" : "local",
                            "potency" : 1
                        }
                    }
                } ] 
            }
        }
    },{
        "id": 42,
        "name" : "Draw card (tracking)",
        JobId : 1,
        "type" : "spell",
        "specs" : {
            "cost" : 1,
            "effects" : [{
                "type" : "draw",
                "target" : "local",
                "potency" : 1,
            }]
        }
    },
]

module.exports = {
    cards
}