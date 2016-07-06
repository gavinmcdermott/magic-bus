
Successfully added file to IPFS and got a hash back.
Cat hash from another node works.

Naming the file in /IPFS/<node hash>/somename.txt requires requires implementation of IPFS name (IPNS).
Doesn't look like this is implemented in IPFS JS.
See: https://github.com/ipfs/js-ipfs/blob/master/ROADMAP.md

Will the JS daemon serve objects that have been added? Line from readmap says "This release won't
support...DHT (Kademlia Routing and Record Store)" What does this mean?

