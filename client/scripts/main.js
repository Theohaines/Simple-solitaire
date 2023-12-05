//Command line stuff
const commandEntry = document.getElementById("commandEntry");
const terminal = document.getElementById("terminal");

//Deck and stock
var deck = [];
var stock = [];

//Tableau
var tableau = [[], [], [], [], [], [], []];

//Card class
class Card{
	static suits = ["C", "S", "H", "D"];
	static values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

	constructor(suit, cardValue, hidden, inStock){
		this.suit = suit;
		this.cardValue = cardValue;
		this.hidden = hidden;
		this.inStock = inStock;
	}

	toString(){
		if (this.hidden){
			return "??";
		}

		return this.cardValue + this.suit;
	}
}

function printToTerminal(textToPrint){
	var linebreak = document.createElement("br");
	var textNode = document.createTextNode(textToPrint); terminal.prepend(linebreak ,textNode);
}

function clearTerminal(){
	terminal.innerHTML = '';
}

function debugDeck(){
	for (var card of deck){
		printToTerminal(card.toString());
	}
}

function debugTableau(){
    for (let column of tableau) {
        var cardColumn = "";
		for (let card of column){
			cardColumn = cardColumn + card.toString() + " ";
		}
		printToTerminal(cardColumn);
    } 
}

function debugStock(){
	for (var card of stock){
		printToTerminal(card.toString());
	}
}

function processCommand(){
	if (commandEntry.value.toLowerCase() == "p"){
		printToTerminal("debug text");
	} else if (commandEntry.value.toLowerCase() == "start" || commandEntry.value.toLowerCase() == "s") {
		startGame();
	} else if (commandEntry.value.toLowerCase() == "clear" || commandEntry.value.toLowerCase() == "c") {
		clearTerminal();
	} else if (commandEntry.value.toLowerCase() == "debugdeck" || commandEntry.value.toLowerCase() == "d") {
		debugDeck();
	} else if (commandEntry.value.toLowerCase() == "draw deck") {
		drawDeck();
	} else if (commandEntry.value.toLowerCase() == "ls stock") {
		debugStock();
	} else if (commandEntry.value.toLowerCase() == "move") {
		debugStock();
	} else {
		printToTerminal("No command found. Try 'help'")
	}
	commandEntry.value = '';
}

function startGame(){
	buildDeck();
	shuffleDeck();
	dealDeck();
}

function buildDeck(){
	printToTerminal("Building deck...");
	for (var suit of Card.suits){
		for (var value of Card.values) {
			deck.push(new Card(suit, value, true, false)); //Suit | Card value | Is hidden | In Stock
		} 
	}
	printToTerminal("Built deck!");

	//debugDeck();
}

function shuffleDeck(){
	printToTerminal("Shuffling deck...");
	var i = deck.length, temp, rand;

	while (0 !== i){
		rand = Math.floor(Math.random() * i);
		i--;

		temp = deck[i];
		deck[i] = deck[rand];
		deck[rand] = temp;
	}
	printToTerminal("Shuffled deck!");
	//debugDeck();
}

function dealDeck(){
	//Lay Tableau
	//Setup temp vars
	var cardsToAdd = 1;
	for (var column in tableau){
		for (let i = 0; i < cardsToAdd; i++) {
			var rand = Math.floor(Math.random() * deck.length);
			if (i == cardsToAdd - 1){
				deck[rand].hidden = false;
			}
			tableau[column].push(deck[rand]);
			deck.splice(rand, 1);
		}
		cardsToAdd++;
	}

	debugTableau();
	debugDeck();
}

function drawDeck(){
	if(stock.length != 0){
		stock[0].inStock = false
		deck.push(stock[0])
	}
	stock.shift()
	deck.shift(stock[0]);
	stock.push(deck[0]);
	stock[0].hidden = false;
	stock[0].inStock = true;

	printToTerminal(deck.length);
	printToTerminal("Card in stock: " + stock[0].toString());
}

function MoveCard(){

}

commandEntry.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' || e.keyCode === 13) { // using keycode for old browsers
		processCommand();
	}
});