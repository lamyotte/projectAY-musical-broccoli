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
		writer("Board: ");
		for (let i = 0; i < this.adversaryBoard.length; i++) {
			writer(this.createCardStringOnBoard(this.adversaryBoard[i]));
		}
		writer("Your Board:")
		for (let i = 0; i < this.localBoard.length; i++) {
			writer(this.createCardStringOnBoard(this.localBoard[i]));
		}
		writer("Your Hand: ");
		for (let i = 0; i < this.hand.length; i++) {
			writer(this.createCardStringHand(this.hand[i]));
		}
		writer("Local: " + this.local + " Deck: " + this.localDeck + " Mana: " + this.mana + "/" + this.manapool + " HP: " + this.HP);
	}

	createCardStringHand(card) {
		let str = '';
		str += '  [ ';
		str += card.uid + ' ';
		str += card.name + ' ';
		if (card.type == "creature") {
			str += card.specs.HP + 'HP ';
			str += card.specs.Atk + 'ATK ';
			if (card.specs.hasOwnProperty('family'))
				str += card.specs.family + 'Family ';
			str += JSON.stringify(card.specs.abilities);
		}
		else {
			str += JSON.stringify(card.specs.effects);	
		}
		str += card.type + 'Type ';
		str += card.specs.cost + 'Cost ';
		str += ']';
		return str
	}

	createCardStringOnBoard(card) {
		let str = '';
		str += '  [ ';
		str += card.uid + ' ';
		str += card.name + ' ';
		str += card.cHP + 'cHP ';
		str += card.cAtk + 'cATK ';
		str += card.specs.cost + 'Cost ';
		str += card.type + 'Type ';
		if (card.specs.hasOwnProperty('family'))
			str += card.specs.family + 'Family ';
		str += JSON.stringify(card.specs.abilities);
		str += ']';
		return str
	}
}