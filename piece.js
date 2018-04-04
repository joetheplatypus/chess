GameBoard = require('./board');

class Piece {
	constructor(param) {
		this.id = Math.random();
		this.x = param.x;
		this.y = param.y;
		this.type = "";
		this.colour = param.colour;
	}
	init() {
		Piece.list.push(this);
		Piece.sendUpdate();
	}
	move(x,y) {
		this.x = x;
		this.y = y;
		if(this.type == "Pawn") {
			this.firstMove = false;
		}
		Piece.sendUpdate();
		GameBoard.swapTurn();
	}
	getAllValidMoves () {
		var moves = [];
		for(var y=0;y<GameBoard.height+1;y++) {
			for(var x=0;x<GameBoard.length+1;x++) {
				if(this.isValidMove(this.x,this.y,x,y)) {
					var path = this.getPath(this.x,this.y,x,y)
					if(this.isClearPath(path,x,y)) {
						moves.push({x:x,y:y});
					} 
				}
			}
		}
		return moves;
	}
	isClearPath(path,x,y) {
		if(this.type == "Knight") {
			if(GameBoard.positionOccupied(x,y) && GameBoard.positionOccupied(x,y).colour == this.colour) {
				return false;
			}
			return true;
		}
		for(var i=0;i<path.length;i++) {
			if(x != path[i].x || y != path[i].y) {
				var px = path[i].x;
				var py = path[i].y;
				if(GameBoard.positionOccupied(px,py)) {
					if(GameBoard.positionOccupied(px,py) && GameBoard.positionOccupied(px,py).id != this.id) {
						return false;
					}
				}
			}
			
		}
		if(GameBoard.positionOccupied(x,y) && GameBoard.positionOccupied(x,y).colour == this.colour) {
			return false;
		}
		return true;
		
	}
	sendUpdate() {
		
	}
	remove() {
		var index = Piece.list.indexOf(this);
		if (index !== -1) {
			Piece.list.splice(index, 1);
		}
		Piece.takePieceUpdate(this);
	}
}

Piece.fromID = function (id) {
	for(var i=0;i<Piece.list.length;i++) {
		if(id == Piece.list[i].id) {
			return Piece.list[i];
		}
	}
}
Piece.getKings = function() {
	var arr = [];
	for(var i=0;i<Piece.list.length;i++) {
		if(Piece.list[i].type == "King") {
			arr.push(Piece.list[i]);
		}
	}
	return arr;
}

Piece.list = [];
module.exports = Piece;