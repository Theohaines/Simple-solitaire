//Command line stuff
const commandEntry = document.getElementById("commandEntry");
const terminal = document.getElementById("terminal")

//Game Vars
const suits = ['S', 'C', 'H', 'D'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const tableau = [[], [], [], [], [], [], []];
var deck = [];

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
    } else if (commandEntry.value.toLowerCase() == "Move") {
        printToTerminal("SYS.MOVE: enter the card you want to move e.g ()")
    } else if (commandEntry.value.toLowerCase() == "clear" || commandEntry.value.toLowerCase() == "c") {
        terminal.innerHTML = '';
    } else if (commandEntry.value.toLowerCase() == "start") {
        startGame();
    } else if (commandEntry.value.toLowerCase() == "debug.deck") {
        deck.forEach(card => printToTerminal(`${card.hidden ? '??' : card.value}${card.hidden ? '' : card.suit}`));
    } else if (commandEntry.value.toLowerCase() == "ls tableau") {
        tableau.forEach(pile => {
            const pileString = pile.map(card => (card.hidden ? '??' : `${card.value}${card.suit}`)).join(', ');
            printToTerminal(pileString || 'Empty');
        });
    } else {
        printToTerminal("No command found. Try 'help'")
    }

    commandEntry.value = '';
}

function startGame(){
    deck = createDeck();
    shuffle(deck);
    dealCards(deck, tableau);
}

function createDeck() {
    for (const suit of suits) {
      for (const value of values) {
        deck.push({ suit, value, hidden: true }); // Adding 'hidden' property to mark initially hidden cards
      }
    }
    return deck;
}

function shuffle(deck) {
    printToTerminal("Shuffling deck...")
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCards(deck, tableau) {
    for (let i = 0; i < tableau.length; i++) {
      for (let j = 0; j <= i; j++) {
        const card = deck.pop();
        if (j === i) card.hidden = false; // Revealing the top card in each pile
        tableau[i].push(card);
      }
    }
}

// Function to move multiple cards between tableau piles
function moveCards(sourcePile, destinationPile) {
    if (sourcePile === destinationPile) {
      console.log('Cannot move cards to the same pile.');
      return;
    }
  
    // Check if the piles are within range
    if (
      sourcePile < 1 ||
      sourcePile > tableau.length ||
      destinationPile < 1 ||
      destinationPile > tableau.length
    ) {
      console.log('Invalid pile number.');
      return;
    }
  
    const source = tableau[sourcePile - 1];
    const destination = tableau[destinationPile - 1];
  
    if (source.length === 0) {
      console.log('Source pile is empty.');
      return;
    }
  
    let movableCards = [];
    for (let i = source.length - 1; i >= 0; i--) {
      const card = source[i];
      if (card.hidden) {
        console.log('You can only move the top cards of a pile.');
        return;
      }
      movableCards.push(card);
    }
  
    destination.push(...movableCards.reverse());
    source.splice(source.length - movableCards.length);
  
    console.log(`Moved ${movableCards.length} cards from pile ${sourcePile} to pile ${destinationPile}`);
  }
  
  // Usage:
  console.log('\nBefore move:');
  console.log('Tableau:');
  tableau.forEach(pile => {
    const pileString = pile.map(card => (card.hidden ? 'Hidden' : `${card.value}${card.suit}`)).join(', ');
    console.log(pileString || 'Empty');
  });
  
  moveCards(1, 2); // Example move multiple cards from pile 1 to pile 2
  
  console.log('\nAfter move:');
  console.log('Tableau:');
  tableau.forEach(pile => {
    const pileString = pile.map(card => (card.hidden ? 'Hidden' : `${card.value}${card.suit}`)).join(', ');
    console.log(pileString || 'Empty');
  });
  

commandEntry.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) { // using keycode for old browsers
        processCommand();
    }
});