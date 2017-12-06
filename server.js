const isDevelopment = process.env.NODE_ENV !== "production";
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3001;

var io = require('socket.io')();

if (isDevelopment) {
  // Run react-scripts-ts
  var reactScripts = require('./react-scripts-ts-custom');
  // Start Socket.IO
  io.listen(DEFAULT_PORT);
  console.log('Socket.io listening on *:port %d', DEFAULT_PORT);
} else {
  const express = require('express');
  const path = require('path');
  const app = express();  
  const server = require('http').createServer(app);  
  io = require('socket.io')(server);

  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('/', function(req, res,next) {  
      res.sendFile(__dirname + '/index.html');
  });

  server.listen(DEFAULT_PORT);  
}

// Default rooms
var channels = ['general', 'development', 'random', 'project x'];

// User names handling
var userNames = (function () {
  var names = {};

  var claim = function (name) {
    if (!name || names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  };

  // Assign guest name and claim it
  var getGuestName = function () {
    var name,
      nextUserId = 1;

    do {
      name = 'User ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // Serialize claimed names as an array
  var get = function () {
    var res = [];
    for (user in names) {
      res.push(user);
    }

    return res;
  };

  // Free names
  var free = function (name) {
    if (names[name]) {
      delete names[name];
    }
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
}());

// Retrieve users on current channel
function getUsersOnChannel(channel) {
  var list = [];

  for (var clientID in io.sockets.connected) {
    var socket = io.sockets.connected[clientID];
    if(socket.channel == channel) {
      list.push(socket.username)
    }
  }
  return list
}

// Retrieve specific user by name
function findTargetUser(user) {
  var client = '';

  for (var clientID in io.sockets.connected) {
    var socket = io.sockets.connected[clientID];
    if(socket.username == user) {
      client = socket.id;
    }
  }
  return client;
}

// Connection
io.on('connection', function (socket) {
  var name = userNames.getGuestName();
  socket.username = name;
  var address = socket.handshake.address;
  socket.channel = 'general'
  socket.join(socket.channel);
  
  // Init
  socket.emit('init', {
    name: name,
    channel: socket.channel,
    channels: channels,
    users: getUsersOnChannel(socket.channel)
  });
  
  console.log(name + ' joined channel #' + socket.channel);
  socket.emit('channelUpdate', {
    user: "Server",
    channel: socket.channel,
    date: new Date(),
    text: 'You have joined channel #' + socket.channel,
    users: getUsersOnChannel(socket.channel)
  });
  
  // Inform others that user has joined
  socket.to(socket.channel).emit('user:join', {
    name: name,
    address: address
  });

  // Disconnect
  socket.on('disconnect', function () {
    socket.to(socket.channel).emit('user:left', {
      name: name
    });
    userNames.free(name);
  });
  
  // Message
  socket.on('user:message', function(data) {
    console.log('#' + socket.channel + ' ' + socket.username + ': ' + data.text);
    socket.to(socket.channel).emit('user:message', {
      user: name,
      channel: socket.channel,
      date: new Date(),
      text: data.text
    });
  });
  
  // Change channel functionality
  socket.on('user:changeChannel', function(channelName) {
    
    // Leave old channel
    socket.leave(socket.channel);
    console.log(name + ' left channel #' + socket.channel);
    socket.to(socket.channel).emit('user:message', {
      user: "Server",
      channel: socket.channel,
      date: new Date(),
      text: name + ' has left channel #' + socket.channel
    });
    
    // Inform other users that user has left
    socket.to(socket.channel).emit('user:left', {
      name: name
    });
    
    // Join new channel
    socket.channel = channelName;
    socket.join(socket.channel);
    console.log(name + ' joined channel #' + socket.channel);
    socket.emit('channelUpdate', {
      user: "Server",
      channel: socket.channel,
      date: new Date(),
      text: 'You have joined channel #' + socket.channel,
      users: getUsersOnChannel(socket.channel)
    });
    
    // Inform other users that new user has joined
    socket.to(socket.channel).emit('user:message', {
      user: "Server",
      channel: socket.channel,
      date: new Date(),
      text: name + ' has joined channel #' + socket.channel
    });
    
    // Send join message to user
    socket.to(socket.channel).emit('user:join', {
      name: name,
      channel: socket.channel,
      address: address
    });
  });
  
  // New channel
  socket.on('user:newChannel', function(channelName){
    channels.push(channelName);
    console.log('New channel created by user ' + name + ' :  #' + socket.channel);
  });
    
  // Private message
  socket.on("user:privateMessage", function(data) {
    console.log('Private message from ' + data.user + ' to ' + data.to);
    var clientID = findTargetUser(data.to);
    io.sockets.connected[clientID].emit("user:privateMessage", {
      user: data.user,
      date: new Date(),
      channel: data.to,
      text: data.text
    });
   });
  
  //Name change - may fail if name is already in use
  socket.on('user:changeName', function(data, fn) {
    if (userNames.claim(data.name)) {
      var oldName = name;
      userNames.free(oldName);

      name = data.name;
      socket.username = data.name;
      socket.broadcast.emit('user:changeName', {
        oldName: oldName,
        newName: name
      });
      // Inform other users that user has changed name
      socket.to(socket.channel).emit('user:message', {
        user: "Server",
        channel: socket.channel,
        date: new Date(),
        text: oldName + ' has changed name to ' + name
      });
      
      fn(true);
    } else {
      fn(false);
    }
  });
});