const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

//functions
var SOCKET_LIST = {};
var ROOM_LIST = {};

function idFind(socket){
  for(var i in SOCKET_LIST){
    if(socket.id == SOCKET_LIST[i].id){
      return i;
    }
  }
}

function roomFind(socket, room){
  for(var i in ROOM_LIST){
    if(ROOM_LIST[i].roomID == room){
      socket.join(room);
      return;
    }
  }
  var j = 0;
  while(ROOM_LIST[j]){
    j++;
  }
  socket.join(room);
  ROOM_LIST[j] = io.sockets.adapter.rooms[room];
  ROOM_LIST[j].roomID = room;
}

function kick(user){
  //disconnect user, send to their socket a kick msg
  //if not found, log them not found
}

//Socket Business

io.on('connection', function(socket){
  var i = 0;
  while(SOCKET_LIST[i]){
    i++;
  }
  SOCKET_LIST[i] = socket;
  console.log(i);

  socket.on('login', function(data){
    var roomname = roomFind(socket, data.room);
    var id = SOCKET_LIST[idFind(socket)];
    if(data.username == ''){
      id.user = 'Guest ' + idFind(socket).toString();
      id.roomID = data.room;
    }
    else{
      id.user = data.username;
      id.roomID = data.room;
    }
    if(data.password == "123"){
      id.admin=true;
    }
    socket.emit('loginResp', {success: true});
    socket.emit('message', data.user + " has connected!")
  });

  socket.on('disconnect', function(){
    //change emit to admin msg?
    id = idFind(socket);
    console.log(SOCKET_LIST[id].user + " has disconnected!");
    io.to(SOCKET_LIST[id].roomID).emit('message', SOCKET_LIST[id].user + " has disconnected!");
    delete SOCKET_LIST[id];
  });

  socket.on('message', function(text){
    var id = SOCKET_LIST[idFind(socket)];
    if(id.admin && text[0] == "/"){
      var msg = eval(text.slice(1));
      socket.emit('eval', msg);
    }
    else{
      io.to(id.roomID).emit('message', id.user + ": " + text);
    }
    //io.emit('message', id.user + ": " + text);
  });

});

server.on('error', function(err){
  console.error('Server Error: ', err);
});

server.listen(2000, () => {
  console.log('RPS Start on 2000');
});
