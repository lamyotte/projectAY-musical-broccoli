class Game{
	constructor(gameData){
		console.log(gameData);
		this.gameId = gameData.id;	
		this.adversary = gameData.adversary.tag;
		this.local = gameData.local.tag;
		this.localBoard = [];
		this.advesaryBoard = [];
		this.hand = gameData.local.hand;
		this.manapool = 0;
		this.mana = 0;
		this.advesaryMana = 0;
		this.advesaryManapool = 0;
		this.adversaryHand = 3;
		this.adversaryDeck = 27;
		this.localDeck = 27;
	}

	drawGame(writer) {

		writer("Adversary : " + this.adversary + " Hand: " + this.adversaryHand + " Deck: " + this.adversaryDeck
			+ " Mana: " + this.advesaryMana + "/" + this.advesaryManapool);
		writer("Board: " + this.createCardString(this.advesaryBoard));
		writer("Your Board: " + this.createCardString(this.localBoard));
		writer("Your Hand: " + this.createCardString(this.hand));
		writer("Local: " + this.local + " Deck: " + this.localDeck + " Mana: " + this.mana + "/" + this.manapool);
	}

	createCardString(arr) {
		let str = '';
		for (let i = 0; i < arr.length; i++) {
			str += '  [ ';
			str += arr[i].id + ' ';
			str += arr[i].name + ' ';
			str += arr[i].specs.HP + 'HP ';
			str += arr[i].specs.Atk + 'ATK ';
			str += arr[i].specs.cost + 'Cost ';
			if(arr[i].specs.hasOwnProperty('type'))
				str += arr[i].specs.type + 'Type ';
			str += JSON.stringify(arr[i].specs.abilities);
			str += ']';
		}
		return str
	}
}