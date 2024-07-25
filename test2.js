const Hyperswarm = require('hyperswarm');

const topic = Buffer.alloc(32).fill('testAuction') // Replace with your desired topic

// Terminal 2
const swarm2 = new Hyperswarm();

const joinPromise = new Promise((resolve, reject) => {
  swarm2.join(topic, { server: false, client: true }, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

joinPromise.then(() => {
  //console.log('Terminal 2: Topic announced');
})
.catch((err) => {
  //console.error('Error joining swarm:', err);
});

swarm2.on('connection', (socket, info) => {
  //console.log('Terminal 2: Connected to peer', info.client);
  // Handle incoming data from peer
  socket.on('data', (data) => {
    //console.log('Terminal 2 received:', data.toString());
  });
  // Send data to peer
  socket.write('starting hyperswarm');
});