Piece = require('./piece');
GameBoard = require('./board');

class Player {
	constructor(param) {
		this.name = param.name;
		this.id = param.id;
		this.socket = param.socket;
		this.colour = param.colour;
		this.readyToStart = false;
		this.inCheck = false;

		if(this.colour == "white") {
			this.turn = true;
		} else {
			this.turn = false;
		}
		Player.list.push(this);
	}
	makeMove (piece,x,y) {
		if(this.turn) {
			piece.move(x,y);
			GameBoard.swapTurn();
		}
	}
	
}
Player.takePiece = function (piece) {
	Piece.fromID(piece.id).remove(piece);
}
Player.fromSocket = function (socket) {
	for(var i=0;i<Player.list.length;i++) {
		if(Player.list[i].socket == socket) {
			return Player.list[i];
		}
	}
}
Player.fromColour = function(colour) {
	for(var i=0;i<Player.list.length;i++) {
		if(Player.list[i].colour == colour) {
			return Player.list[i];
		}
	}
}
Player.fromSocketID = function (socketid) {
	for(var i=0;i<Player.list.length;i++) {
		if(Player.list[i].id == socketid) {
			return Player.list[i];
		}
	}
}
Player.onConnect = function(socket,username,ip) {
	console.log(username + " (" + ip + ")  joined the game");
	if(Player.list[0]) {
		var player = new Player({
			name:username,
			id:socket.id,
			socket:socket,
			colour:"Black",
		});
	} else {
		var player = new Player({
			name:username,
			id:socket.id,
			socket:socket,
			colour:"White",
		});
	}
	
	Player.sendUpdate();
	
	socket.emit('selfId', socket.id);
	
	socket.on('getAllValidMoves', function(pieceid){
		var piece = Piece.fromID(pieceid);
		var moves = piece.getAllValidMoves();
		socket.emit('allValidMoves', {piece:piece,moves:moves});	
		
	});
		
	socket.on('getPath', function(data){
		var piece = Piece.fromID(data.piece.id);
		if(piece.isValidMove(piece.x,piece.y,data.x,data.y)) {
			var path = piece.getPath(piece.x,piece.y,data.x,data.y)
			if(piece.isClearPath(path,data.x,data.y)) {
				socket.emit('path', {piece:piece,path:path});	
			} 
			
		}
	});
	
	socket.on('movePiece', function(data){
		if(Player.fromSocketID(socket.id).colour == data.piece.colour && data.x == Piece.fromID(data.piece.id).x && data.y == Piece.fromID(data.piece.id).y) {
			console.log("no same place");
			return;
		}

		
		
		if(Player.fromSocketID(socket.id).colour == data.piece.colour) {

			if(Player.fromSocketID(socket.id).inCheck) {
				if(!GameBoard.doesEvadeCheck(Player.fromSocketID(socket.id),Piece.fromID(data.piece.id),data.x,data.y)) {
					return;
				} else {
					Player.fromSocketID(socket.id).inCheck = false;
				}
			}

			if(GameBoard.positionOccupied(data.x,data.y) && GameBoard.positionOccupied(data.x,data.y).colour != Player.fromSocketID(socket.id).colour) {
				if(data.piece.type == "King" && GameBoard.kingSelfCheck(Piece.fromID(data.piece.id),data.x,data.y)) {
					return;
				}
				Player.takePiece(GameBoard.positionOccupied(data.x,data.y));
			}

			Piece.fromID(data.piece.id).move(data.x,data.y);

			if(data.piece.type == "Pawn"){
				if(data.piece.colour == "White" && data.y == 0) {
					Piece.fromID(data.piece.id).requestUpgrade(socket);
				} else if(data.piece.colour == "Black" && data.y == 7) {
					Piece.fromID(data.piece.id).requestUpgrade(socket);
				}
			}

			GameBoard.calcCheck();
		}

	});

	socket.on('upgradePiece', function(data) {
		Piece.fromID(data.piece.id).upgrade(data.choice);
	});
	
	socket.on('playerReady', function(data){
		Player.fromSocketID(socket.id).readyToStart = true;
		GameBoard.init();
	});
		
	
}
Player.allPlayersReady = function() {
	for(var i=0;i<Player.list.length;i++) {
		if(Player.list[i].readyToStart == false) {
			return false
		}
	}
	return true;
}
Player.onDisconnect = function(socket) {
	if(Player.fromSocket(socket)) {
		var player = Player.fromSocket(socket);
		console.log(player.name + " left the game");
		delete Player.fromSocket(socket);
		var index = Player.list.indexOf(player);
		if (index !== -1) Player.list.splice(index, 1);
	}
	
}
Player.sendUpdate = function() {
	
}
Player.getObjArray = function() {
	var arr = [];
	for(var i=0;i<Player.list.length;i++) {
		var p = Player.list[i];
		arr.push({
			name:p.name,
			id:p.id,
			colour:p.colour,
			turn:p.turn,
		})
	}
	return arr;
}
Player.list = [];

module.exports = Player;