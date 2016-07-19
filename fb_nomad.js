'use strict'

import firebase from 'firebase'
import most from 'most'
import R from 'ramda'

import config from './fb_config'

let relayConnections

let subs = {}
let pub = {}

const initPublisher = (config) => {
  pub[config.nodeId] = {}
  let ref = pub.ref = relayConnections.ref(config.nodeId)
  // pub.stream = most.fromPromise(ref.limitToLast(1).on('child_added', (snapshot) => {
  //   console.log('PUBLISHED', snapshot.val())
  //   console.log('===================================')
  //   return snapshot.val()
  // }))

  // hack for firebase test
  const genTimeStamp = () => {
    let timestamp = new Date().toString()
    let volume = Math.random()
    return ref.push({ timestamp, volume })
  }
  const observable = most.periodic(3000, genTimeStamp)
  observable.observe((f) => f())
  // end hack for firebase test

  return pub
}

const initSubscribers = (config) => {
  R.forEach((subId) => {
    let sub = subs[subId] = {}
    let ref = sub.ref = relayConnections.ref(subId)
    sub.stream = most.fromPromise(ref.limitToLast(1).on('child_added', (snapshot) => {
      // console.log('SUBSCRIBED', snapshot.val())
      // console.log('===================================')
      return snapshot.val()
    }))
  }, config.subIds)
  return subs
}

const composeStreams = (subss) => {
  let values = R.values(subs)
  // console.log(subs)
  let streamLens = R.lensProp('stream');
  // console.log(streamLens)
  let foo = R.map(streamLens, values)
  console.log('composables!', foo)
  // let streams = R.view(streamLens, subs)
  // console.log('composing', streams)
  let combined = most.combineArray((v) => { console.log('now composed') }, foo)
  let joined = most.join(combined)
  joined.observe((f) => {
    console.log('in observe; ', f)
  })
}

const internalInit = (config) => {
  firebase.initializeApp({ databaseURL: config.relayUrl })
  relayConnections = firebase.database()
  initPublisher(config)
  let ns = initSubscribers(config)
  composeStreams(ns)
}

const value = () => {

}

const externalInit = () => {
  // todo?
}

internalInit(config)

module.exports = {
  init: externalInit,
  value
}
