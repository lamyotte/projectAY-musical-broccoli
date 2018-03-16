class Game{
	constructor(gameData){
		console.log(gameData);
		this.gameId = gameData.id;	
		this.adversary = gameData.adversary.tag;
		this.local = gameData.local.tag;
		this.localBoard = [];
		this.adversaryBoard = [];
		this.hand = gameData.local.hand;
		this.manapool = 0;
		this.mana = 0;
		this.adversaryMana = 0;
		this.adversaryManapool = 0;
		this.adversaryHand = 3;
		this.adversaryDeck = 27;
		this.HP = 30;
		this.adversaryHP = 30;
		this.localDeck = 27;
	}

	drawGame(writer) {

		writer("Adversary : " + this.adversary + " Hand: " + this.adversaryHand + " Deck: " + this.adversaryDeck
			+ " Mana: " + this.adversaryMana + "/" + this.adversaryManapool + " HP: " + this.adversaryHP);
		writer("Board: " + this.createCardString(this.adversaryBoard));
		writer("Your Board: " + this.createCardString(this.localBoard));
		writer("Your Hand: " + this.createCardString(this.hand));
		writer("Local: " + this.local + " Deck: " + this.localDeck + " Mana: " + this.mana + "/" + this.manapool + " HP: " + this.HP);
	}

	createCardString(arr) {
		let str = '';
		for (let i = 0; i < arr.length; i++) {
			str += '  [ ';
			str += arr[i].uid + ' ';
			str += arr[i].name + ' ';
			str += arr[i].specs.HP + 'HP ';
			str += arr[i].specs.Atk + 'ATK ';
			str += arr[i].specs.cost + 'Cost ';
			str += arr[i].type + 'Type ';
			str += JSON.stringify(arr[i].specs.abilities);
			str += ']';
		}
		return str
	}
}