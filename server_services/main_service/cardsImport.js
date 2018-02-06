const cards = [
    {
        "name" : "Mandragora",
        "specs" : {
            "HP" : "1",
            "Atk" : "2",
            "cost" : "1",
            "abilities" : {
                "battlecry" : {
                    "type" : "heal",
                    "potency" : "2"
                }
            }
        }
    },{
        "name" : "Spriggan",
        "specs" : {
        "type" : "monster",
        "HP" : "1",
        "Atk" : "2",
        "cost" : "1",
        "abilities" : {
            "battlecry" : {
                "type" : "charge"
            }
        }
    }
    },{
        "name" : "Sylvan Sough",
        "specs" : {
        "type" : "sylph",
        "HP" : "1",
        "Atk" : "2",
        "cost" : "1",
        "abilities" : {  
        }
    }
    },{
        "name" : "Raptor",
        "specs" : {
        "type" : "monster",
        "HP" : "3",
        "Atk" : "2",
        "cost" : "2",
        "abilities" :{
        }
    }
    },{
        "name" : "Mammet",
        "specs" : {
        "HP" : "1",
        "Atk" : "1",
        "cost" : "2",
        "abilities" : {
            "battlecry" : {
                "type" : "draw",
                "potency" : "1"
            }
        }
    }
    },{
        "name" : "Ahriman",
        "specs" : {
        "type" : "monster",
        "HP" : "2",
        "Atk" : "3",
        "cost" : "2",
        "abilities" : {
        }
    }
    },{
        "name" : " Qiqirn",
        "specs" : {
        "HP" : "1",
        "Atk" : "3",
        "cost" : "3",
        "abilities" : {
            "battlecry" : {
                "type" : "charge"
            } 
        }
    }
    },{
        "name" : "Puksi Piko the Shaggysong",
        "specs" : {
        "HP" : "2",
        "Atk" : "2",
        "cost" : "3",
        "abilities" : {
            "bonus" : {
                "type" : "atk",
                "potency" : "1"
            }
        }
    }
    },{
        "name" : "Tonberry Creeper",
        "specs" : {
        "HP" : "1",
        "Atk" : "5",
        "cost" : "3",
        "abilities" : {
        }
    }
    },{
        "name" : "Dullahan",
        "specs" : {
        "HP" : "5",
        "Atk" : "3",
        "cost" : "4",
        "abilities" : {
            "taunt" : ""
        }
    }
    },{
        "name" : "Adamantoise",
        "specs" : {
        "type" : "monster",
        "HP" : "7",
        "Atk" : "2",
        "cost" : "4",
        "abilities" : {
        }
    }
    },{
        "name" : "Cactuar",
        "specs" : {
        "HP" : "4",
        "Atk" : "4",
        "cost" : "5",
        "abilities" : {
            "battlecry" : {
                "type" : "dmg",
                "potency" : "4",
                "target" : "hero"
            }
        }
    }
    },{
        "name" : "Raubahn",
        "specs" : {
        "HP" : "2",
        "Atk" : "5",
        "cost" : "6",
        "abilities" : {
            "battlecry" : {
                "type" : "charge"
            }
        }
    }
    },{
        "name" : "Goobue",
        "specs" : {
        "HP" : "7",
        "Atk" : "6",
        "cost" : "6",
        "abilities" : {
        }
    }
    }

]

module.exports = {
    cards
}