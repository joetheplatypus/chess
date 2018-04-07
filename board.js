Rook = require('./classes/rook');
Piece = require('./piece');
Player = require('./player');
ClassConstructor = require('./classes/constructor');

GameBoard = {};
GameBoard.layout = [["BRook","BKnight","BBishop","BQueen","BKing","BBishop","BKnight","BRook"],
	["BPawn","BPawn","BPawn","BPawn","BPawn","BPawn","BPawn","BPawn"],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["","","","","","","",""],
	["WPawn","WPawn","WPawn","WPawn","WPawn","WPawn","WPawn","WPawn"],
	["WRook","WKnight","WBishop","WQueen","WKing","WBishop","WKnight","WRook"]];

GameBoard.height = GameBoard.layout.length-1;
GameBoard.length = GameBoard.layout[0].length-1;
GameBoard.gameInProgress = false;
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
	GameBoard.gameInProgress = true;
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
GameBoard.calcCheck = function(piecemoved) {
	var kings = Piece.getKings();
	for(var i=0;i<kings.length;i++) {
		var player = Player.fromColour(kings[i].colour);
		if(GameBoard.kingInCheck(kings[i])) {
			player.inCheck = true;
			console.log("player " + player.name + " in check");
			if(GameBoard.inCheckMate(player,piecemoved)) {
				Player.inCheckMate(player);
			}
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
GameBoard.kingSelfCheck = function(piece,x,y) { //not working

	var result = false;

	var kings = Piece.getKings();
	var king = {};
	for(var i=0;i<kings.length;i++) {
		if(kings[i].colour == piece.colour) {
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
		result =  true;
	} else {
		result =  false;
	}

	piece.x = tempx;
	piece.y = tempy;
	if(occPiece != {}) {
		occPiece.x = occtempx;
		occPiece.y = occtempy;
	}

	return result;
}
GameBoard.inCheckMate = function(player,piecemoved) {

	//check for possible move
	for(var i=0;i<Piece.list.length;i++) {
		var piece = Piece.list[i];
		if(piece.colour == player.colour) {
			var moves = piece.getAllValidMoves();
			for(var j=0;j<moves.length;j++) {
				if(GameBoard.doesEvadeCheck(player,piece,moves[j].x,moves[j].y)) {
					return false;
				}
			}
		}	
	}

	return true;
}
GameBoard.filterLegalMoves = function (piece,_moves) {
	var moves = [];
	for(var i=0;i<_moves.length;i++) {
		if(GameBoard.kingSelfCheck(piece,_moves[i].x,_moves[i].y)) {
			moves.push({x:_moves[i].x,y:_moves[i].y,legal:false});
		} else {
			moves.push({x:_moves[i].x,y:_moves[i].y,legal:true});
		}
	}
	return moves;
}
GameBoard.isLegalMove = function(piece,x,y) {
	if(GameBoard.kingSelfCheck(piece,x,y)) {
		return false;
	} else {
		return true;
	}
}
module.exports = GameBoard;