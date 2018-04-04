GameBoard = require('./../board');
Player = require('./../player');
Piece = require('./../piece');
Rook = require('./rook');
King = require('./king');
Knight = require('./knight');
Pawn = require('./pawn');
Queen = require('./queen');
Bishop = require('./bishop');

var classes = {Rook, Bishop, King, Pawn, Queen, Knight};

constructClass = function(name) {
    return classes[name];
}

module.exports = constructClass;