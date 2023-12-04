const { table } = require("console");

//Command line stuff
const commandEntry = document.getElementById("commandEntry");
const terminal = document.getElementById("terminal")

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

commandEntry.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) { // using keycode for old browsers
        processCommand();
    }
});