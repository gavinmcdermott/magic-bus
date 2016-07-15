// sample code that publishes a message every few seconds

import NomadSub from './nomad-sub-mock'

let channel1 = 'QmYcbm7GPAd3S7nSSrsxuyxef9KQ7fR3SkTmLcWX9BdN8y'

// returns a stream
let stream1 = NomadSub.subscribe(channel1)

// time stamp a message
let timestamp = (message) => {
	return {
		message,
		received: new Date().toString()
	}
}

let log = (message) => {
	console.log(message)
	return message
}

let composedStream = stream1.map(timestamp)

NomadSub.init().then(() => {
	composedStream.observe(log).catch((err) => {
		console.log('error observing stream: ', err)
	})
}).catch((err) => {
	console.log('INIT ERR: ', err)
})