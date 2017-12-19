let isDevelopment = process.env.NODE_ENV !== "production";
let DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3001;

let io = require('socket.io')();
let redis = require('redis');
let redisClient = redis.createClient(process.env.REDIS_URL);

if (isDevelopment) {
  // Run react-scripts-ts
  let reactScripts = require('./react-scripts-ts-custom');
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

  // Redis Client Ready
  redisClient.once('ready', function() {

    // Flush Redis DB
    redisClient.flushdb();
    console.log('Redis flushed');

    // Initialize users
    redisClient.get('chat_users', function(err, reply) {
      if (reply) {
        users = JSON.parse(reply);
        console.log('Redis users: ' + users);
      }
    });

    // Initialize messages
    redisClient.get('chat_messages', function(err, reply) {
      if (reply) {
        messages = JSON.parse(reply);
        console.log('Redis messages: ' + messages);
      }
    });
  });

let users = [];
let channels = ['general', 'development', 'random', 'project x'];
let messages = [];

// User names handling
let userNames = (function ()  {
  let names = [];

  let claim = function (name) {
    if (names.includes(name)) {
      return false;
    } else {
      names.push(name);
      return true;
    }
  };

  // Assign guest name and claim it
  let getGuestName = () => {
    let name,
      nextUserId = 1;

    do {
      name = 'User ' + nextUserId;
      nextUserId += 1;
    } while (!claim(name));

    return name;
  };

  // Serialize taken names as an array
  let get = function () {
    return names;
  };

  // Free names
  let free = function (name) {
    names = names.filter(item => item !== name)
  };

  return {
    claim: claim,
    free: free,
    get: get,
    getGuestName: getGuestName
  };
})();

// Retrieve users on current channel
function getUsersOnChannel(channel) {
  var list = [];

  for (var clientID in io.sockets.connected) {
    var socket = io.sockets.connected[clientID];
    if (socket.channels.includes(channel)) {
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
  socket.channels = channels;
  for (let channel of channels) {
    socket.join(channel); // Join channel
    socket.to(channel).emit('user:join', { // Inform others that user has joined
      users: getUsersOnChannel(channel)
    });
    console.log(name + ' joined channel #' + channel);
  }
  // Init
  socket.emit('init', {
    name: name,
    channels: channels,
    users: getUsersOnChannel(channels[0]),
    messages: messages
  });
  
  // Disconnect
  socket.on('disconnect', function () {
    userNames.free(name);
    for (let channel of socket.channels) {
      socket.to(channel).emit('user:left', {
        users: getUsersOnChannel(channel)
      });
    }
  });
  
  // Message
  socket.on('user:message', function(data) {
    console.log('#' + data.channel + ' ' + socket.username + ': ' + data.text);
    socket.to(data.channel).emit('user:message', {
      user: name,
      channel: data.channel,
      date: Date.now(),
      text: data.text
    });
  });
  
  // Change channel functionality
  socket.on('user:leaveChannel', function(data) {
    // Leave old channel
    socket.leave(data.oldChannel);
    console.log(name + ' left channel #' + data.oldChannel);

    // Inform other users that user has left
    socket.to(data.oldChannel).emit('user:left', {
      users: getUsersOnChannel(channel)
    });
    socket.to(data.oldChannel).emit('user:message', {
      user: "Server",
      channel: data.oldChannel,
      date: Date.now(),
      text: name + ' has left channel #' + data.oldChannel
    });
  });
  
  // New channel
  socket.on('user:newChannel', function(channel){
    channels.push(channel);
    console.log('New channel created by user ' + name + ' :  #' + channel);
  });
  
  socket.on('user:joinChannel', function(channel){
    socket.to(channel).emit('user:join', { // Inform others that user has joined
      users: getUsersOnChannel(channel)
    });
  });
  // Private message
  socket.on("user:privateMessage", function(data) {
    var clientID = findTargetUser(data.channel);
    console.log('Private message from ' + data.user + ' to ' + data.channel + '(' + clientID + ')');
    io.sockets.connected[clientID].emit("user:privateMessage", {
      user: data.channel,
      date: Date.now(),
      channel: data.user,
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
      socket.to(data.channel).emit('user:message', {
        user: "Server",
        channel: data.channel,
        date: Date.now(),
        text: oldName + ' has changed name to ' + name
      });
      console.log(oldName + ' has changed name to ' + name);
      
      fn(true);
    } else {
      fn(false);
    }
  });
  socket.on('user:getUsers', function(channel){
    socket.emit('channelUpdate', {
      users: getUsersOnChannel(channel)
    });
  });
});