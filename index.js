'use strict'

import R from 'ramda'
import nomad from './fb_nomad'
import Twilio from 'twilio'

import { twilioSid, twilioToken, phones } from './twilioConf'
let twilioClient = Twilio(twilioSid, twilioToken)

nomad.init()

nomad.stream().observe((list) => {
  let acceptableTimeWindow = 30000 // need explosion to have happened in last 30 seconds.
  let data = list[0]
  let explosion = R.prop('explosion', data)
  let eTime = R.prop('time', data)

  let now = new Date()

  if (explosion === true && (now - new Date(eTime) <= acceptableTimeWindow)) {
  	console.log ('EXPLOSION')
  	R.forEach(notifyExplosion, phones)
  }
})

// doesn't return
let sms = R.curry((body, from, to) => {
	twilioClient.sendMessage({ to, from, body }, function(err, responseData) {
		if (err) {
			console.log('error sending with twilio: ', err)
		}
	})
})

let notifyExplosion = sms("There's been an explosion in the machine room!", '+16502499130')
































// messing around


// import _ from 'lodash'
// import ipfsApi from 'ipfs-api'
// import { DAGLink } from 'ipfs-merkle-dag'
// import bs58 from 'bs58'

// const ipfs = ipfsApi()

// let newObject = () => {
// 	let objHash
// 	ipfs.object.new()
// 	.then((data) => {
// 		console.log('d: ', data)
// 		objHash = data.toJSON().Hash
// 		return ipfs.add(new Buffer('2 hello reid!', 'utf8'))
// 	})
// 	.then((data) => {
// 	  console.log('d: ', data)
// 	  let fileHash = _.first(data).path
// 	  let node = _.first(data).node

// 	  let link = new DAGLink('dalink', node.data.length, new Buffer(bs58.decode(fileHash)))
// 	  console.log('l: ', link)
// 	  return ipfs.object.patch.addLink(new Buffer(bs58.decode(objHash)), link)
// 	})
// 	.then((data) => {
// 		console.log(data.toJSON())
// 	})
// 	.catch((e) => {
// 	  console.log('e', e)
// 	})
// }

// let addAndPublish = () => {
// 	ipfs.add(new Buffer('1 hello reid!', 'utf8'))
// 	  .then((data) => {
// 	    console.log('d: ', data)
// 	    let hash = _.first(data).path
// 	    return ipfs.name.publish(hash)
// 	  })
// 	  .then((data) => {
// 	  	console.log('d: ', data)
// 	  })
// 	  .catch((e) => {
// 	    console.log('e', e)
// 	  })
// }


// newObject()