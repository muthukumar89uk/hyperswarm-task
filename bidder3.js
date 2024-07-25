const auctionModule = require('./auctionCore'); // Replace with the correct path

const auctionId = '37bf3c6a-aacd-4b9a-b3f3-04cf95f9ccc1';
const bidderId = 'kolo'; // Replace with the actual bidder ID
const bidAmount = 120; // Replace with the desired bid amount

async function main() {
  try {
    const result = await auctionModule.placeBid(auctionId, bidderId, bidAmount);
    console.log(result);
  } catch (error) {
    console.error('Error placing bid:', error);
  }
}

main();