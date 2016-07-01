'use strict'

import _ from 'lodash'
import IPFS from 'ipfs'
import { exec } from 'child_process'
import path from 'path'
import os from 'os'






// console.log(node.isOnline())
// console.log(node.id)



// console.log(process.env.IPFS_PATH)
// process.env.IPFS_PATH = __dirname + '/foo'
// console.log(process.env.IPFS_PATH)
// console.log(process.env)


let ipfs = new IPFS(os.homedir() + '/.ipfs')
ipfs.load(() => {
	ipfs.files.add(
		new Buffer('hello world!', 'utf8'))
	.then(function(err, res) {
		if (err) { console.log(err) }
		if (res) { console.log(res) }
	})
	.catch(function(err) {
		console.log(err)
	})
})

// ipfs.goOnine()




// exec('jsipfs daemon', (err, stdout, stderr) => {
//   if (stderr) {
//     console.error(`exec error: ${stderr}`)
//     return
//   }
//   console.log(stdout)
// })
