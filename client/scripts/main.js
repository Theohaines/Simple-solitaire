const { table } = require("console");

//Command line stuff
const commandEntry = document.getElementById("commandEntry");
const terminal = document.getElementById("terminal")

// deck
var deck = [];

// suits
var suits = [];
   suits['spades'] = [
      ['A','S'],
      ['2','S'],
      ['3','S'],
      ['4','S'],
      ['5','S'],
      ['6','S'],
      ['7','S'],
      ['8','S'],
      ['9','S'],
      ['10','S'],
      ['J','S'],
      ['Q','S'],
      ['K','S']
   ];
   suits['hearts'] = [
      ['A','H'],
      ['2','H'],
      ['3','H'],
      ['4','H'],
      ['5','H'],
      ['6','H'],
      ['7','H'],
      ['8','H'],
      ['9','H'],
      ['10','H'],
      ['J','H'],
      ['Q','H'],
      ['K','H']
   ];
   suits['diamonds'] = [
      ['A','D'],
      ['2','D'],
      ['3','D'],
      ['4','D'],
      ['5','D'],
      ['6','D'],
      ['7','D'],
      ['8','D'],
      ['9','D'],
      ['10','D'],
      ['J','D'],
      ['Q','D'],
      ['K','D']
   ];
   suits['clubs'] = [
      ['A','C'],
      ['2','C'],
      ['3','C'],
      ['4','C'],
      ['5','C'],
      ['6','C'],
      ['7','C'],
      ['8','C'],
      ['9','C'],
      ['10','C'],
      ['J','C'],
      ['Q','C'],
      ['K','C']
   ];

var t = [];
t[1] = t[2] = t[3] = t[4] = t[5] = t[6] = t[7] = [];

var playedCards =
'#waste .card,' +
'#fnd .card,' +
'#tab .card:last-child';

// table
var table = [];
table['stock'] = s;
table['waste'] = w;
table['spades'] = spades;
table['hearts'] = hearts;
table['diamonds'] = diamonds;
table['clubs'] = clubs;
table['tab'] = t;

function printToTerminal(textToPrint){
    var linebreak = document.createElement("br");
    var textNode = document.createTextNode(textToPrint); terminal.prepend(linebreak ,textNode);
}

function siteWelcome(){
    printToTerminal("Hello world!");
}

function processCommand(){
    if (commandEntry.value.toLowerCase() == "p"){
        printToTerminal("debug text");
    } else if (commandEntry.value.toLowerCase() == "clear" || commandEntry.value.toLowerCase() == "c") {
        terminal.innerHTML = '';
    } else if (commandEntry.value.toLowerCase() == "start") {
        startGame();
    }else if (commandEntry.value.toLowerCase() == "debug.deck") {
        for (var card in deck){
            printToTerminal(deck[card]);
        }
    } else {
        printToTerminal("No command found. Try 'help'")
    }

    commandEntry.value = '';
}

function startGame(){
    deck = buildDeck(deck, suits);
    deck = shuffleDeck(deck);
    table = dealDeck(deck, table);
    renderTable(table, playedCards)
}

// GAME STUFF

function buildDeck(deck, suits){
    printToTerminal("Building deck...");
    for (var suit in suits){
        suit = suits[suit];
        for (var card in suit){
            card = suit[card];
            deck.push(card);
        }
    }
    return deck;
}

function shuffleDeck(deck){
    printToTerminal("Shuffling deck...");
    var i = deck.length, temp, rand;
    while (0 !== i){
        rand = Math.floor(Math.random() * i);
        i--;

        temp = deck[i];
        deck[i] = deck[rand];
        deck[rand] = temp;
    }
    return deck;
}

function dealDeck(deck, table){
    printToTerminal("Dealing deck...");
    table['stock'] = deck; // Move all cards to stock
    var tabs = table['tab']; // Build tableau
        for (var row = 1; row <= 7; row++) {
            // loop through 7 piles in row
            for (var pile = row; pile <= 7; pile++) {
                // build blank pile on first row
                if (row === 1) tabs[pile] = [];
                    // deal card to pile
                    move(table['stock'], tabs[pile], false);
            }
        }
    return table;
}

function renderTable(table, playedCards){
    for (var card in table['stock']){
        printToTerminal(table['stock'][card]);
    }
}

function move(source, dest, pop, selectedCards = 1) {
    if (pop !== true) {
        var card = source.shift(); // take card from bottom
        dest.push(card); // push card to destination pile
    } else {
        while (selectedCards) {
            // take card from the top of selection
            var card = source[source.length - selectedCards];
            // remove it from the selected pile
            source.splice(source.length - selectedCards, 1);
            // put it in the destination pile
            dest.push(card);
            // decrement
            selectedCards--; 
        }
    }
    return;
}

commandEntry.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) { // using keycode for old browsers
        processCommand();
    }
});