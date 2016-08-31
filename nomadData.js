'use strict'

import firebase from 'firebase'
import R from 'ramda'
import EventEmitter from 'events'

const firebaseUrl = 'https://nomad-53910.firebaseio.com'
const fbConfig = {
  authDomain: firebaseUrl,
  apiKey: "AIzaSyDVo9mZJo9sWK0kDJUdmusNPc1WDtv4yoE",
  databaseURL: "https://nomad-53910.firebaseio.com"
}
firebase.initializeApp(fbConfig)

const db = firebase.database()
const explosionDb = db.ref('explosion')
const lightDb = db.ref('light')
const soundDb = db.ref('sound')
const dbs = [explosionDb, soundDb, lightDb]

const em = new EventEmitter()

R.forEach((ref) => {
  const type = R.replace(/\//, '', ref.path.toString())
  ref.on('value', (snapshot) => {
    const data = { type, value: snapshot.val() }
    em.emit('new_value', data)
  })
}, dbs)

module.exports = {
  events: em
}
