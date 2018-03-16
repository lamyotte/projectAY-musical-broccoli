class Card{
	constructor(data){
		this.id = data.id;
		this.name = data.name;
		this.img = data.img;
		this.hp = data.specs.HP;
		this.atk = data.specs.Atk;
		this.cost = data.specs.cost;
		console.log(data);
		this.type = data.type;
		this.abilities = data.specs.abilities;
		this.uid = data.uid;
	}
}