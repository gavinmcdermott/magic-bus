'use strict'

import _ from 'lodash'
import IPFS from 'ipfs'
import { exec } from 'child_process'
import path from 'path'






// console.log(node.isOnline())
// console.log(node.id)



// console.log(process.env.IPFS_PATH)
// process.env.IPFS_PATH = __dirname + '/foo'
// console.log(process.env.IPFS_PATH)
// console.log(process.env)


let node = new IPFS(__dirname + '/foo')

node.init((err) => {
  console.log(err)
})




// exec('jsipfs daemon', (err, stdout, stderr) => {
//   if (stderr) {
//     console.error(`exec error: ${stderr}`)
//     return
//   }
//   console.log(stdout)
// })
