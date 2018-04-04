Piece = require('./../piece');
GameBoard = require('./../board');
class Knight extends Piece {
	constructor(param) {
		super(param);
		this.type = "Knight";
		this.init();
	}
	isValidMove(startx,starty,x,y) {
		if(x > GameBoard.length || y > GameBoard.height) {
			return false;
		}
		if((startx - x == -1 || startx - x == 1)&&(starty - y == -2 || starty - y == 2)) {
			return true;
		} else if((starty - y == -1 || starty - y == 1)&&(startx - x == -2 || startx - x == 2)) {
			return true;
		} else {
			return false;
		}
	}
	getPath(startx,starty,x,y) {

		var path = [];
		var first = {};
		var second = {};
		if(startx == x-1) {
			first = {x:x-1,y:y}
		}
		if(startx == x-2) {
			first = {x:x-1,y:y}
		}
		if(startx == x+1) {
			first = {x:x+1,y:y}
		}
		if(startx == x+2) {
			first = {x:x+1,y:y}
		}
		if(starty == y-1) {
			if(startx == x+2) {
				second = {x:first.x+1,y:first.y};
			} else {
				second = {x:first.x-1,y:first.y};
			}
		}
		if(starty == y-2) {
			second = {x:first.x,y:first.y-1}
		}
		if(starty == y+1) {
			if(this.x == x+2) {
				second = {x:first.x+1,y:first.y};
			} else {
				second = {x:first.x-1,y:first.y};
			}
			
		}
		if(starty == y+2) {
			second = {x:first.x,y:first.y+1}
		}
		path.push(first,second,{x:x,y:y},{x:startx,y:starty});
		return path;

	
	}
}
module.exports = Knight;