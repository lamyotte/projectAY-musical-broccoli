const jobs = [
	{
		id: -1,
		name: "General",
		img: "null",
		specs: {
		}
	},
	{
		id: 1,
		name: "Dragoon",
		img: "null",
		specs: {
			name : "jump", 
			type : "dmg",
            potency : "2",
            target: "adversary"
		}
	},
	{
		id: 2,
		name: "Black Mage",
		img: "null",
		specs: {
			name: "fire 1", 
			type : "dmg",
            potency : "1"
		}
	},
	{
		id: 3,
		name: "White Mage",
		img: "null",
		specs: {
			name: "cure 1",
			type : "heal",
            potency : "2"
		}
	},
	{
		id: 4,
		name: "Bard",
		img: "null",
		specs: {
			type : "buff",
            atk_potency : "1",
            hp_potency: "1",
            duration : "1"
		}
	}



]

module.exports = {
	jobs
}