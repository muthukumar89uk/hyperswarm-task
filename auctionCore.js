const Hyperswarm = require('hyperswarm');
const HyperswarmRPC = require('@hyperswarm/rpc');
const auctionManager = require('./auctionManager');

const swarm = new Hyperswarm();
const topic = Buffer.from('auction'); // Replace with your desired topic

swarm.join(topic);

swarm.on('connection', (socket) => {
  const rpc = HyperswarmRPC({ socket });

  rpc.on('call', (method, args, callback) => {
    switch (method) {
      case 'createAuction':
        auctionManager.createAuction(...args);
        callback(null, 'Auction created');
        break;
      case 'placeBid':
        const result = auctionManager.placeBid(...args);
        callback(null, result);
        break;
      case 'closeAuction':
        auctionManager.closeAuction(...args);
        callback(null, 'Auction closed');
        break;
      case 'getAuction':
        const auction = auctionManager.getAuction(...args);
        callback(null, auction);
        break;
      default:
        callback(new Error('Unknown method'));
    }
  });
});

module.exports = {
  swarm, // Expose swarm for potential direct peer management
  createAuction: auctionManager.createAuction,
  placeBid: auctionManager.placeBid,
  closeAuction: auctionManager.closeAuction,
  getAuction: auctionManager.getAuction,
};