class Deck{
	constructor(data){
		this.id = data.id;
		this.cards = [];
		for(let i = 0; i < data.Cards.length ; i++ )
			this.cards[i] = new Card(data.Cards[i]);
		this.job = data.Job;
	}

	displayCards() {
		let str = "";
		for(let i = 0; i < this.cards.length ; i++ ) {
			str += JSON.stringify(this.cards[i])
		}
		return str;
	}
}