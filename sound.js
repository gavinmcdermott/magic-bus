// IMPORTANT!!!

// first run as root
// echo cape-bone-iio > /sys/devices/bone_capemgr.*/slots



import { exec } from 'child_process'


// returns a promise
let readSensor = () => {
	let command = 'cat /sys/devices/ocp.3/helper.15/AIN0'
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error)
			} else {
				resolve(parseInit(stdout.toString()))
			}
		})	
	})
}

setInterval(() => {
	readSensor().then(console.log).catch((err) => console.log('e ', err))
}, 1000)
