Rook = require('./classes/rook');
Piece = require('./piece');
Player = require('./player');
ClassConstructor = require('./classes/constructor');

GameBoard = {};
GameBoard.height = 7;
GameBoard.length = 7;
GameBoard.layout = [["BRook","BKnight","BBishop","BKing","BQueen","BBishop","BKnight","BRook"],
	["BPawn","BPawn","BPawn","BPawn","BPawn","BPawn","BPawn","BPawn"],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["WPawn","WPawn","WPawn","WPawn","WPawn","WPawn","WPawn","WPawn"],
	["WRook","WKnight","WBishop","WQueen","WKing","WBishop","WKnight","WRook"]];
GameBoard.swapTurn = function () {
	for(var i=0;i<Player.list.length;i++) {
		Player.list[i].turn = !Player.list[i].turn
	}
	GameBoard.turnUpdate();
}
GameBoard.init = function() {
	if(!Player.allPlayersReady()) {
		return;
	}
	for(var i=0;i<GameBoard.layout.length;i++) {
		for(var j=0;j<GameBoard.layout[i].length;j++) {
			var colour;
			var type;
			if(GameBoard.layout[i][j].substr(0,1) == "W") {
				colour = "White";
			} else if(GameBoard.layout[i][j].substr(0,1) == "B") {
				colour = "Black";
			}
			type = GameBoard.layout[i][j].substr(1);
			if(type != "") {
				var newPieceClass = ClassConstructor(type);
				new newPieceClass({x:j,y:i,colour:colour});
			}
		}
	}
}
GameBoard.positionOccupied = function(x,y) {
	for(var i=0;i<Piece.list.length;i++) {
		if(Piece.list[i].x == x && Piece.list[i].y == y) {
			return Piece.list[i];
		}
	}
	return false;
}
//checks for check and checkmate
GameBoard.calcCheck = function() {
	var kings = Piece.getKings();
	for(var i=0;i<kings.length;i++) {
		if(GameBoard.kingInCheck(kings[i])) {
			Player.fromColour(kings[i].colour).inCheck = true;
			console.log("player " + Player.fromColour(kings[i].colour).name + " in check")
		}
	}
}
GameBoard.kingInCheck = function(king) {
	for(var i=0;i<Piece.list.length;i++) {
		var piece = Piece.list[i];
		if(piece.colour == king.colour) {
			continue;
		}
		var availMoves = piece.getAllValidMoves();
		for(var j=0;j<availMoves.length;j++) {
			var move = availMoves[j];
			if(move.x == king.x && move.y == king.y && piece.colour != king.colour) {
				return true;
			}
		}	
	}
	return false;
}
GameBoard.doesEvadeCheck = function(player,piece,x,y) {

	var result = false;

	var kings = Piece.getKings();
	var king = {};
	for(var i=0;i<kings.length;i++) {
		if(kings[i].colour == player.colour) {
			king = kings[i];
		}
	}
	const tempx = piece.x
	const tempy = piece.y

	var occtempx;
	var occtempy;

	var occPiece = {}
	if(GameBoard.positionOccupied(x,y)) {
		occPiece = GameBoard.positionOccupied(x,y)
		occtempx = occPiece.x;
		occtempy = occPiece.y;
		occPiece.x = 100;
		occPiece.y = 100;		
	}

	piece.x = x;
	piece.y = y;

	if(GameBoard.kingInCheck(king)) {
		result =  false;
	} else {
		result =  true;
	}

	piece.x = tempx;
	piece.y = tempy;
	if(occPiece != {}) {
		occPiece.x = occtempx;
		occPiece.y = occtempy;
	}

	return result;
}
GameBoard.kingSelfCheck = function(king,x,y) {

	var result = false;

	const tempx = king.x
	const tempy = king.y

	var occtempx;
	var occtempy;

	var occPiece = {}
	if(GameBoard.positionOccupied(x,y)) {
		occPiece = GameBoard.positionOccupied(x,y)
		occtempx = occPiece.x;
		occtempy = occPiece.y;
		occPiece.x = 100;
		occPiece.y = 100;		
	}

	king.x = x;
	king.y = y;

	if(GameBoard.kingInCheck(king)) {
		result =  true;
	} else {
		result =  false;
	}

	king.x = tempx;
	king.y = tempy;
	if(occPiece != {}) {
		occPiece.x = occtempx;
		occPiece.y = occtempy;
	}

	return result;
}
module.exports = GameBoard;