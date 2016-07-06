'use strict'

import _ from 'lodash'
import IPFS from 'ipfs'
import { exec } from 'child_process'
import path from 'path'
import os from 'os'
import util from 'util'


let ipfs = new IPFS(os.homedir() + '/.ipfs')
ipfs.load(() => {
	ipfs.files.add(new Buffer('hello hello hello world!', 'utf8'))
	.then(function(err, res) {
		if (err) { console.log("err:" + util.inspect(err, false, null)) }
		if (res) { console.log("res:" + res) }
		debugger
	})
	.catch(function(err) {
		debugger
		console.log("caught err:" + err)
	})
})


