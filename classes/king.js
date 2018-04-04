Piece = require('./../piece');
GameBoard = require('./../board');
class King extends Piece {
	constructor(param) {
		super(param);
		this.type = "King";
		this.init();
	}
	isValidMove(startx,starty,x,y) {
		if(x > GameBoard.length || y > GameBoard.height) {
			return false;
		}
		if(startx - x <= 1 && startx - x >= -1 && starty - y <= 1 && starty - y >= -1) {
			return true;
		} else {
			return false;
		}
	}
	getPath(startx,starty,x,y) {
	
		var path = [];
		path.push({x:startx,y:starty},{x:x,y:y})
		return path;

	}
}
module.exports = King;