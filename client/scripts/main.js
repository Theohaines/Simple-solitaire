//Command line stuff
const commandEntry = document.getElementById("commandEntry");
const terminal = document.getElementById("terminal");

//Terminal vars
var terminalTextColor = "#1bc615";

//Game vars
var score = 0;
var gameInProgress = false;
var moves = 0;

//Timer vars
var [milliseconds,seconds,minutes,hours] = [0,0,0,0];
var timerRef = document.querySelector('.timerDisplay');
var int = null;

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

	constructor(suit, rank, hidden, inStock, inBuild, locked){
		this.suit = suit;
		this.rank = rank;
		this.hidden = hidden;
		this.inStock = inStock;
		this.inBuild = inBuild;
		this.locked = locked;
	}

	toString(hiddenOverride){
		if (this.hidden && hiddenOverride == undefined){
			return "??";
		}

		return this.rank + this.suit;
	}
}

//Terminal stuff (Printing and clearing)
function printToTerminal(textToPrint){
	var text = document.createElement("p"); // Create paragraph
	text.textContent = textToPrint; // Set paragraph text
	text.style.color = terminalTextColor; // Set text colour
	terminal.prepend(text); //'Print' text
}

function printToTerminalArt(textToPrint){
	var text = document.createElement("pre"); // Create paragraph
	text.textContent = textToPrint; // Set paragraph text
	text.style.color = terminalTextColor; // Set text colour
	terminal.prepend(text); //'Print' text
}

function clearTerminal(){
	terminal.innerHTML = '';
}

//Debug stuff
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
	printToTerminal("Tableau:")
}

function debugBuildPile(hiddenOverride){
    for (let column of buildPile) {
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

//Command processing
function processCommand(){
	printToTerminal("C:/users/defaultuser> " + commandEntry.value);
	if (commandEntry.value.toLowerCase() == "p"){
		printToTerminal("debug text");
	} else if (commandEntry.value.toLowerCase() == "start") {
		startGame();
	} else if (commandEntry.value.toLowerCase() == "clear") {
		clearTerminal();
	} else if (commandEntry.value.toLowerCase() == "help") {
		helpCmd();
	} else if (commandEntry.value.toLowerCase() == "draw deck") {
		drawDeck();
	} else if (commandEntry.value.toLowerCase().includes("debug")) {
		debugCmd(commandEntry.value.toLowerCase());
	} else if (commandEntry.value.toLowerCase().includes("ls")) {
		lsCmd(commandEntry.value.toLowerCase());
	} else if (commandEntry.value.toLowerCase().includes("move")) {
		moveCard(commandEntry.value.toLowerCase());
	} else if (commandEntry.value.toLowerCase().includes("color")) {
		colorCmd(commandEntry.value.toLowerCase());
	} else {
		printToTerminal("No command found. Try 'help'")
	}
	commandEntry.value = '';
}

function helpCmd(){

}

//Commandlets
function lsCmd(command){
	command = command.replace("ls", "").trim(); // Remove ls part of cmd and all whitespace

	if(command == "stock"){
		debugStock();
	} else if (command == "tableau"){
		debugTableau();
	} else if (command == "buildpile"){
		debugBuildPile();
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
	} else if (command == "buildpile"){
		debugBuildPile(true);
	} else if (command == "hidden"){
		for (var card of deck){
			card.hidden = false;
		}
		for (var column of tableau){
			for (var card of column){
				card.hidden = false;
			}
		}
	} else {
		printToTerminal("Incorrect usage of debug. Try 'help'")
	}
	commandEntry.value = '';
}

function colorCmd(command){
	command = command.replace("color", "").trim(); // Remove ls part of cmd and all whitespace

	if(command == "1"){
		terminalTextColor = "#1bc615";
	} else if (command == "2"){
		terminalTextColor = "#0037da";
	} else if (command == "3"){
		terminalTextColor = "#368bcc";
	} else if (command == "4"){
		terminalTextColor = "#c50f1f";
	} else if (command == "5"){
		terminalTextColor = "#6e157a";
	} else if (command == "6"){
		terminalTextColor = "#897004";
	} else if (command == "7"){
		terminalTextColor = "#cccccc";
	} else if (command == "8"){
		terminalTextColor = "#767676";
	} else if (command == "9"){
		terminalTextColor = "#3b78ff";
	} else {
		printToTerminal("Incorrect usage of color. Try 'help'")
	}
	commandEntry.value = '';
}

//Game play functions (start game, movement, win)
//Start game
function startGame(){
	clearTerminal();
	buildDeck();
	shuffleDeck();
	dealDeck();

	//Display the table
	clearTerminal();
	debugTableau();
}

function restartGame(){

}

//Building table
function buildDeck(){
	printToTerminal("Building deck...");
	for (var suit of Card.suits){
		for (var rank of Card.ranks) {
			deck.push(new Card(suit, rank, true, false, false, false)); //Suit | Card value | Is hidden | In Stock
		} 
	}
	printToTerminal("Built deck!");
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

// Drawing cards from the deck
function drawDeck(){
	if (stock.length != 0){
		stock[0].hidden = true;
		stock.inStock = false;
		deck.push(stock[0]);
		stock.splice(0, 1);
	}
	stock.push(deck[0]);
	var index = deck.indexOf(stock[0]);
	deck.splice(index, 1)
	stock[0].hidden = false;
	stock[0].inStock = true;

	printToTerminal("Drawn card: " + stock[0].toString());
}

//Card movement
function moveCard(command){
	command = command.replace("move ", ""); // Remove move part of cmd
	var cards = command.split(" ");

	//Checks if the play has entered 2 values
	if (cards.length != 2){
		printToTerminal("Incorrect usage of move. Try 'help'");
		return;
	}

	//Checks if the entered 'cards' are cards that exist 
	for (var card of cards){
		if (checkCardExistance(card) == false){
			printToTerminal("Incorrect usage of move. Perhaps you entered an invalid card?");
			return;
		}
	}

	//Gets an actual reference to the card
	var cardToMove = getCardReference(cards[0]);
	var cardToMoveTo = getCardReference(cards[1]);

	//Now we check the move validity
	isMoveValid = checkMoveValidity(cardToMove, cardToMoveTo);
	if (!isMoveValid){
		return;
	}

	//Finds where the cards are from
	var removeFrom = findWhereCardIsFrom(cardToMove);
	var Moveto = findWhereCardIsFrom(cardToMoveTo);

	//Stop player from moveing the card to somewhere it already is
	if (removeFrom == Moveto){
		printToTerminal("Can't move card to the same place its in");
		return;
	}

	// Moving multiple cards (PLEASE NEVER REWORK I DONT UNDERSTAND HOW THIS WORKS)
	if (removeFrom[removeFrom.length - 1] != cardToMove){
		var cardsToMove = removeFrom.length - removeFrom.indexOf(cardToMove);
		cardsToSwap = removeFrom.slice(-cardsToMove);
		for (var card of cardsToSwap){
			Moveto.push(card);
			var index = removeFrom.indexOf(card);
			removeFrom.splice(index, 1);
		}
		return;
	}

	//Remove old card and add new ones
	Moveto.push(cardToMove);
	var index = removeFrom.indexOf(cardToMove);
	removeFrom.splice(index, 1);

	//Update column we took card from
	if (removeFrom.length != 0){
		CardToMakeVisible = removeFrom[removeFrom.length - 1].hidden = false;
	}

	debugTableau();
}

function moveAceToBuildPile(cardToMove){
	//This is the process to move an ace to a build pile

	for (var column of buildPile){
		if (column.length == 0){
			var buildPileToMoveTo = column;
			break;
		}
	}

	cardToMove.locked = true;
	cardToMove.inBuild = true;

	var removeFrom = findWhereCardIsFrom(cardToMove);

	buildPileToMoveTo.push(cardToMove);

	var index = removeFrom.indexOf(cardToMove);
	removeFrom.splice(index, 1);

	//Update column we took card from
	
	if (removeFrom.length != 0){
		CardToMakeVisible = removeFrom[removeFrom.length - 1].hidden = false;
	}

	debugTableau();
}

function moveToBuildPile(cardToMove, cardToMoveTo){
	//This is the process to move a card to a build pile
	if (cardToMove.suit != cardToMoveTo.suit){
		printToTerminal("I don't know how we got here this shouldn't be possible.");
		return;
	}

	isCardAscending = checkCardAscendingOrder(cardToMove, cardToMoveTo);
	if (!isCardAscending){
		printToTerminal("You cannot move to that position because the card isn't going ontop of a card ranked one lower than itself.");
		return;
	}

	var removeFrom = findWhereCardIsFrom(cardToMove);
	var moveTo = findWhereCardIsFrom(cardToMoveTo);

	if (checkCardsOnTop(removeFrom, cardToMove)){
		printToTerminal("You cannot move this to the build pile as it has cards on top of it.")
		return;
	}

	moveTo.push(cardToMove);

	var index = removeFrom.indexOf(cardToMove);
	removeFrom.splice(index, 1);

	//Update column we took card from
	
	if (removeFrom.length != 0){
		CardToMakeVisible = removeFrom[removeFrom.length - 1].hidden = false;
	}

	debugTableau();
}

function moveKingToEmptyColumn(cardToMove){
	//This is the process for moving kings to empty piles

	for (var column of tableau){
		if (column.length == 0){
			var columnToMoveTo = column;
			break;
		}
	}

	var removeFrom = findWhereCardIsFrom(cardToMove);

	if (checkCardsOnTop(removeFrom, cardToMove)){
		MoveMultipleCards(removeFrom, cardToMove, columnToMoveTo);
		return;
	}

	columnToMoveTo.push(cardToMove);

	var index = removeFrom.indexOf(cardToMove);
	removeFrom.splice(index, 1);

	//Update column we took card from
	if (removeFrom.length != 0){
		CardToMakeVisible = removeFrom[removeFrom.length - 1].hidden = false;
	}

	debugTableau();
}

function MoveMultipleCards(removeFrom, cardToMove, Moveto){
	if (removeFrom[removeFrom.length - 1] != cardToMove){
		var cardsToMove = removeFrom.length - removeFrom.indexOf(cardToMove);
		cardsToSwap = removeFrom.slice(-cardsToMove);
		for (var card of cardsToSwap){
			Moveto.push(card);
			var index = removeFrom.indexOf(card);
			removeFrom.splice(index, 1);
		}

		debugTableau();
		return;
	}
}

//Validity checks
function checkCardExistance(card){
	if (card.toLowerCase() == "buildpile"){
		return true;
	}

	if (card.toLowerCase() == "column"){
		return true;
	}

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

	for (var column of buildPile){
		for (var buildcard of column){
			if (buildcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
				return true;
			}
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
	//Check if card is locked
	if (cardToMove.locked){
		printToTerminal("You can't move this card because it is locked to its current position. (Ace is already in build pile).")
		return false;
	}

	//Check if card is ace (Auto move to build pile and then lock its movement)
	if(cardToMove.rank == "A"){
		if (cardToMove.hidden == false){
			moveAceToBuildPile(cardToMove, cardToMoveTo);
			return false;
		}
	}

	//Check if card to move if it is column
	if (cardToMoveTo == "column"){
		if (cardToMove.rank == "K"){
			moveKingToEmptyColumn(cardToMove);
			return false;
		}
	}

	//Check if card is hidden (If card is hidden then it cannot be moved)
	if (cardToMove.hidden == true || cardToMoveTo.hidden == true){
		printToTerminal("You cannot move to that position because your card(s) is (are) hidden");
		return false;
	}

	//Check if card to move to is in build pile (check process is diffirent so it would be inefficient to go through entire check)
	if (cardToMoveTo == "AS" || cardToMoveTo == "AC" || cardToMoveTo == "AH" || cardToMoveTo == "AD"){
		moveToBuildPile(cardToMove, cardToMoveTo);
		return false;
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
		printToTerminal("You cannot move to that position because the card isn't going ontop of a card ranked one higher than itself.");
		return;
	}

	return true;
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
	} else if (cardToMove.rank == "8" && cardToMoveTo.rank == "9"){
		return true;
	} else if (cardToMove.rank == "7" && cardToMoveTo.rank == "8"){
		return true;
	} else if (cardToMove.rank == "6" && cardToMoveTo.rank == "7"){
		return true;
	} else if (cardToMove.rank == "5" && cardToMoveTo.rank == "6"){
		return true;
	} else if (cardToMove.rank == "4" && cardToMoveTo.rank == "5"){
		return true;
	} else if (cardToMove.rank == "3" && cardToMoveTo.rank == "4"){
		return true;
	} else if (cardToMove.rank == "2" && cardToMoveTo.rank == "3"){
		return true;
	} else if (cardToMove.rank == "A" && cardToMoveTo.rank == "2"){
		return true;
	}
	return false;
}

function checkCardAscendingOrder(cardToMove, cardToMoveTo){
	if(cardToMove.rank == "A"){
		printToTerminal("Acheivement: How did we get here?");
	} else if (cardToMove.rank == "2" && cardToMoveTo.rank == "A"){
		return true;
	} else if (cardToMove.rank == "3" && cardToMoveTo.rank == "2"){
		return true;
	} else if (cardToMove.rank == "4" && cardToMoveTo.rank == "3"){
		return true;
	} else if (cardToMove.rank == "5" && cardToMoveTo.rank == "4"){
		return true;
	}  else if (cardToMove.rank == "6" && cardToMoveTo.rank == "5"){
		return true;
	}  else if (cardToMove.rank == "7" && cardToMoveTo.rank == "6"){
		return true;
	}  else if (cardToMove.rank == "8" && cardToMoveTo.rank == "7"){
		return true;
	}  else if (cardToMove.rank == "9" && cardToMoveTo.rank == "8"){
		return true;
	}  else if (cardToMove.rank == "10" && cardToMoveTo.rank == "9"){
		return true;
	}  else if (cardToMove.rank == "J" && cardToMoveTo.rank == "10"){
		return true;
	}  else if (cardToMove.rank == "Q" && cardToMoveTo.rank == "J"){
		return true;
	}  else if (cardToMove.rank == "K" && cardToMoveTo.rank == "Q"){
		return true;
	} 
	return false;
}

function checkCardsOnTop(removeFrom, cardToMove){
	if (removeFrom[removeFrom.length - 1] != cardToMove){
		return true;
	}

	return false;
}

//Card manipulation
function getCardReference(card){
	if (card.toLowerCase() == "buildpile"){
		return "buildpile";
	}

	if (card.toLowerCase() == "column"){
		return "column";
	}

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

	for (var column of buildPile){
		for (var buildcard of column){
			if (buildcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
				return buildcard;
			}
		}
	}

	for (var stockcard of stock){
		if (stockcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
			return stockcard;
		}
	}
}

function findWhereCardIsFrom(card){
	for (var deckcard of deck){
		if (deckcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
			return deck;
		}
	}

	for (var column of tableau){
		for (var tableaucard of column){
			if (tableaucard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
				return column;
			}
		}
	}

	for (var column of buildPile){
		for (var buildcard of column){
			if (buildcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
				return column;
			}
		}
	}

	for (var stockcard of stock){
		if (stockcard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
			return stock;
		}
	}
	return false;
}

function findCardsDeck(card){
	for (var column of tableau){
		for (var tableaucard of column){
			if (tableaucard.toString(true) == card.toString(true).toUpperCase()){ // Messy logic but hey it works
				return column;
			}
		}
	}
}

//Check win state
function checkIfGameIsWon(){
	if (deck.length != 0){
		return;
	}

	for (var column in tableau){
		if (column.length != 0){
			return;
		}
	}

	if (stock.length != 0){
		return;
	}

	//If game is won
	gameHasBeenWon();
}

function gameHasBeenWon(){

}

// Game functions
function gameTimer(){
	int = setInterval(displayTimer,10);
}

function displayTimer(){
	milliseconds+=10;
	if(milliseconds == 1000){
		milliseconds = 0;
		seconds++;
		if(seconds == 60){
			seconds = 0;
			minutes++;
			if(minutes == 60){
				minutes = 0;
				hours++;
			}
		}
	}
	let h = hours < 10 ? "0" + hours : hours;
	let m = minutes < 10 ? "0" + minutes : minutes;
	let s = seconds < 10 ? "0" + seconds : seconds;
	let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;

	printToTerminal(` ${h} : ${m} : ${s} : ${ms}`);
}

//Welcome screen
function welcomeScreen(){
	printToTerminal("##########[END]##########");
	printToTerminal("(or type help for assistance)")
	printToTerminal("type start to begin a game.")
	printToTerminal("#########################");
	printToTerminal("Welcome to simple solitaire!")
	printToTerminal("##########[CMD]##########");
}
welcomeScreen();
//gameTimer();
// EVENTS
commandEntry.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' || e.keyCode === 13) { // using keycode for old browsers
		processCommand();
	}
});
