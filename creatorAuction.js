const auctionCore = require('./auctionCore');

async function createAuction() {
  try {
    const auctionId = await auctionCore.createAuction('Product X', 50,'A');
    console.log('Auction created with ID:', auctionId);
  } catch (error) {
    console.error('Error creating auction:', error);
  }
}

createAuction();