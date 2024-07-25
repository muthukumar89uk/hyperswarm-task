Hello Sir,

I created whole of the architecture of bidding ,creating auction, closing and winning, 

First you need to run test1.js - to start the hyperswarm

secondly you can run auctionCreator.js file to create the auction.

file named with bidder1,2,3 are used to bid on the auction.

file name closeAuction is for finalising and closing the auction with announcing winner.

AuctionManager is the file name in which i created all the function for creating auction bidding etc.

I tried using hyperbee with hypercore , i was able to write the database but when i tried to read from it, it was always giving null values, so i went for the corestore and initiating the hyperbee with db file system , i was able to write the db file but while retriving it, it started giving error of Elocked file, so i finally used json based file system to create multiple auction, and used it to edit the highest bidder.

For data anouncing i used hyperswarm, it sometimes anounce the data , sometime it gets stucked. seems like an underlying problem of hyperbee which DAT protocol guys havent fixed yet.

Provided more time and some help in the resources from hypercore guys as its documentation is so messy and non productive, we can manage to run the dht nodes and share the file or data among the same  network, although the time given was much alot but i think scarcity of resource is the problem we need to dig deeped and do some research to understand the bottom line structure of hypercore system.