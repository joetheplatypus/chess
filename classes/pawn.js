Piece = require('./../piece');
GameBoard = require('./../board');
ClassConstructor = require('./constructor');

class Pawn extends Piece {
	constructor(param) {
		super(param);
		this.type = "Pawn";
		this.upgrades = ["Queen","Bishop","Rook","Knight"];
		this.init();
		this.firstMove = true;
	}
	isValidMove(startx,starty,x,y) {
		if(x > GameBoard.length || y > GameBoard.height) {
			return false;
		}
		if(this.colour == "White") {
			if(startx == x && starty == y+1 && !GameBoard.positionOccupied(x,y)) {
				return true;
			}
			if(startx == x+1 && starty == y+1 && GameBoard.positionOccupied(x,y) && GameBoard.positionOccupied(x,y).colour != this.colour) {
				return true;
			}
			if(startx == x-1 && starty == y+1 && GameBoard.positionOccupied(x,y) && GameBoard.positionOccupied(x,y).colour != this.colour) {
				return true;
			}
			if(startx == x && starty == y+2 && this.firstMove && !GameBoard.positionOccupied(x,y)) {
				return true;
			}
		} else if(this.colour == "Black") {
			if(startx == x && starty == y-1 && !GameBoard.positionOccupied(x,y)) {
				return true;
			}
			if(startx == x+1 && starty == y-1 && GameBoard.positionOccupied(x,y) && GameBoard.positionOccupied(x,y).colour != this.colour) {
				return true;
			}
			if(startx == x-1 && starty == y-1 && GameBoard.positionOccupied(x,y) && GameBoard.positionOccupied(x,y).colour != this.colour) {
				return true;
			}
			if(startx == x && starty == y-2 && !GameBoard.positionOccupied(x,y)&& this.firstMove) {
				return true;
			}
		}
		return false;
	}
	getPath(startx,starty,x,y) {

		var path = [];
		var diff = starty-y;
		for(var i=0;i<diff;i++) {
			path.push({x:x,y:y+i});
		}
		for(var i=0;i>diff;i--) {
			path.push({x:x,y:y+i});
		}
		path.push({x:startx,y:starty});
		return path;

	}
	requestUpgrade(socket) {
		socket.emit('chooseUpgradePiece', {piece:this,choices:this.upgrades});
	}
	upgrade(type) {
		var newPieceClass = ClassConstructor(type);
		new newPieceClass({x:this.x,y:this.y,colour:this.colour});
		this.remove();
	}
}
module.exports = Pawn;