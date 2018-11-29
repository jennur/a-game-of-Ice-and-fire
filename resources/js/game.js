// 271 Daenerys Targaryen 
// 583 Jon Snow 
// 27 Tywin Lannister
// 565 Joffrey Baratheon
// 148 Arya Stark
var body, infoModal, headline, dice, playerMessages, board, numTiles, questions, path, characters, charactersColors, 
    startRound, continueRound; 

body = document.querySelector('body');
infoModal = document.getElementsByClassName('info-modal')[0];
headline = document.getElementsByClassName('header__headline')[0];
dice = document.getElementsByClassName('dice')[0];
diceFace = document.getElementsByClassName('dice-face')[0];
playerMessages = document.getElementsByClassName('player-messages')[0];
board = document.getElementsByClassName('board')[0];

numTiles = 120; 
path = [0,1,2,3,4,5,6,7,8, //right
        20,32,44, //down
        43,42,41,40,39,38, //left
        50, //down
        49,48, //left
        60,72,84, //down
        85,86,87,88,89,90,91, //right
        103, //down
        115,116,117,118,119]; //right

questions = [];

characters = JSON.parse(localStorage.getItem('players'));
charactersColors = JSON.parse(localStorage.getItem('colors'));

class Board {
  constructor(numTiles, path){
    this.numTiles = numTiles;
    this.tiles = [];
    this.challengeTiles = [];

    this.path = path; 
    this.startTile = path[0];
    this.endTile = path[path.length-1];

    for(let i = 0; i < this.numTiles; i++){
      let tile = document.createElement('span'); 
      tile.classList.add('board__tile');
      tile.setAttribute('data-tile-number', i); 
      board.appendChild(tile);

      for(let j = 0; j < this.path.length; j++){
        if(this.path[j] === i){
          if(j === 0){
            tile.classList.add('board__tile--start');
            let startImg = document.createElement('img');
            startImg.setAttribute('src', '../assets/start.svg');
            startImg.classList.add('board__tile--image');
            tile.appendChild(startImg);
            this.startTile = tile;
          }
          else if(j === this.path.length-1){
            this.endTile = tile;
          }
          if(j !== 0 && j!== this.path.length-1){
            if(j%5 === 2 || j%12 === 0){
              tile.classList.add('board__tile--challenge');
              let questionImg = document.createElement('img');
              questionImg.setAttribute('src', '../assets/question.svg');
              questionImg.classList.add('board__tile--image');
              tile.appendChild(questionImg);
              this.challengeTiles.push(tile);
            }
            else if(j%2 === 0){
              tile.classList.add('board__tile--pathgreen');
            }
            else{
              tile.classList.add('board__tile--path');
            }
          }
          this.path[j] = tile;
        }
        this.tiles.push(tile);
      }
    }
  }
  getTileNumber(tile){
    return parseInt(tile.getAttribute('data-tile-number'));
  }
  isPathTile(tile){
    for(let i = 0; i < this.path.length; i++){
      if(tile === this.path[i]){
        return true; 
      }
    }
    return false;
  }
  getPathTile(num){
    return this.path[num];
  }
  isChallengeTile(tile){
    for(let i = 0; i < this.challengeTiles.length; i++){
      if(tile === this.challengeTiles[i]){
          return true; 
      }
    }
    return false;
  }
}

class Player{
  constructor(name, color, index, auto){
    this.board; 
    this.results = [];
    this.auto = auto;
    this.index = index;
    this.piece = document.createElement('span');
    this.piece.classList.add('player'); 
    this.piece.style.backgroundColor = color;
    this.piece.innerHTML = name.charAt(0);

    this.color = color;
    this.name = name;
  }
  addBoard(board){ 
    this.board = board; 
  }
  addToTile(tile){ 
    tile.appendChild(this.piece); 
  }
  moveForward(steps){
    let tileIndex;
    
    if(this.board.isPathTile(this.piece.parentElement)){
      tileIndex = this.board.path.indexOf(this.piece.parentElement);
      if(tileIndex + steps < this.board.path.length-1){
        this.board.path[tileIndex + steps].appendChild(this.piece);
      }
      else{
        this.board.endTile.appendChild(this.piece);
      }
    }
  }
  moveBackward(steps){
    let tileIndex;
    path = this.board.path;
    if(this.board.isPathTile(this.piece.parentElement)){
      tileIndex = this.board.path.indexOf(this.piece.parentElement);
      this.piece.parentElement.removeChild(this.piece);
      if(tileIndex - steps < this.board.path.indexOf(this.board.startTile)){
        this.board.startTile.appendChild(this.piece);
      }
      else {
        this.board.path[tileIndex - steps].appendChild(this.piece);
      }
    }
  }
  listMessage(message){
    let newMessage = document.createElement('li');
    newMessage.style.color = this.color;
    newMessage.innerHTML = message;
    playerMessages.insertBefore(newMessage, playerMessages.firstChild);
  }
  addQuestionResult(result){
    this.results.push(result);
  }
}

const player1 = new Player(characters[0].name, charactersColors[0].color, 0, false);
const player2 = new Player(characters[1].name, charactersColors[1].color, 1, true);
const players = [player1, player2];

initiateGame(players);




//Functions

/*
function buildBoardPath(steps){
  boardWidth = 12;
  boardHeight = 10; 
  
  let path = [];
  let challengeTiles = [];
  path[0] = Math.floor(Math.random()*boardWidth);
  while(steps > 0){

    steps--; 
  }
  return [path, challengeTiles]; 
}
*/



function initiateGame(players){
  const gameBoard = new Board(numTiles, path);
  for(let i = 0; i < players.length; i++){
    players[i].addBoard(gameBoard);
    players[i].addToTile(gameBoard.startTile);
  }
  dice.addEventListener('click', diceEventHandle);
}


function diceEventHandle(){
  for(let i = 0; i < players.length; i++){
    let gameManager = playGame(players[i]);
    if(gameManager === 2){
      return;
    }
    else if(gameManager === 6){
      i = i-1;
    }
    else if(gameManager){
      checkVictory(players[i]);
    }
   }
  }

  /*let victory = checkVictory();
  if(victory){
    dice.removeEventListener('click', diceEventHandle);
  }
}*/

function rollDice(){
    let result = 1 + Math.floor(Math.random()*6);
    let face;
    switch(result){
        case 1: 
          face = '../assets/dice1.svg';
          break;
        case 2:
          face = '../assets/dice2.svg';
          break;
        case 3: 
          face = '../assets/dice3.svg';
          break;
        case 4: 
          face = '../assets/dice4.svg';
          break;
        case 5: 
          face = '../assets/dice5.svg';
          break;
        case 6: 
          face = '../assets/dice6.svg';
          break;
    }
    diceFace.setAttribute('src', face);
    return result;
}

function playGame(player){
  let steps, newTile, challenge, buttonWrap, button, finalTile, path;

  steps = rollDice();
  player.moveForward(steps);
  newTile = player.piece.parentElement;
  challenge = player.board.isChallengeTile(newTile);

  if(challenge){
    player.listMessage(player.name + " moved " + steps + " steps and stepped on a challenge tile!");
    if(!player.auto){
      prepareChallenge(player,steps);
      return 2;
    }
    else{
      runAutoChallenge(player);
    }
  }
  else{
    player.listMessage(player.name + " moved " + steps + " steps.");
  }

  if(steps === 6){
    player.listMessage(player.name + ", roll dice again!");
    if(!player.auto){
      return 6;
    }
    else{
      playGame(player);
      return;
    }
  }
  
  finalTile = player.piece.parentElement;
  path = player.board.path;
  
  return(finalTile === path[path.length-1] ? true : false);
}

function prepareChallenge(player, steps){
  dice.removeEventListener('click', diceEventHandle);
  dice.classList.add('dice--inactive');
  buttonWrap = document.createElement('li');
  button = document.createElement('button');
  button.classList.add('question-button');
  button.innerHTML = "Accept challenge to continue";
  buttonWrap.appendChild(button);
  button.addEventListener('click', function(){
    askQuestion(player, steps);
    button.parentElement.removeChild(button);
  });

  playerMessages.insertBefore(buttonWrap, playerMessages.firstChild);
}
function runAutoChallenge(player){
  let result, newTile;
  result = Math.round(Math.random());

  if(result){
    player.moveForward(2);
    player.addQuestionResult("correct");
    player.listMessage(player.name + " answered correctly and moved 2 extra steps forward.");
  }
  else{
    player.moveBackward(2);
    player.addQuestionResult("wrong");
    player.listMessage(player.name + " didn't know the correct answer and moved 2 steps back.");
  }

  newTile = player.piece.parentElement;
  if(player.board.isChallengeTile(newTile)){
    player.listMessage(player.name + " stepped on another challenge tile!");
    runAutoChallenge(player);
  }
}

function askQuestion(player, steps){
  fetch('https://got-quotes.herokuapp.com/quotes')
  .then(function(response){
    return(response.json());
  })
  .then(function(data){
    questions.push(data);
    localStorage.setItem('questions', JSON.stringify(questions));

    //Creating modal elements
    let questionModal = document.getElementsByClassName('question-modal')[0];
    fadeIn(questionModal);

    let headline = document.createElement('h1'); 
    headline.classList.add('question-modal__headline');
    headline.innerHTML = "How well do you know Game of Thrones?";

    let question = document.createElement('div');
    question.classList.add('question-modal__question');
    question.innerHTML = 'Who said this: "' + data.quote + '" ? ';

    let answer = document.createElement('form');
    answer.setAttribute('id', 'answer');
    answer.setAttribute('method', 'get');
    answer.classList.add('question-modal__answer-wrapper');

    let answerInput = document.createElement('input'); 
    answerInput.setAttribute('name', 'answer'); 
    answerInput.setAttribute('type', 'text'); 
    answerInput.setAttribute('placeholder', 'Your answer here ...');
    answerInput.classList.add('question-modal__input');

    let answerSubmit = document.createElement('button');
    answerSubmit.setAttribute('type', 'sumbit');
    answerSubmit.setAttribute('form', 'answer');
    answer.setAttribute('value', 'submit');
    answerSubmit.classList.add('question-modal__submit');
    answerSubmit.innerHTML = "That's my answer!";

    answer.append(answerInput, answerSubmit);
    questionModal.append(headline, question, answer);

    let result = document.createElement('div');
    result.classList.add('question-modal__result');

    let okBtn = document.createElement('button');
    okBtn.classList.add('question-modal__ok-btn');
    okBtn.innerHTML = "OK";

    okBtn.addEventListener('click', function(){
      fadeOut(questionModal);
      while(questionModal.firstChild){
        questionModal.removeChild(questionModal.firstChild);
      }
      if(player.board.isChallengeTile(player.piece.parentElement)){
        player.listMessage(player.name + " stepped on another challenge tile!");
        prepareChallenge(player);
      }
      else{
        if(steps !== 6){
          continueRound = player.index + 1;
          for(let i = continueRound; i < players.length; i++){
            playGame(players[i]);
          }
        }
        else{ return; }
      }
    });

    answer.addEventListener('submit', function(e){
      e.preventDefault();
      questionModal.removeChild(answer);
      console.log(answerInput.value.toLowerCase() + " " + data.character.toLowerCase());

      if(answerInput.value.toLowerCase() === data.character.toLowerCase()){
        result.innerHTML = 'Correct! "' + data.character + '" said this!';
        result.classList.add('question-modal__result--correct');
        questionModal.append(result, okBtn);
        
        player.addQuestionResult("correct");
        player.moveForward(2);
        player.listMessage(player.name + " answered correctly and moved 2 extra steps!");
      }
      else{
        result.innerHTML = 'Wrong! "' + data.character + '" said this! You must move two steps back';
        result.classList.add('question-modal__result--wrong');
        questionModal.append(result, okBtn);

        player.addQuestionResult("wrong");
        player.moveBackward(2);
        player.listMessage(player.name + " didn't know the answer and moved 2 steps backwards.");
      }
      //continueRound = player.index + 1; 
    });
  });
  dice.addEventListener('click', diceEventHandle);
  dice.classList.remove('dice--inactive');
}
function checkVictory(player){
    let finalScreen, finalMessage, timer;
    finalScreen = document.createElement('div');
    finalScreen.classList.add('final-modal');
    
    finalMessage = document.createElement('h1');
    finalMessage.classList.add('final-modal__message');

    finalScreen.appendChild(finalMessage);
    body.appendChild(finalScreen);
    finalScreen.style.display = "flex";

    if(player.auto){
      finalMessage.innerHTML= "You Lost";
      finalScreen.classList.add('final-modal--lost');
      fadeIn(finalScreen);
      count = 0; 
      timer = setInterval(function(){
        count += 0.1;
        if(count > 1){
          fadeOut(finalScreen);
          clearInterval(timer);
        }
      }, 100);
    }
    else {
      finalMessage.innerHTML= "You Won";
      finalScreen.classList.add('final-modal--won');
      fadeIn(finalScreen);
      count = 0; 
      timer = setInterval(function(){
        count += 0.1;
        if(count > 1){
          fadeOut(finalScreen);
          clearInterval(timer);
        }
      }, 100);

    }
    let headline = document.createElement('h1'); 
    headline.classList.add('info-modal__headline');
    headline.innerHTML = player.name + " won the game!";

    let question = document.createElement('div');
    question.classList.add('info-modal__question');
    question.innerHTML = 'Play again?';

    let answer = document.createElement('div');
    answer.classList.add('question-modal__answer-wrapper');

    let yesBtn = document.createElement('a');
    yesBtn.setAttribute('href', 'select-character.html');
    yesBtn.classList.add('info-modal__button');
    yesBtn.innerHTML = "One more time!";

    let noBtn = document.createElement('a');
    noBtn.setAttribute('href', 'final.html');
    noBtn.classList.add('info-modal__button');
    noBtn.innerHTML = "No, take me to the score view!";

    answer.append(yesBtn, noBtn);

    infoModal.append(headline, question, answer);
    infoModal.style.display = "flex";
}

function fadeIn(element){
  element.style.display = "flex";
  let opacity, timer;
  opacity = 0;
  
  timer = setInterval(function(){
  if(opacity >= 1){
      clearInterval(timer);
  }
  element.style.opacity = opacity;
  opacity += 0.1;
  }, 20);
}

function fadeOut(element){
  let opacity, timer;
  opacity = 1;
  
  timer = setInterval(function(){ 
  if(opacity <= 0){
    element.style.display = "none";
    clearInterval(timer);
  }
  element.style.opacity = opacity;
  opacity -= 0.1;
  }, 20);
}