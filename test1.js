const Hyperswarm = require('hyperswarm');

// Generate a random 32-byte topic
const topic = Buffer.alloc(32).fill('my-topic') // Replace with your desired topic

// Terminal 1
// Terminal 1
const swarm1 = new Hyperswarm();

const joinPromise = new Promise((resolve, reject) => {
  swarm1.join(topic, { server: true, client: false }, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});

joinPromise.then(() => {
  console.log('Terminal 1: Topic announced');
})
.catch((err) => {
  console.error('Error joining swarm:', err);
});

swarm1.on('connection', (socket, info) => {
  console.log('Terminal 1: Connected to peer', info.client);
  // Handle incoming data from peer
  socket.on('data', (data) => {
    console.log('Terminal 1 received:', data.toString());
  });
  // Send data to peer
  socket.write('Hello from Terminal 1');
});
