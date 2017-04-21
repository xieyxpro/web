var squares = [];
var gameon = false;
var shuffling = false;
var blank = 15;

$(function() {
	initSquares();
	initPuzzle();

	$("#shufflebutton").click(function() {
		shuffle();
	});
});

//the constructor of square
function Square(position, identity) {
	this.position = position;
	this.identity = identity;
}

//initialize the squares
function initSquares() {
	/*_.times(15, function(n) {
		squares[n] = new Square(n, n);
	});*/
	for (var i = 0; i <= 14; i++)
		squares[i] = new Square(i, i);
	blank = 15;
}

//initialize the puzzle, add 15 squares and set the blank
function initPuzzle() {
	var tmp;
	for (var i = 0; i < squares.length; i++) {
		var top = Math.floor(i / 4) * 90;
		var left = (i % 4) * 90;
		tmp = $("<div></div>");
		tmp.click(function(i) {		//use closure
			return function() {
				move(i);
			};
		}(i));
		tmp.addClass("tile").attr("id", "square_" + i).css({"left": left + "px",
																		 "top": top + "px"}).appendTo($("#puzzlearea"));
		//set the display position of the square
		//add the square to the DOM
	}
}

//to judge whether the square can move
function canMove(i) {
	var butt_left = blank % 4,
		butt_top = Math.floor(blank / 4),
		left = squares[i].position % 4,
		top = Math.floor(squares[i].position / 4);

	if (left + 1 == butt_left && top == butt_top) return true;

	if (left - 1 == butt_left && top == butt_top) return true;

	if (left == butt_left && top - 1 == butt_top) return true;

	if (left == butt_left && top + 1 == butt_top) return true;

	return false;
}

//to let the square move to the position of the blank
function move(i) {
	if (gameon) {
		var temppos, left, top;
		if (canMove(i)) {
			temppos = squares[i].position;
			squares[i].position = blank;		//change the position of the square
			left = (blank % 4) * 90;
			top = Math.floor(blank / 4) * 90;
			$("#square_" + squares[i].identity).css({"left": left + "px",
											 "top": top + "px"});
			blank = temppos;
			if (isWin()) gameOver();
		}
	}
}

//to get the set of all the squares that can move
function getNeighbors() {
	var neighbors = [];
	for (var i = 0; i < squares.length; i++) {
		if (canMove(i)) neighbors.push(squares[i]);
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
		move(neighbors[spot].identity);
	}
	shuffling = true;		//let the function iswin() take effect
	$("#isWin").attr("id", "isWin");	//to hide the win logo
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
	$("#isWin").attr("id", "winner");	//hide the win logo
}