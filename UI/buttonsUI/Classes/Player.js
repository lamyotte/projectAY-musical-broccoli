class Player{
	constructor(data){
		this.tag = data.tag;
		this.id = data.id;
		this.decks = [];
	}
	displayDecks(){
		let display = [];
		for(let i = 0; i < this.decks.length; i++) {
			display[i] = {
				id: this.decks[i].id,
				job: this.decks[i].job.name
			}
		}
		return JSON.stringify(display);
	}
}