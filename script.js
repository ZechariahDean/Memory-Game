const gameContainer = document.getElementById("game");
const score = document.createElement('h2');
const bestScore = document.createElement('h2');
score.innerText = 'Score: [0]';
let scoreValue = 0;

// function to increment or set score to value.
function scoreMod(setScore)
{
  if (setScore !== undefined)
  {
    score.innerText = `Score: [${setScore}]`;
    scoreValue = setScore;
  } else
  {
    scoreValue++;
    score.innerText = `Score: [${scoreValue}]`
  }
}

bestScore.innerText = `BestScore [${localStorage.getItem('Best Score')}]`;

gameContainer.prepend(score);
gameContainer.prepend(bestScore);

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "gray",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "gray"
];


// create form for asking user for difficulty
document.addEventListener('click', function(e)
{
  e.preventDefault();
  if (e.target.id !== 'submit')
    return;
  const diff = [];
  const num = Number(document.querySelector('#diff-val').value);
  document.querySelector('#diff-val').value = '';
  for (let i = 0; i < num; i++)
  {
    const rand = Math.floor(Math.random() * 14);
    diff.push(COLORS[rand]);
    diff.push(COLORS[rand]);
  }
  restart(diff);

})






// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// create start button
const start = document.createElement('button');
start.innerText = 'START';
start.id = 'start';

// append it to the body
document.querySelector('body').appendChild(start);

document.querySelector('#start').addEventListener('click', function()
{
  if (document.querySelector('#game').classList.contains('begun'))
    return;
  document.querySelector('#game').classList.add('begun');
  document.querySelector('#game').classList.toggle('hidden');
  document.querySelector('#start').classList.toggle('hidden');
})


// function to restart the game
function restart(arr) 
{
  shuffledColors = shuffle(arr);
  document.querySelector('#game').innerHTML = '';
  createDivsForColors(shuffledColors);
  scoreMod(0);

  gameContainer.prepend(score);
  gameContainer.prepend(bestScore);
}

// call restart on clicking restart button
document.querySelector('body').addEventListener('click', function(e) 
{
  if (e.target.id === 'restart')
  {
    restart(COLORS);
    document.querySelector('#game').classList.toggle('hidden');
    document.querySelector('#game').classList.toggle('begun');
    document.querySelector('#start').classList.toggle('hidden');
  }
})


// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  // console.log("you just clicked", event.target);

  // check if game has begun
  if (!(document.querySelector('#game').classList.contains('begun')))
    return;

  // check if there are fewer than 2 cards that have been clicked
  if (document.querySelectorAll('.flipped').length >= 2)
    return;

  // add flipped class to clicked card if it isn't solved
  if (!(event.target.classList.contains('solved')))
    event.target.classList.add('flipped');

  event.target.style.backgroundColor = event.target.classList[0];

  // if two cards have been flipped
  if (document.querySelectorAll('.flipped').length !== 2)
    return;

  // set cards to equal an array of all cards with the flipped property
  let cards = document.querySelectorAll('.flipped');
  // check if cards are identical to eachother
  setTimeout(function()
  {
    if (cards[0].classList.toString() === cards[1].classList.toString())
    {
      // set all identical cards to have the solved class and remove the flipped class
      scoreMod();
      for (let i of cards)
      {
        i.classList.toggle('solved');
        i.classList.toggle('flipped');
        i.removeEventListener("click", handleCardClick);
      }
      if (document.querySelectorAll('.solved').length === shuffledColors.length)
      {
        const btn = document.createElement('button');
        btn.innerText = ('RESTART?');
        btn.id = 'restart';
        gameContainer.appendChild(btn);
        alert('YOU WIN!');
        if (parseInt(localStorage.getItem('Best Score')) > scoreValue || localStorage.getItem('Best Score') === null)
          localStorage.setItem('Best Score', `${scoreValue}`);
      }
      // if not flip the cards
    }else
    {
      for (let i of cards)
      {
        i.classList.toggle('flipped');
        i.style.backgroundColor = '';
      }
      scoreMod();
    }
  }, 1000)
}

// when the DOM loads
createDivsForColors(shuffledColors);
