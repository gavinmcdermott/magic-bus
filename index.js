'use strict'

import _ from 'lodash'
import ipfsApi from 'ipfs-api'

const ipfs = ipfsApi()

// ipfs.block.get('QmZH9H8UG1wcs6481LoDGLnr4MGLZjXjyKxqxXPKzyav92', (e, d) => {
//   let buf = ''
//   d
//     .on('data', function (data) { buf += data })
//     .on('end', function () {
//       console.log(buf)
//     })
// })

ipfs.add(new Buffer('hello reid!', 'utf8'))
  .then((data) => {
    console.log('d: ', data)
  })
  .catch((e) => {
    console.log('e', e)
  })
