let player1;
let player2;
let num = 0;

let overlayTrans = document.querySelector(".overlay-board-transparent");
overlayTrans.addEventListener("click", nextRound);
function nextRound() {
  clearBoard();
  inactiveWinnerAnnouncement();
  if (num % 2 == 0) {
    do {
      changeTurn();
    } while (player1.getTurn());
    num++;
  } else {
    do {
      changeTurn();
    } while (player2.getTurn());
    num++;
  }
}

let boxes = document.querySelectorAll(".board__box");
boxes.forEach((box) => {
  box.addEventListener("click", play);
});
function play(event) {
  let element = event.target;
  if (
    element.classList.contains("played-x") ||
    element.classList.contains("played-o")
  ) {
  } else {
    let boxClassNum = element.className;
    let boxNum = Number(boxClassNum.substr(boxClassNum.length - 1));
    if (player1.getTurn()) {
      gameBoard.play(boxNum, player1);
      element.classList.add(player1.getSing());
    } else if (player2.getTurn()) {
      gameBoard.play(boxNum, player2);
      element.classList.add(player2.getSing());
    }
    changeTurn();
  }
}

function changeTurn() {
  let turn = document.querySelector(".turn__symbol");
  if (player1.getTurn()) {
    turn.classList.remove("turn__symbol-x");
    turn.classList.add("turn__symbol-o");
  } else {
    turn.classList.remove("turn__symbol-o");
    turn.classList.add("turn__symbol-x");
  }
  player1.changeTurn();
  player2.changeTurn();
}

// [0,1,2],[3,4,5],[6,7,8]
// [0,3,6],[1,4,7],[2,5,8]
// [0,4,8],[2,4,6]
const gameBoard = (() => {
  let gameBoardArray = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ];
  const play = (position, player) => {
    let playerName = player.getName();
    gameBoardArray[position] = playerName;
    console.log(gameBoardArray);
    statusCheck(player);
  };
  const statusCheck = (player) => {
    let playerName = player.getName();
    if (allEqual(playerName)) {
      console.log("win");
      player.roundWon();
      printDom(player1, player2);
      printWinner("Winner:", playerName);
      gameBoardArray = [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ];
      console.log(gameBoardArray);
      return true;
    } else if (!gameBoardArray.includes(undefined)) {
      console.log("tie");
      printWinner("Tie", null);
      player1.roundTie();
      player2.roundTie();
      printDom(player1, player2);
      gameBoardArray = [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      ];
      console.log(gameBoardArray);

      return true;
    } else {
      console.log("no win");
      return false;
    }
  };
  function allEqual(playerName) {
    let consecutive_counter = 0;
    //Rows
    for (let i = 0; i <= 6; i += 3) {
      for (let j = i; j < i + 3; j++) {
        if (gameBoardArray[j] == playerName) consecutive_counter++;
        else continue;
      }
      if (consecutive_counter == 3) {
        return true;
      } else {
        consecutive_counter = 0;
      }
    }
    // Columns
    for (let i = 0; i < 3; i++) {
      for (let j = i; j <= i + 6; j += 3) {
        if (gameBoardArray[j] == playerName) consecutive_counter++;
        else continue;
      }
      if (consecutive_counter == 3) {
        return true;
      } else {
        consecutive_counter = 0;
      }
    }
    // Diagonal
    if (
      gameBoardArray[0] == playerName &&
      gameBoardArray[4] == playerName &&
      gameBoardArray[8] == playerName
    ) {
      return true;
    } else if (
      gameBoardArray[2] == playerName &&
      gameBoardArray[4] == playerName &&
      gameBoardArray[6] == playerName
    ) {
      return true;
    }
  }

  return { play };
})();

const displayController = (() => {
  return {};
})();

const player1Input = document.getElementById("player-1");
const player2Input = document.getElementById("player-2");

function clearBoard() {
  let boxes = document.querySelectorAll(".board__box");
  for (const box of boxes) {
    box.classList.remove("played-x", "played-o");
  }
}

const player = (name, sing, turnValue) => {
  let score = 0;
  let tie = 0;
  let turn = turnValue;
  const getName = () => name;
  const roundWon = () => {
    score += 1;
  };
  const roundTie = () => {
    tie += 1;
  };
  const getScore = () => score;
  const getTie = () => tie;
  const getSing = () => sing;
  const getTurn = () => turn;
  const changeTurn = () => {
    if (turn == true) turn = false;
    else turn = true;
  };
  return {
    getName,
    roundWon,
    roundTie,
    getTie,
    getScore,
    getSing,
    getTurn,
    changeTurn,
  };
};

function createPlayer(player1Name, player2Name) {
  player1 = player(player1Name, "played-x", true);
  player2 = player(player2Name, "played-o", false);
  printDom(player1, player2);
}

let newGame = document.querySelector(".new-game");
newGame.addEventListener("click", activeForm);
let form = document.querySelector(".form__new-game");
form.addEventListener("submit", getUserInput);
function getUserInput(event) {
  event.preventDefault();
  let player1Name;
  let player2Name;
  if (player1Input.value == "" && player2Input.value == "") {
    player1Name = "Player 1";
    player2Name = "Player 2";
  } else if (player1Input.value == "") {
    player1Name = "Player 1";
    player2Name = player2Input.value;
  } else if (player2Input.value == "") {
    player1Name = player1Input.value;
    player2Name = "Player 2";
  } else {
    player1Name = player1Input.value;
    player2Name = player2Input.value;
  }
  console.log(player1Name);
  console.log(player2Name);
  createPlayer(player1Name, player2Name);
  inactiveForm();
  clearForm();
}

function printDom(player1, player2) {
  document.querySelector(".player1__name").textContent = player1.getName();
  document.querySelector(".player1__score").textContent = player1.getScore();
  document.querySelector(".player2__name").textContent = player2.getName();
  document.querySelector(".player2__score").textContent = player2.getScore();
  document.querySelector(".tie-score").textContent =
    (player1.getTie() + player2.getTie()) / 2;
}

function clearForm() {
  player1Input.value = "";
  player2Input.value = "";
}

function activeForm() {
  document.querySelector(".form").classList.add("active");
  document.querySelector(".overlay").classList.add("active");
  clearBoard();
  inactiveWinnerAnnouncement();
}
function inactiveForm() {
  document.querySelector(".form").classList.remove("active");
  document.querySelector(".overlay").classList.remove("active");
}

function activeWinnerAnnouncement() {
  document.querySelector(".winner-announcement").classList.add("active");
  document.querySelector(".overlay-board").classList.add("active");
  document.querySelector(".overlay-board-transparent").classList.add("active");
}
function inactiveWinnerAnnouncement() {
  document.querySelector(".winner-announcement").classList.remove("active");
  document.querySelector(".overlay-board").classList.remove("active");
  document
    .querySelector(".overlay-board-transparent")
    .classList.remove("active");
}
function printWinner(result, actor) {
  document.querySelector(".winner-title").textContent = result;
  document.querySelector(".round-winner").textContent = actor;
  activeWinnerAnnouncement();
}
