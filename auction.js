class Auction {
  constructor(options) {
    this.id = options.id;
    this.creator = options.creator;
    this.item = options.item;
    this.startingPrice = options.startingPrice;
    this.currentBid = options.currentBid;
    this.highestBidder = options.highestBidder;
    this.status = options.status;
  }
}

module.exports = Auction;