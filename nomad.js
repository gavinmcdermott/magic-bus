'use strict'

import R from 'ramda'

import ipfsApi from 'ipfs-api'
import { DAGLink } from 'ipfs-merkle-dag'
import bs58 from 'bs58'

const ipfs = ipfsApi()
let channel = null
let headObjectHash = null

// returns a promise that resolves to the channel name
let init = () => {
	// let promise = new Promise((resolve, reject) => {})
	return getChannel().then((nodeId) => {
		channel = nodeId.ID
		console.log('channel id: ', channel)
		return getHeadObject(channel)
	}).then((hash) => {
		console.log('head object hash: ', hash)
		headObjectHash = hash
		return channel
	}).catch((err) => {
		let ourErr = new Error()
		ourErr.msg = "Connect error, IPFS dameon doesn't appear to be running. Try ipfs daemon first"
		throw (ourErr)
	})
}

// returns a promise that resolves to ipfs node id
// which is hash of public key. We use this as
// the software sensor's channel string
let getChannel = () => {
	return ipfs.id()
}

// returns a promise
let publish = (message) => {
	return newObject(headObjectHash, message)
}

// returns promise that resolves to the current
// head object of the message linked list
let getHeadObject = () => {
	return ipfs.name.resolve((data) => {
		return data.Path
	})
}

// returns promise that resolves to object sie
let objectDataSize = (objectHash) => {
	return ipfs.object.data(objectHash).then((data) => {
		return data.length
	})
}

// returns promise that resolves when object
// is published. 
let newObject = (head, dataObject) => {
	debugger
	if (channel === null) {
		return Promise.reject("IPFS isn't connected, you need to call init() first")
	}

	if (R.isNil(dataObject)) {
		return Promise.reject("message object can't be undefined or null")
	}

	console.log('line 68')
	let pointerObjectHash
	// create empty IPFS object. This will point to new message file and
	// to head pointer object of existing messages linked list
	return ipfs.object.new()
	.then((data) => {
		pointerObjectHash = data.toJSON().Hash
		let message = JSON.stringify(dataObject)
		console.log('adding new message: ', message)
		console.log(typeof message)
		return ipfs.add(new Buffer(message.toString(), 'utf8'))
	})
	// .then((data) => {
	//   let fileHash = data[0].path
	//   let node = data[0].node

	//   let fileLink = new DAGLink('file', node.data.length, new Buffer(bs58.decode(fileHash)))
	//   console.log('patching with file link')
	//   return ipfs.object.patch.addLink(new Buffer(bs58.decode(pointerObjectHash)), fileLink)
	// })
	// .then(() => {
	// 	console.log('getting head object size')
	// 	return objectDataSize(headObjectHash)
	// })
	// .then((headObjectSize) => {
	//   let peerLink = new DAGLink('peer', headObjectSize, new Buffer(bs58.decode(headObjectHash)))
	//   console.log('patching with peer object link')
	//   return ipfs.object.patch.addLink(new Buffer(bs58.decode(pointerObjectHash)), peerLink)
	// })
	// .then((data) => {
	// 	headObjectHash = data.Hash
	// 	console.log('putting: ', data)
	// 	console.log('puttig new object')
	// 	return ipfs.object.put(data)
	// })
	.catch((e) => {
	  console.log('e', e)
	})
}

export let NomadPub = {
	init,
	publish
}

// newObject(12345, '{"hello":"cat"}')
// .then((rep) => {
// 	console.log('success: ', rep)
// })