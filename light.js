import { exec } from 'child_process'


// returns a promise
let readSensor = () => {
	let command = 'i2cget -y 1 0X39 0XAC w'
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error)
			} else {
				let decimal = parseInt(stdout.toString(), 16)
				resolve(decimal)
			}
		})	
	})
}

// returns a promise
let initSensor = () => {
	// let command = 'i2cget -y 1 0X39 0XAC w'
	let command = 'i2cset -y 1 0X39 0X0 0X3'
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error)
			} else {
				resolve(stdout.toString())
			}
		})	
	})
}

initSensor().then(console.log)