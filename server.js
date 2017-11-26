const io = require('socket.io')();
var port = process.env.PORT || 3001;

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
  socket.on('user:message', function(data){
    console.log('#' + socket.channel + ' ' + socket.username + ': ' + data.text);
    socket.to(socket.channel).emit('user:message', {
      user: name,
      date: new Date(),
      text: data.text
    });
  });
  
  // Change channel functionality
  socket.on('user:changeChannel', function(channelName){
    
    // Leave old channel
		socket.leave(socket.channel);
    console.log(name + ' left channel #' + socket.channel);
    socket.to(socket.channel).emit('user:message', {
      user: "Server",
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
      date: new Date(),
      text: 'You have joined channel #' + socket.channel,
      users: getUsersOnChannel(socket.channel)
    });
    
    // Inform other users that new user has joined
		socket.to(socket.channel).emit('user:message', {
      user: "Server",
      date: new Date(),
      text: name + ' has joined channel #' + socket.channel
    });
    
    // Send join message to user
    socket.to(socket.channel).emit('user:join', {
      name: name,
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
      to: clientID,
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
        date: new Date(),
        text: oldName + ' has changed name to ' + name
      });
      
      fn(true);
    } else {
      fn(false);
    }
  });
});

// Start
io.listen(port);
console.log('Socket.io listening on *:port %d', port);
