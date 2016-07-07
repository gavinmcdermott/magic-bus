'use strict'

import _ from 'lodash'
import ipfsApi from 'ipfs-api'
import { DAGLink } from 'ipfs-merkle-dag'
import bs58 from 'bs58'

const ipfs = ipfsApi()



let newObject = () => {
	let objHash
	ipfs.object.new()
	.then((data) => {
		console.log('d: ', data)
		objHash = data.toJSON().Hash
		return ipfs.add(new Buffer('2 hello reid!', 'utf8'))
	})
	.then((data) => {
	  console.log('d: ', data)
	  let fileHash = _.first(data).path
	  let node = _.first(data).node

	  let link = new DAGLink('dalink', node.data.length, new Buffer(bs58.decode(fileHash)))
	  console.log('l: ', link)
	  return ipfs.object.patch.addLink(new Buffer(bs58.decode(objHash)), link)
	})
	.then((data) => {
		console.log(data.toJSON())
	})
	.catch((e) => {
	  console.log('e', e)
	})
}

let addAndPublish = () => {
	ipfs.add(new Buffer('1 hello reid!', 'utf8'))
	  .then((data) => {
	    console.log('d: ', data)
	    let hash = _.first(data).path
	    return ipfs.name.publish(hash)
	  })
	  .then((data) => {
	  	console.log('d: ', data)
	  })
	  .catch((e) => {
	    console.log('e', e)
	  })
}


newObject()