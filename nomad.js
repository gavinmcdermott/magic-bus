'use strict'

import R from 'ramda'
import ipfsApi from 'ipfs-api'
import { DAGLink } from 'ipfs-merkle-dag'
import bs58 from 'bs58'



// /////////////////////////////////////////
// Notes:
// /////////////////////////////////////////
//
// Nodes need to publish something first, or they will error with this message: 'Could not resolve name'
//
//
//
// /////////////////////////////////////////




const ipfs = ipfsApi()
let channel = null
let headObjectHash = null




// IPFS Helpers

// returns a promise that resolves to ipfs node id
// which is hash of public key. We use this as
// the software sensor's channel string
let getChannel = () => {
  return ipfs.id()
}

// returns promise that resolves to the current
// head object of the message linked list
let resolveChannelToCurrentHead = (channel) => {
  return ipfs.name.resolve(channel)
}

// let getObjectDataLength = (ipfsObjData) => {
//   return Promise.resolve(data.length)
// }

// returns promise that resolves to object size
let getDataForObject = (objectHash) => {
  return ipfs.object.data(objectHash)
}

// returns promise that resolves to a new empty object
let getNewTemplateObject = () => {
  return ipfs.object.new()
}

let addDataToIPFS = (string) => {
  if (R.type(string) !== 'String') {
    string = JSON.stringify(string)
  }
  return ipfs.add(new Buffer(string, 'utf8'))
}






// returns a promise that resolves to the channel name
let init = () => {
  // let promise = new Promise((resolve, reject) => {})
  return getChannel().then((nodeId) => {
    channel = nodeId.ID
    console.log('channel id: ', channel)
    return resolveChannelToCurrentHead(channel)
  }).then((data) => {
    headObjectHash = R.replace('\/ipfs\/', '', data.Path)
    console.log('head object hash: ', headObjectHash)
    return channel
  }).catch((err) => {
    let ourErr = new Error()
    ourErr.msg = "Connect error, IPFS dameon doesn't appear to be running. Try ipfs daemon first"
    console.log(err)
    throw (ourErr)
  })
}

















// returns promise that resolves when object
// is published.
let publishData = (head, message) => {
  if (channel === null) {
    return Promise.reject("IPFS isn't connected, you need to call init() first")
  }

  if (R.isNil(message)) {
    return Promise.reject("message object can't be undefined or null")
  }

  let publishObject = {
    oldHeadObjectHash: headObjectHash,
    oldHeadObjectDataSize: null,
    newHeadObject: null,
    newHeadObjectHash: null,
    newDataObject: null
  }


  return getNewTemplateObject()
    .then((data) => {
      let result = Object.assign({}, publishObject)
      result.newHeadObject = data
      result.newHeadObjectHash = data.toJSON().Hash
      return result
    })
    .then((dataWrapper) => {
      let result = Object.assign({}, dataWrapper)
      let hash = result.newHeadObjectHash
      return Promise.all([getDataForObject(new Buffer(bs58.decode(hash))), Promise.resolve(result)])
    })
    .then((results) => {
      let data = results[0]
      let dataWrapper = results[1]
      let result = Object.assign({}, dataWrapper)
      result.oldHeadObjectDataSize = data.length
      return result
    })
    .then((dataWrapper) => {
      let result = Object.assign({}, dataWrapper)
      return Promise.all([addDataToIPFS(message), Promise.resolve(result)])
    })
    .then((results) => {
      let data = results[0]
      let dataWrapper = results[1]
      let result = Object.assign({}, dataWrapper)
      result.newDataObject = R.head(data)
      return result
    })
    .then((dataWrapper) => {
      let result = Object.assign({}, dataWrapper)
      let node = result.newDataObject.node.toJSON()
      let path = result.newDataObject.path
      let fileLink = new DAGLink('file', node.Data.length, new Buffer(bs58.decode(path)))
      return Promise.all([ipfs.object.patch.addLink(new Buffer(bs58.decode(result.newHeadObjectHash)), fileLink), Promise.resolve(result)])
    })
    .then((results) => {
      let data = results[0]
      let dataWrapper = results[1]
      let result = Object.assign({}, dataWrapper)
      result.newHeadObject = data
      return result
    })
    .then((dataWrapper) => {
      let result = Object.assign({}, dataWrapper)
      let peerLink = new DAGLink('peer', result.oldHeadObjectDataSize, new Buffer(bs58.decode(result.oldHeadObjectHash)))
      return Promise.all([ipfs.object.patch.addLink(new Buffer(bs58.decode(result.newHeadObject.toJSON().Hash)), peerLink), Promise.resolve(result)])
    })
    .then((results) => {
      let data = results[0]
      let dataWrapper = results[1]
      let result = Object.assign({}, dataWrapper)
      result.newHeadObject = data
      return result
    })
    .then((dataWrapper) => {
      let result = Object.assign({}, dataWrapper)
      return Promise.all([ipfs.object.put(result.newHeadObject), Promise.resolve(result)])
    })
    .then((results) => {
      let data = results[0]
      let dataWrapper = results[1]
      let result = Object.assign({}, dataWrapper)
      result.newHeadObject = data
      // update the name
      headObjectHash = data.toJSON().Hash
      return Promise.all([ipfs.name.publish(headObjectHash), Promise.resolve(result)])
    })
    .then((results) => {
      console.log('next Hash published: ', headObjectHash)
      let data = results[0]
      let dataWrapper = results[1]
      let result = Object.assign({}, dataWrapper)
      return result
    })
}






let publish = (message) => {
  return publishData(headObjectHash, message)
}









export default {
  init,
  publish
}
