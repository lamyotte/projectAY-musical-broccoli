class Card{
	constructor(data){
		this.id = data.id;
		this.name = data.name;
		this.img = data.img;
		if (data.type == "creature") {
			this.hp = data.specs.HP;
			this.atk = data.specs.Atk;
			this.cHP = data.specs.HP;
			this.cAtk = data.specs.Atk;
			this.abilities = data.specs.abilities;
		}
		else if (data.type == "spell") {
			this.effects = data.effects;
		}
		this.cost = data.specs.cost;
		this.type = data.type;
		this.uid = data.uid;
	}
}