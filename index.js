const DODGER = document.getElementById('dodger'); // div inside GAME
const GAME = document.getElementById('game'); // div inside body
const GAME_HEIGHT = 400; // sets height of GAME div
const GAME_WIDTH = 400; // sets width of GAME div
const LEFT_ARROW = 37; // assigns name to key number; use e.which!
const RIGHT_ARROW = 39; // ditto; use e.which!
const START = document.getElementById('start'); // link inside GAME

const ROCKS = []; // array to contain rocks

var gameInterval = null; // not sure what this does

function checkCollision(rock) { // check to see if the rock hit the dodger
  const top = positionToInteger(rock.style.top); // top of rock

  // rocks are 20px high
  // DODGER is 20px high
  // GAME_HEIGHT - 20 - 20 = 360px;
  if (top > 360) {
    // if position of top of rock > empty space
    // then determine areas that rock and dodger occupy
    const dodgerLeftEdge = positionToInteger(DODGER.style.left);
    const dodgerRightEdge = dodgerLeftEdge + 40;
    const rockLeftEdge = positionToInteger(rock.style.left);
    const rockRightEdge = rockLeftEdge + 20;

    return (
      (rockLeftEdge <= dodgerLeftEdge && rockRightEdge >= dodgerLeftEdge) ||
      (rockLeftEdge >= dodgerLeftEdge && rockRightEdge <= dodgerRightEdge) ||
      (rockLeftEdge <= dodgerRightEdge && rockRightEdge >= dodgerRightEdge)
    );
  }
}

function createRock(x) {
  const rock = document.createElement('div'); // create new div

  rock.className = 'rock'; // give it the classname rock
  rock.style.left = `${x}px`; // set horizontal pos to integer passed in

  var top = rock.style.top = 0; // set its top to 0

  GAME.appendChild(rock); // add the rock to the HTML file

  function moveRock() {
    rock.style.top = `${top += 2}px`;

    if (checkCollision(rock)) { // if function returns true, end game
      return endGame();
    }

    if (top < GAME_HEIGHT) {
      window.requestAnimationFrame(moveRock);
    } else {
      rock.remove(); // get rid of the rock when it drops out of frame
    }
  }

  window.requestAnimationFrame(moveRock); // agh! recursion!

  ROCKS.push(rock);

  return rock;
}

function endGame() {
  clearInterval(gameInterval); // resets the interval?

  ROCKS.forEach(function(rock) { rock.remove(); }); // get rid of rocks

  document.removeEventListener('keydown', moveDodger); // stop listening

  START.innerHTML = 'Play again?';
  START.style.display = 'inline';

  return alert('YOU LOSE!');
}

function moveDodger(e) {
  const code = e.which;

  if ([LEFT_ARROW, RIGHT_ARROW].indexOf(code) > -1) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (code === LEFT_ARROW) {
    moveDodgerLeft();
  } else if (code === RIGHT_ARROW) {
    moveDodgerRight();
  }
}

function moveDodgerLeft() {
  window.requestAnimationFrame(function() {
    const left = positionToInteger(DODGER.style.left);

    if (left > 0) {
      DODGER.style.left = `${left - 4}px`;
    }
  });
}

function moveDodgerRight() {
  window.requestAnimationFrame(function() {
    const left = positionToInteger(DODGER.style.left);

    if (left < 360) {
      DODGER.style.left = `${left + 4}px`;
    }
  });
}

function positionToInteger(p) {
  // splits string into array of substrings
  return parseInt(p.split('px')[0]) || 0 ;
}

function start() {
  document.addEventListener('keydown', moveDodger);

  START.style.display = 'none';

  gameInterval = setInterval(function() {
    // create rock with a random integer within GAME frame
    // and run it at intervals of 1 second
    createRock(Math.floor(Math.random() * (GAME_WIDTH-20))) }, 1000) ;
}
