const auctionModule = require('./auctionCore'); // Replace with the correct path

async function closeAuction(auctionId) {
  try {
    const result = await auctionModule.closeAuction(auctionId);
    console.log(result);
  } catch (error) {
    console.error('Error closing auction:', error);
  }
}

const auctionIdToClose = '995446a5-146f-4cbc-a8d5-dfdaeedbc44a'; // Replace with the actual auction ID
closeAuction(auctionIdToClose);