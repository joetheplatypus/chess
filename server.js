GameBoard = require('./board');
Player = require('./player');
Piece = require('./piece');
Rook = require('./classes/rook');
King = require('./classes/king');
Knight = require('./classes/knight');
Pawn = require('./classes/pawn');
Queen = require('./classes/queen');
Bishop = require('./classes/bishop');

Player.sendUpdate = function() {
	for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('players', Player.getObjArray());
	}
}
Player.leaveUpdate = function(player) {
	for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('playerLeave', player);
	}
}
Piece.sendUpdate = function() {
	for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('pieces', Piece.list);
	}
}
Piece.takePieceUpdate = function(piece) {
	for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('takePiece', piece);
	}
}
GameBoard.turnUpdate = function() {
	for(var i in SOCKET_LIST) {
		var socket = SOCKET_LIST[i];
		socket.emit('turnUpdate', {});
	}
}

var express = require('express');
var app = express();
var serv = require('http').Server(app);
var fs = require('fs');

app.get('/',function(req,res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use ('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("server started");

var SOCKET_LIST = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	var address = socket.request.connection.remoteAddress;
	
	socket.on('signIn', function(data){
	
		if(GameBoard.gameInProgress || Player.list.length >= 2) {
			socket.emit('signInResponse', {success:false});
			return;
		}
		
		for(var i=0;i<Player.list.length;i++) {
			var p = Player.list[i];
			if(p.name == data.username) {
				socket.emit('signInResponse', {success:false,name:data.username});
				return;
			}
		}
		
		Player.onConnect(socket,data.username,address);
		socket.emit('signInResponse', {success:true});
		
		
	});
	
	socket.on('disconnect', function(){
		
		if(GameBoard.gameInProgress && Player.fromSocket(socket)) {
			Player.leaveUpdate(Player.fromSocket(socket).id);
		}
		delete SOCKET_LIST[socket.id];
		Player.onDisconnect(socket);	
		
	});
	
});






