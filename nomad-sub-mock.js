'use strict'

import most from 'most'
import streamToPromise from 'stream-to-promise'
import R from 'ramda'
import ipfsApi from 'ipfs-api'
// import { DAGLink } from 'ipfs-merkle-dag'
import bs58 from 'bs58'

const ipfs = ipfsApi()
let channel = null
let headObjectHash = null


// returns a promise that resolves to null
let init = () => {
	return Promise.resolve(null)
}

// returns a most stream that on observation
// returns messages published by the given sensor
let subscribe = (channel) => {
	let notificationStream = getNotificationStream(channel)
	// notification stream elements resolve to head object hashes

	// get message data from IPFS object hash and wraps in most stream
	let objectHashToSingleMessageStream = (objectHash) => {
		return most.fromPromise(getMessageFromPointer(objectHash))
	}

	return notificationStream.chain(objectHashToSingleMessageStream).map(JSON.stringify)
}

// given a channel name (ie IPFS node id) returns
// a stream that emits whenever there's a new message
let getNotificationStream = (channel) => {
	return most.periodic(3000, 'Qme88LV7Eyd8aZhieyh5aUmGWHNXtSYNeJaQo4r2G4EAD6')
}

///////// FUNCTIONS THAT SHOULD BE ABSTRACTED IN A COMMON IPFS MODULE, PROBABLY ///////////

// returns promise that resolves to links list for a dag object hash
let _getLinks = R.curry((ipfs, hash) => {
  return ipfs.object.links(new Buffer(bs58.decode(hash)))
})

// bind to global ipfs
let getLinks = _getLinks(ipfs)

// grabs object for link named linkName from the list of links
let linkNamed = R.curry((linkName, linksList) => {
	return R.find(R.propEq('name', linkName), linksList)
})

// to string as pure function
let toString = (s) => { return s.toString() }

// returns promise that resolves to buffer
let getFile = (path) => {
	return ipfs.cat(path).then((stream) => {
		return streamToPromise(stream)
	})
}

// hash of pointer object -> promise that resolves to message
let getMessageFromPointer = (hash) => {
	let getFileLink = linkNamed('file')

	return R.pipeP(
		getLinks, 
		getFileLink, 
		R.prop('hash'),
		bs58.encode, 
		getFile, 
		toString)
	(hash)
}

// returns promise that resolves to the current
// head object of the message linked list
let resolveChannelToCurrentHead = (channel) => {
  return ipfs.name.resolve(channel)
}

/////////////////////////////////////////////////////////////////////////////////

export default {
  init,
  subscribe
}


// getFile('QmQVXiYyUdcrnJBoBS4LBRnnzzXLJZP1f3216TEnxTjrat')

// getMessageFromPointer('Qme88LV7Eyd8aZhieyh5aUmGWHNXtSYNeJaQo4r2G4EAD6').then((res) => {
// 	debugger
// 	console.log(res.toString())
// }).catch((err) => {
// 	console.log('e: ', err)
// })

// getFile('QmQVXiYyUdcrnJBoBS4LBRnnzzXLJZP1f3216TEnxTjrat').then((res) => {
// 	debugger
// 	console.log(res.toString())
// }).catch((err) => {
// 	console.log('e: ', err)
// })


