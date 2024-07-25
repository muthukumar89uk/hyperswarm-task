const Auction = require('./auction');
const uuid = require('uuid');
const HyperswarmRPC = require('@hyperswarm/rpc');
const Hyperswarm = require('hyperswarm');
const Hypercore = require('hypercore');
const Hyperbee = require('hyperbee');
const RAM = require('random-access-memory')

var fs = require('mz/fs')
const path = require('path');

const auctionsFile = 'auctions.json';

const swarm = new Hyperswarm();
const topic = Buffer.from('auction'); // Replace with your desired topic

const auctions = {}; // In-memory storage for auctions


const core = new Hypercore(RAM)
const bee = new Hyperbee(new Hypercore('./db'));

swarm.join(topic);

async function loadAuctions() {
  try {
    const data = await fs.readFile(auctionsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {}; // Return an empty object if file doesn't exist
    }
    throw error;
  }
}

async function saveAuctions(auctionsData) {
  await fs.writeFile(auctionsFile, JSON.stringify(auctionsData));
}

function broadcast(method, data) {
  console.log("reaching here");
  // Assuming access to swarm object
  swarm.peers.forEach(peer => {
    const rpc = peer.get(HyperswarmRPC);
    if (rpc) {
      rpc.call(method, data, (err) => {
        if (err) {
          console.error('Error broadcasting:', err);
        }
      });
    }
  });
}

async function createAuction(item, startingPrice, creatorId) {
  const auctionId = uuid.v4();
  const auction = new Auction({
    id: auctionId,
    creator: creatorId,
    item,
    startingPrice,
    currentBid: startingPrice,
    highestBidder: '',
    status: 'open'
  });


  console.log("data",auction,auctionId);

  try {

    const auctions = await loadAuctions();
    auctions[auctionId] = auction;
    await saveAuctions(auctions);
  
    // Save auction data to Hyperbee
    // await bee.put(`auction:${auctionId}`, JSON.stringify(auction));
    // console.log('Auction saved to Hyperbee');

    // // Retrieve the saved auction data (for verification) -- i am able to get the value here below 
    // const auctionData = await bee.get(`auction:${auctionId}`);
    // console.log("retrived data ",auctionData);

    broadcast('createAuction', auction);
  } catch (error) {
    console.error('Error saving auction to Hyperbee:', error);
  }

  return auctionId;
}

async function placeBid(auctionId, bidderId, bidAmount) {
  try {

    
    const auctions = await loadAuctions();
  const auction = auctions[auctionId];

  if (!auction) {
    return { error: 'Auction not found' };
  }

  if (auction.status !== 'open') {
    return { error: 'Auction closed' };
  }

  if (bidAmount <= auction.currentBid) {
    return { error: 'Bid must be higher than current bid' };
  }

  auction.currentBid = bidAmount;
  auction.highestBidder = bidderId;

  auctions[auctionId] = auction; // Update the auction in the object
  await saveAuctions(auctions);

    // Update auction data in Hyperbee
    // await bee.put(`auction:${auctionId}`, JSON.stringify(auction));
    // console.log('Bid updated in Hyperbee');

    broadcast('placeBid', { auctionId, bidderId, bidAmount });

    return { success: true };
  } catch (error) {
    console.error('Error placing bid:', error);
    return { error: 'Error placing bid' };
  }
}

  async function closeAuction(auctionId) {
    const auctions = await loadAuctions();
    const auction = auctions[auctionId];
  
    if (!auction || auction.status !== 'open') {
      return { error: 'Auction not found or already closed' };
    }
  
    auction.status = 'closed';
    auction.winner = auction.highestBidder;
  
    auctions[auctionId] = auction; // Update the auction in the object
    await saveAuctions(auctions);
  
    // Broadcast auction closed with winner information
    broadcast('auctionClosed', {
      auctionId,
      winner: auction.highestBidder,
      winningBid: auction.currentBid
    });
  
    // Additional broadcast for winner (optional)
    broadcast('auctionWinner', {
      auctionId,
      winner: auction.highestBidder
    });
  
    return { success: true };
}


// Function to retrieve auction data from Hyperbee
async function getAuctionFromHyperbee(auctionId) {
  try {
    const auctionData = await bee.get(`auction:${auctionId}`);
    return auctionData;
  } catch (error) {
    console.error('Error getting auction data from Hyperbee:', error);
    return null;
  }
}

module.exports = {
  createAuction,
  placeBid,
  closeAuction,
  getAuctionFromHyperbee // Expose function to retrieve auction from Hyperbee
};