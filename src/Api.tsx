import * as openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:3001');
function subscribeToTimer(cb: any) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}
export { subscribeToTimer };