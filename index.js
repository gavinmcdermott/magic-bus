'use strict'

import R from 'ramda'
import nomad from './fb_nomad'

nomad.init()

nomad.stream().observe((data) => {

  // let acceptableTimeWindow = 3000 // 3 seconds
  const acceptableTimeWindow = 3000000000 // lots of seconds for testing
  const lightThreshold = 3000 // sensor units
  const soundThreshold = 200 // sensor units


  const lightData = R.find(R.propEq('type', 'light'), data)
  const lightVal = R.prop('value', lightData)
  const lightTime = new Date(R.prop('time', lightData))

  const soundData = R.find(R.propEq('type', 'sound'), data)
  const soundVal = R.prop('value', soundData)
  const soundTime = new Date(R.prop('time', soundData))

  if (!lightVal || !soundVal || !lightTime || !soundTime) return

  let withinTimeRange = Math.abs(soundTime - lightTime) <= acceptableTimeWindow
  let exceededLightThreshold = lightVal >= lightThreshold
  let exceededSoundThreshold = soundVal >= soundThreshold

  if (withinTimeRange && exceededLightThreshold && exceededSoundThreshold) {
    let explosionData = {
      // source: [soundData, lightData],
      time: new Date().toString(),
      location: 'IDEO coLAB',
      explosion: true,
    }
    // console.log('BOOM!!!')
    // console.log('')
    nomad.publish(explosionData).catch((err) => {
      console.log('publish error: ', err)
    })
  }
})



// pondernigs for api ??
// nomad.tap(<stream>) => taps the single stream / array of streams / all streams
// nomad.publish() => publishes the data

























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