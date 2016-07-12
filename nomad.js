
// returns a promise that resolves to the channel name
let init = () => {
	return new Promise((resolve, reject) => {
		console.log('initializing nomad')
		setTimeout(() => { resolve('<channel-name>')}, 5000)
	})
	return promise
}

// returns a promise
let publish = (message) => {
	return new Promise((resolve, reject) => {
		console.log('m: ', message)
		resolve()
	})
}

export let NomadPub = {
	init,
	publish
}