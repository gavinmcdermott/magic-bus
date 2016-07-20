// IMPORTANT!!!

// first run as root
// echo cape-bone-iio > /sys/devices/bone_capemgr.*/slots


import nomad from './fb_nomad'
import { exec } from 'child_process'
nomad.init()


// returns a promise
let readSensor = () => {
	let command = 'cat /sys/devices/ocp.3/helper.15/AIN0'
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error)
			} else {
				resolve(parseInt(stdout.toString()))
			}
		})	
	})
}

setInterval(() => {
	readSensor().then((data) => {
		nomad.publish({ sound: data, time: new Date().toString()}).catch((err) => {
  		console.log(err)
		})
	}).catch((err) => console.log('e ', err))
}, 1000)
