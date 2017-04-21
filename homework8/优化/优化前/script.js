var squares = [];
var gameon = false;
var shuffling = false;
var parea,
	shufflebutt,
	blank,
	winbut;

document.addEventListener('DOMContentLoaded', function() {
	parea = document.getElementById('puzzlearea');
	shufflebutt = document.getElementById('shufflebutton');
	winbut = document.getElementById('isWin');

	initSquares();
	initPuzzle();

	shufflebutt.addEventListener('click', shuffle);

});

//the constructor of square
function Square(position, identity) {
	this.position = position;
	this.identity = identity;
}

//initialize the squares
function initSquares() {
	squares = [];
	for (var i = 0; i <= 14; i++)
		squares[i] = new Square(i, i);
	blank = 15;
}

//initialize the puzzle, add 15 squares and set the blank
function initPuzzle() {
	var tmp, that, top, left;

	for (var i = 0; i < squares.length; i++) {
		that = squares[i];
		if (that) {
			top = Math.floor(i / 4) * 90;
			left = (i % 4) * 90;
			tmp = document.createElement("div");
			tmp.className = "tile";
			tmp.id = "square_" + i;
			tmp.style.left = left + "px";	//set the display position of the square
			tmp.style.top = top + "px";
			tmp.addEventListener("click", that.move.bind(that));
			parea.appendChild(tmp);			//add the square to the DOM
		} else {
			blank = i;
		}
	}
}

//to judge whether the square can move
Square.prototype.canMove = function() {
	var butt_left = blank % 4,
		butt_top = Math.floor(blank / 4),
		left = this.position % 4,
		top = Math.floor(this.position / 4);

	if (left + 1 == butt_left && top == butt_top) return true;

	if (left - 1 == butt_left && top == butt_top) return true;

	if (left == butt_left && top - 1 == butt_top) return true;

	if (left == butt_left && top + 1 == butt_top) return true;

	return false;
};

//to let the square move to the position of the blank
Square.prototype.move = function() {
	if (gameon) {
		var element, temppos, left, top;
		if (this.canMove()) {
			element = document.getElementById('square_' + this.identity);
			temppos = this.position;
			this.position = blank;		//change the position of the square
			left = (blank % 4) * 90;
			top = Math.floor(blank / 4) * 90;
			element.style.left = left + 'px';	//set the new display position of the square
			element.style.top = top + 'px';
			blank = temppos;			//move the blank
			if (isWin()) gameOver();	//judge
		}
	}
};

//to get the set of all the squares that can move
function getNeighbors() {
	var neighbors = [];
	for (var i = 0; i < squares.length; i++) {
		if (squares[i].canMove()) neighbors.push(squares[i]);
	}
	return neighbors;
}

//to shuffle the puzzle and start the game
function shuffle() {
	var neighbors, spot;
	gameon = true;
	shuffling = false;	//to avoid the win logo appear now
	for (var i = 0; i < 500; i++) {
		neighbors = getNeighbors();
		spot = Math.floor(Math.random() * neighbors.length);
		squares[neighbors[spot].identity].move();
	}
	shuffling = true;		//let the function iswin() take effect
	winbut.id = "isWin";	//to hide the win logo
}

//to judge whether the player wins
function isWin() {
	//only after the game has been started and shuffling that we judge
	if (gameon && shuffling) {
		for (var i = 0; i < squares.length; i++) {
			if (squares[i].position !== squares[i].identity) return false;
		}
		return true;
	}
}

//end the game
function gameOver() {
	gameon = false;
	winbut.id = "winner";	//hide the win logo
}