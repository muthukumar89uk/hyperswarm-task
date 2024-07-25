const Hyperswarm = require('hyperswarm');
const topic = Buffer.alloc(32).fill('testAuction');

const auctionModule = require('./auctionCore'); // Replace with the correct path

const auctionId = 'f5e2953f-4bf5-4d8d-8688-748bbe3dd73b';
const bidderId = 'xoxxo'; // Replace with the actual bidder ID
const bidAmount = 100; // Replace with the desired bid amount

const swarm1 = new Hyperswarm();

async function main() {
  try {
    const result = await auctionModule.placeBid(auctionId, bidderId, bidAmount);
    
    console.log(result);

    swarm1.on('connection', (socket, info) => {
      console.log('bidder 1: Connected to peer', info.client);
      // Handle incoming data from peer
      socket.on('data', (data) => {
        console.log('bidder 1 received:', data.toString());
      });
      // Send data to peer
      socket.write(`Bidder 1 bidding ${bidAmount}`);
    });
  
  } catch (error) {
    console.error('Error placing bid:', error);
  }
}

main();

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



  
  