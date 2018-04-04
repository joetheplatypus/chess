Piece = require('./../piece');
GameBoard = require('./../board');
class Rook extends Piece {
	constructor(param) {
		super(param);
		this.type = "Rook";
		this.init();
	}
	isValidMove(startx,starty,x,y) {
		if(x > GameBoard.length || y > GameBoard.height) {
			return false;
		}
		if(startx == x || starty == y) {
			return true;
		} else {
			return false;
		}
	}
	getPath(startx,starty,x,y) {

		var path = [];
		if(startx == x) {
			if(starty > y) {
				var diff = starty-y
				for(var i=0;i<diff;i++) {
					path.push({
						x:x,
						y:y+i,
					})
				}
			} else {
				var diff = y-starty;
				for(var i=0;i<diff;i++) {
					path.push({
						x:x,
						y:y-i,
					})
				}
			}
		} else if(starty == y) {
			if(startx > x) {
				var diff = startx-x
				for(var i=0;i<diff;i++) {
					path.push({
						x:x+i,
						y:y,
					})
				}
			} else {
				var diff = x-startx;
				for(var i=0;i<diff;i++) {
					path.push({
						x:x-i,
						y:y,
					})
				}
			}
		}
		path.push({x:startx,y:starty})
		return path;
		
	}
}
module.exports = Rook;