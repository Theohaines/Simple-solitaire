//Command line stuff
const commandEntry = document.getElementById("commandEntry");
const terminal = document.getElementById("terminal")

//Suits
var suits = ["C", "S", "H", "D"]
var cardValue = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

//Deck
var deck = [];

//Table
var tableau = [[], [], [], [], [], [], []];

function printToTerminal(textToPrint){
	var linebreak = document.createElement("br");
	var textNode = document.createTextNode(textToPrint); terminal.prepend(linebreak ,textNode);
}

function clearTerminal(){
	terminal.innerHTML = '';
}

function debugDeck(){
	for (var card in deck){
		printToTerminal(deck[card]);
		printToTerminal(deck.length);
	}
}

function debugTableau(){
	for (var column in tableau){
		for (var card in column){
			printToTerminal(tableau[column[card]]);
		}
	}
}

function processCommand(){
	if (commandEntry.value.toLowerCase() == "p"){
		printToTerminal("debug text");
	} else if (commandEntry.value.toLowerCase() == "start" || commandEntry.value.toLowerCase() == "s") {
		startGame();
	} else if (commandEntry.value.toLowerCase() == "start" || commandEntry.value.toLowerCase() == "s") {
		startGame();
	} else if (commandEntry.value.toLowerCase() == "debugdeck" || commandEntry.value.toLowerCase() == "d") {
		debugDeck();
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
	for (var suit in suits){
		for (let i = 0; i < cardValue.length; i++) {
			deck.push(suits[suit] + cardValue[i]);
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
			tableau[column].push(deck[rand]);
			deck.splice(deck.indexOf(rand, 1));
		}
		cardsToAdd++;
	}

	debugTableau();
	//debugDeck();
}

commandEntry.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' || e.keyCode === 13) { // using keycode for old browsers
		processCommand();
	}
});