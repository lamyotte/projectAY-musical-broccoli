window.WebSocket = window.WebSocket || window.MozWebSocket;

var connection = new WebSocket('ws://127.0.0.1:3000', 'echo-protocol');


var currentPlayer;
var game;

var colors = { 
    default : 'black',
    data: 'blue',
    error: 'red'
}

window.onload = function() {
    let input = document.getElementById('command')
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
      if (event.keyCode === 13) {
        // Trigger the button element with a click
        sendCommand();
      }
    });
};

function sendCommand() {
    let command = document.getElementById('command').value
    document.getElementById('command').value = '';
    document.getElementById('command').focus();
    command = command.trim();
    writeToConsole(command);
    let partials = command.split(" ");
    switch (partials[0]) {
        case 'connect': 
            sendMessage({
                target: 'authenticator',
                message: {
                    command: 'connect',
                    tag: partials[1],
                    pwd: partials[2]
                }
            })
            break;
        case 'get-decks':
            if(typeof(currentPlayer) !== 'undefined') {
                sendMessage({
                    target: 'global-manager',
                    message: {
                        command: partials[0],
                        playerId: currentPlayer.id
                    }
                })
            } 
            else {
                writeToConsole('Please connect with user', colors.error);
            }
            break;
        case 'get-cards': 
             if(typeof(currentPlayer) !== 'undefined') {
               let deck = currentPlayer.decks.find(x => x.id == partials[1]);
               if(typeof(deck) != 'undefined')
                    writeToConsole(deck.displayCards(), colors.data);
            } 
            else {
                writeToConsole('Please connect with user', colors.error);
            }
            break;
        case 'start-game':
            if(partials.length != 2) {
                writeToConsole('Please input deck id', colors.error)
                return;
            }
            if(typeof(currentPlayer) === 'undefined') {
                writeToConsole('Please connect with user', colors.error)
                return;
            }
            sendMessage({
                target: 'matchmaker',
                message: {
                    command: partials[0],
                    playerId: currentPlayer.id,
                    deckId: partials[1]
                }
            })
            break;
        case 'swap-cards': 
            let swap = partials.slice(1);
            sendMessage({
                target: 'game-manager',
                message: {
                    command: partials[0],
                    gameId: game.gameId,
                    playerId: currentPlayer.id,
                    swaps: swap
                }
            })
            break;
    }
}


function sendMessage(message) {
    connection.send(JSON.stringify(message));
}

connection.onopen = function() {
    writeToConsole("Server connection opened, input command ...", colors.default);
};

connection.onerror = function(error) {
    // an error occurred when sending/receiving data
};

/**
 * triggers when receiving message from server
 * @param  {string} message message to parse
 */
connection.onmessage = function(message) {
    try {
        let json = JSON.parse(message.data);
        console.log(json);
        if(json.message.type == 'error' || json.command == 'error') {
            writeToConsole(JSON.stringify(json.message), colors.error);
        }
        else if(json.issuer === 'sys') {
            writeToConsole(json.message, colors.data);
        } 
        else if(json.issuer == 'authenticator') {
            writeToConsole(JSON.stringify(json.message), colors.data);
            login(json.message);
        }
        else if(json.issuer == 'global-manager') {
            if(json.command == 'get-decks') {
                initDecks(json.message);
            }
        }
        else if(json.issuer === 'matchmaker') {
            writeToConsole(json.message, colors.data);
        }
        else if(json.issuer === 'game-manager') {
            if(json.command == 'init-game') {
                initGame(json.message);
            }
            else if(json.command == 'swap-cards') {
                game.hand = json.message.local.hand;
                writeToConsole("Cards swapped!", colors.data);
                game.drawGame(writeToConsole);
            }
            else if(json.command == 'swap-cards-completed') {
                writeToConsole("Adversary swapped " + json.message + " cards", colors.data);
                writeToConsole("Begin game", colors.data);
            }
        } 
        // handle incoming message
    } catch (e) {
        console.log(e);
        return;
    }
};

function initGame(data) {
    game = new Game(data);
    game.drawGame(writeToConsole);
}

function initDecks(data) {
    let decks = [];
    for(let i = 0; i < data.length; i++ ) {
        decks[i] = new Deck(data[i]);
    }
    currentPlayer.decks = decks;
    writeToConsole(currentPlayer.displayDecks(), colors.data);
}

function login(data) {
    if(data.hasOwnProperty('gamerTag'))
        currentPlayer = new Player(data);
}

/**
 * writes given message to screen
 * @param  {string} message the given message
 * @param  {string} type    the message type for display purposes
 */
function writeToConsole(message, color=colors.default) {
    let p = document.createElement("P");                       
    let t = document.createTextNode(message);
    p.style.color = color;
    p.appendChild(t);                                           
    document.getElementById("main").appendChild(p);    
}