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
	static ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

	constructor(suit, rank, hidden, inStock, inBuild){
		this.suit = suit;
		this.rank = rank;
		this.hidden = hidden;
		this.inStock = inStock;
		this.inBuild = inBuild;
	}

	toString(hiddenOverride){
		if (this.hidden && hiddenOverride == undefined){
			return "??";
		}

		return this.rank + this.suit;
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

function debugTableau(hiddenOverride){
    for (let column of tableau) {
        var cardColumn = "";
		for (let card of column){
			cardColumn = cardColumn + card.toString(hiddenOverride) + " ";
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
	} else if (command == "tableau"){
		debugTableau();
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
		debugTableau(true);
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
	} else if (commandEntry.value.toLowerCase() == "draw deck") {
		drawDeck();
	} else if (commandEntry.value.toLowerCase().includes("debug")) {
		debugCmd(commandEntry.value.toLowerCase());
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
		for (var rank of Card.ranks) {
			deck.push(new Card(suit, rank, true, false, false)); //Suit | Card value | Is hidden | In Stock
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
		stock[0].hidden = true;
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

	var cardToMove = getCardReference(cards[0]);
	var cardToMoveTo = getCardReference(cards[1]);

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

	for (var column of tableau){
		for (var tableaucard of column){
			if (tableaucard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
				return true;
			}
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

function getCardReference(card){
	for (var deckcard of deck){
		if (deckcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
			return deckcard;
		}
	}

	for (var column of tableau){
		for (var tableaucard of column){
			if (tableaucard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
				return tableaucard;
			}
		}
	}

	for (var buildcard of buildPile){
		if (buildcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
			return buildcard;
		}
	}

	for (var stockcard of stock){
		if (stockcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
			return stockcard;
		}
	}
}

function checkMoveValidity(cardToMove, cardToMoveTo){
	//Check if card is hidden (If card is hidden then it cannot be moved)
	if (cardToMove.hidden == true || cardToMoveTo.hidden == true){
		printToTerminal("You cannot move to that position because your card(s) is (are) hidden");
		return false;
	}

	//Check if card to move to is in build pile (check process is diffirent so it would be inefficient to go through entire check)
	if (cardToMoveTo.inBuild){
		printToTerminal("Cards have same suit");
		// Gonna have to implement seperate function to check if the move is compatible and return true of false
	}

	// Check if card types are compatible
	if (cardToMove.suit == "C" || cardToMove.suit == "S"){
		if (cardToMoveTo.suit == "C" || cardToMoveTo.suit == "S"){
			printToTerminal("You cannot move to that position because your card suits clash (CS / DH)");
			return false;
		}
	} else if (cardToMove.suit == "D" || cardToMove.suit == "H") {
		if (cardToMoveTo.suit == "D" || cardToMoveTo.suit == "H"){
			printToTerminal("You cannot move to that position because your card suits clash (CS / DH)");
			return false;
		}
	}

	//Check if card is in descending order
	var isCardDescending = checkCardDescendingOrder(cardToMove, cardToMoveTo);
	if (!isCardDescending){
		printToTerminal("You cannot move to that position because the card isn't going ontop of a card ranked one lower than itself.");
	}
}

function checkCardDescendingOrder(cardToMove, cardToMoveTo){
	if(cardToMove.rank == "K"){
		// CAN ONLY BE MOVED TO EMPTY SPACE
	} else if (cardToMove.rank == "Q" && cardToMoveTo.rank == "K"){
		return true;
	} else if (cardToMove.rank == "J" && cardToMoveTo.rank == "Q"){
		return true;
	} else if (cardToMove.rank == "10" && cardToMoveTo.rank == "J"){
		return true;
	} else if (cardToMove.rank == "9" && cardToMoveTo.rank == "10"){
		return true;
	}  else if (cardToMove.rank == "8" && cardToMoveTo.rank == "9"){
		return true;
	}  else if (cardToMove.rank == "7" && cardToMoveTo.rank == "8"){
		return true;
	}  else if (cardToMove.rank == "6" && cardToMoveTo.rank == "7"){
		return true;
	}  else if (cardToMove.rank == "5" && cardToMoveTo.rank == "6"){
		return true;
	}  else if (cardToMove.rank == "4" && cardToMoveTo.rank == "5"){
		return true;
	}  else if (cardToMove.rank == "3" && cardToMoveTo.rank == "2"){
		return true;
	}  else if (cardToMove.rank == "2" && cardToMoveTo.rank == "A"){
		return true;
	}  else if (cardToMove.rank == "A" && cardToMoveTo.rank == "2"){
		// CAN ONLY BE MOVED TO BUILD PILE AND 2
	} 
	return false;
}

commandEntry.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' || e.keyCode === 13) { // using keycode for old browsers
		processCommand();
	}
});