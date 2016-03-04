import _ from 'lodash';

import * as protocol from './protocol';
import Room from './Room';
import Player from './Player';

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 8080 });


var rooms = [];

function openRoom() {
  var l = _.last(rooms);
  if(l && !l.started)
    return l;
  else {
    var r = new Room();
    rooms.push(r);
    return r;
  }
}

var players = [];

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

wss.on('connection', function(ws) {
  var player = new Player(ws);
  players[player.id] = player;
  var room;

  ws.on('message', function(message) {
    var msg = JSON.parse(message);
    switch (msg.type) {
      case protocol.NAME:
        player.name = msg.data;
        room = openRoom();
        room.addPlayer(player);
        break;
      case protocol.START_GAME:
        if(room)
          room.start();
        break;
      case protocol.CAST_SPELL:
        room.spellCast(player, msg);
        break;
    }
  });
});
