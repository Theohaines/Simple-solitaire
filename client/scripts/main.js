//Command line stuff
const commandEntry = document.getElementById("commandEntry");
const terminal = document.getElementById("terminal");

//Deck and stock
var deck = [];
var stock = [];

//Tableau and build pile
var tableau = [[], [], [], [], [], [], []];
var buildPile = [[], [], [], []];

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

	toString(hiddenOverride){
		if (this.hidden && hiddenOverride == undefined){
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
		printToTerminal(card.toString(true));
	}
}

function debugTableau(){
    for (let column of tableau) {
        var cardColumn = "";
		for (let card of column){
			cardColumn = cardColumn + card.toString(true) + " ";
		}
		printToTerminal(cardColumn);
    } 
}

function debugStock(){
	for (var card of stock){
		printToTerminal(card.toString(true));
	}
}

function lsCmd(command){
	command = command.replace("ls", "").trim(); // Remove ls part of cmd and all whitespace

	if(command == "stock"){
		debugStock();
	} else {
		printToTerminal("Incorrect usage of ls. Try 'help'")
	}
	commandEntry.value = '';
}

function debugCmd(command){
	command = command.replace("debug", "").trim(); // Remove ls part of cmd and all whitespace

	if(command == "deck"){
		debugDeck();
	} else if (command == "tableau"){
		debugTableau();
	} else {
		printToTerminal("Incorrect usage of debug. Try 'help'")
	}
	commandEntry.value = '';
}

function processCommand(){
	if (commandEntry.value.toLowerCase() == "p"){
		printToTerminal("debug text");
	} else if (commandEntry.value.toLowerCase() == "start" || commandEntry.value.toLowerCase() == "s") {
		startGame();
	} else if (commandEntry.value.toLowerCase() == "clear" || commandEntry.value.toLowerCase() == "c") {
		clearTerminal();
	} else if (commandEntry.value.toLowerCase().includes("debug")) {
		debugCmd(commandEntry.value.toLowerCase());
	} else if (commandEntry.value.toLowerCase() == "draw deck") {
		drawDeck();
	} else if (commandEntry.value.toLowerCase().includes("ls")) {
		lsCmd(commandEntry.value.toLowerCase());
	} else if (commandEntry.value.toLowerCase().includes("move")) {
		moveCard(commandEntry.value.toLowerCase());
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

	printToTerminal("Drawn card: " + stock[0].toString());
}

function moveCard(command){
	command = command.replace("move ", ""); // Remove move part of cmd
	var cards = command.split(" ");

	if (cards.length != 2){
		printToTerminal("Incorrect usage of move. Try 'help'");
		return;
	}

	for (var card of cards){ //Checks if the entered 'cards' are cards that exist 
		if (checkCardExistance(card) == false){
			printToTerminal("Incorrect usage of move. Perhaps you entered an invalid card?");
			return;
		}
	}

	// If these cards do exist we assign them their own vars to make managing them easier
	var cardToMove = cards[0];
	var cardToMoveTo = cards[1];

	//Now we check the move validity
	isMoveValid = checkMoveValidity(cardToMove, cardToMoveTo);
	if (!isMoveValid){
		return;
	}

	// complete move
}

function checkCardExistance(card){
	for (var deckcard of deck){
		if (deckcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
			return true;
		}
	}

	for (var tableaucard of tableau){
		if (tableaucard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
			return true;
		}
	}

	for (var buildcard of buildPile){
		if (buildcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
			return true;
		}
	}

	for (var stockcard of stock){
		if (stockcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
			return true;
		}
	}
	return false;
}

function checkMoveValidity(cardToMove, cardToMoveTo){
	//Check if card is hidden (If card is hidden then it cannot be moved)
	if (cardToMove.hidden || cardToMoveTo.hidden){
		printToTerminal("You cannot move to that position because your card(s) is (are) hidden");
		return false;
	}
}

commandEntry.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' || e.keyCode === 13) { // using keycode for old browsers
		processCommand();
	}
});