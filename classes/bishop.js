Piece = require('./../piece');
GameBoard = require('./../board');
class Bishop extends Piece {
	constructor(param) {
		super(param);
		this.type = "Bishop";
		this.init();
	}
	isValidMove(startx,starty,x,y) {

		if(x > GameBoard.length || y > GameBoard.height) {
			return false;
		}
		if(startx - x == y - starty) {
			return true;
		}
		if(startx - x == starty - y) {
			return true;
		}
		return false;
	}
	getPath(startx,starty,x,y) {
		var path = [];
		if(startx - x == y-starty) {
			var diff = startx - x;
			for(var i=0;i<diff;i++) {
				path.push({x:x+i,y:y-i});
			}
			for(var i=0;i>diff;i--) {
				path.push({x:x+i,y:y-i});
			}
		} else if(startx - x == starty - y) {
			var diff = startx - x;
			for(var i=0;i<diff;i++) {
				path.push({x:x+i,y:y+i});
			}
			for(var i=0;i>diff;i--) {
				path.push({x:x+i,y:y+i});
			}
		}
		path.push({x:startx,y:starty})
		return path;

	}
}
module.exports = Bishop;