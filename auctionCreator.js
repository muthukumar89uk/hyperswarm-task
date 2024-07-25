const Hyperswarm = require('hyperswarm');
const auctionCore = require('./auctionCore');

// Usage:
const topic = Buffer.alloc(32).fill('testAuction');

const swarm1 = new Hyperswarm();

async function createAuction() {
  try {
    const auctionId = await auctionCore.createAuction('Product X', 50);
    console.log('Auction created with ID:', auctionId);

    swarm1.on('connection', (socket, info) => {
      console.log('auction creator Connected to peer', info.client);
      // Handle incoming data from peer
      socket.on('data', (data) => {
        console.log('creator received:', data.toString());
      });
      // Send data to peer
      socket.write(`Hello from Auctioncreator with auction ID ${auctionId} `);
    });

  } catch (error) {
    console.error('Error creating auction:', error);
  }
}

createAuction()

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