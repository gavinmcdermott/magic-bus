// sample code that publishes a message every few seconds

import most from 'most'

import { NomadPub } from './nomad'

// returns periodic stream that fires every millis
// and resolves to channel
let intervalStream = (millis, channel) => {
	return most.periodic(millis, channel)
}

// construct and return a really simple message using channel string
let message = (channel) => {
	return { timestamp: new Date().toString(), channel }
}

NomadPub.init().then((channel) => {
	let run = intervalStream(1000, channel).map(message)
	run.observe(NomadPub.publish)
}).catch((err) => {
	console.log('e: ', err)
})