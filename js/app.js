'use strict';

var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE'
var GLUE_IMG = '🕸';
var GAMER_IMG = '<img src="img/gamer.png">';
var BALL_IMG = '<img src="img/ball.png">';
var isGameOn;
var isFirstMove;
var gGamerPos = { i: 2, j: 9 };
var gBoard;
var gInterval;
var gGlueInterval;
var gScore = 0;
var gBallCount;

function init() {
	clearInterval(gInterval);
	gBoard = buildBoard();
	isGameOn = false;
	isFirstMove = true;
	gScore = 0;
	gBallCount = 2;
	renderBoard(gBoard);
}

function buildBoard() {
	var board = [];
	// TODO: Create the Matrix 10 * 12 
	// TODO: Put FLOOR everywhere and WALL at edges
	var height = 10;
	var width = 12;
	for (var i = 0; i < height; i++) {
		board[i] = [];
		for (var j = 0; j < width; j++) {
			var cell = {
				type: FLOOR,
				gameElement: ''
			}
			if (i === 0 || j === 0 || i === height - 1 || j === width - 1) {
				cell.type = WALL;
			}
			board[i][j] = cell;
		}
	}
	// TODO: Place the gamer
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	board[3][3].gameElement = BALL;
	board[4][5].gameElement = BALL;
	board[0][6].type = FLOOR;
	board[9][6].type = FLOOR;
	board[5][0].type = FLOOR;
	board[5][11].type = FLOOR;

	// console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {
	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			} else if (currCell.gameElement === GLUE) {
				strHTML += GLUE_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	// console.log('strHTML is:');
	// console.log(strHTML);
	document.querySelector('.score').innerHTML = 'SCORE: ' + gScore;
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if (isGameOn) {
		var targetCell = gBoard[i][j];
		if (targetCell.type === WALL) return;

		// Calculate distance to ake sure we are moving to a neighbor cell
		var iAbsDiff = Math.abs(i - gGamerPos.i);
		var jAbsDiff = Math.abs(j - gGamerPos.j);

		var absDistance = jAbsDiff + iAbsDiff;

		// console.log('abs distance vetween cells:', absDistance);

		// If the clicked Cell is one of the four allowed

		if (absDistance === 1 || gGamerPos.i === 0 || gGamerPos.i === 9 || gGamerPos.j === 0 || gGamerPos.j === 11) {

			if (targetCell.gameElement === BALL) {
				gScore++;
				new Audio('/sound/chew.mp3').play();
				gBallCount--;
				if (gBallCount === 0) gameOver();
				console.log('Collecting!');
			}

			if (targetCell.gameElement === GLUE) {
				isGameOn = false;
				setTimeout(function () {
					isGameOn = true;
				}, 3000);
				renderBoard(gBoard);
			}

			// Todo: Move the gamer
			gBoard[gGamerPos.i][gGamerPos.j].gameElement = '';
			renderCell(gGamerPos, '');

			gGamerPos.i = i;
			gGamerPos.j = j;

			gBoard[i][j].gameElement = GAMER;
			renderCell(gGamerPos, GAMER_IMG);



		} else console.log('TOO FAR', iAbsDiff, jAbsDiff);
		renderBoard(gBoard);
	}
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

function handleKey(event) {

	if (isFirstMove) {
		isFirstMove = false;
		isGameOn = true;
		gInterval = setInterval(function () {
			var rndRow = getRandomInt(1, gBoard.length - 1);
			var rndCol = getRandomInt(1, gBoard[0].length - 1);
			if (gBoard[rndRow][rndCol].gameElement !== BALL && gBoard[rndRow][rndCol].gameElement !== GAMER && gBoard[rndRow][rndCol].gameElement !== GLUE) {
				gBoard[rndRow][rndCol].gameElement = BALL;
				gBallCount++;
			}
			renderBoard(gBoard);
		}, 1000);
		gGlueInterval = setInterval(function () {
			var rndRow = getRandomInt(1, gBoard.length - 1);
			var rndCol = getRandomInt(1, gBoard[0].length - 1);
			if (gBoard[rndRow][rndCol].gameElement !== BALL && gBoard[rndRow][rndCol].gameElement !== GAMER && gBoard[rndRow][rndCol].gameElement !== GLUE) {
				gBoard[rndRow][rndCol].gameElement = GLUE;
				setTimeout(function () {
					if (gBoard[rndRow][rndCol].gameElement === GAMER) {
						gBoard[rndRow][rndCol].gameElement = GAMER; 
					} else {
						gBoard[rndRow][rndCol].gameElement = '';
					}
				}, 3000);
			}
			renderBoard(gBoard);
		}, 5000);
	}

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			if (gBoard[5][0].gameElement === GAMER) {
				moveTo(5, 11);
			} else {
				moveTo(i, j - 1);
			}
			break;
		case 'ArrowRight':
			if (gBoard[5][11].gameElement === GAMER) {
				moveTo(5, 0);
			} else {
				moveTo(i, j + 1);
			}
			break;
		case 'ArrowUp':
			if (gBoard[0][6].gameElement === GAMER) {
				moveTo(9, 6);
			} else {
				moveTo(i - 1, j);
			}
			break;
		case 'ArrowDown':
			if (gBoard[9][6].gameElement === GAMER) {
				moveTo(0, 6);
			} else {
				moveTo(i + 1, j);
			}
			break;
	}
	renderBoard(gBoard);

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function gameOver() {
	isGameOn = false;
	clearInterval(gInterval);
	clearInterval(gGlueInterval);

}


function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}