'use strict'

import firebase from 'firebase'
import most from 'most'
import R from 'ramda'
import EventEmitter from 'events'

import config from './fb_config'

let relayConnections

let subs = {}
let pub = {}
let subscriberStreams

const initPublisher = (config) => {
  const nodeId = config.nodeId
  pub[nodeId] = {}
  let ref = pub.ref = relayConnections.ref(nodeId)

  // hack for firebase test
  const genTimeStamp = () => {
    let timestamp = new Date().toString()
    let volume = Math.random()
    return ref.set({ latest: { timestamp, volume,  node: nodeId } })
  }
  most.periodic(3000, genTimeStamp).observe((fn) => fn())
  // end hack for firebase test

  return pub
}

const initSubscribers = (config) => {
  R.forEach((subId) => {
    let sub = subs[subId] = {}
    let ref = sub.ref = relayConnections.ref(subId)
    let em = new EventEmitter()

    ref.limitToLast(1).once('value', (snapshot) => {
      let val = snapshot.val() ? snapshot.val().latest : null
      em.emit('value', val)
    })

    ref.limitToLast(1).on('value', (snapshot) => {
      let val = snapshot.val() ? snapshot.val().latest : null
      em.emit('value', val)
    })

    sub.stream = most.fromEvent('value', em)
  }, config.subIds)

  return subs
}

const composeStreams = (subscriptions) => {
  let streams = R.map(R.prop('stream'), R.values(subscriptions))
  subscriberStreams = most.combineArray((...theArgs) => theArgs, streams)
  return subscriberStreams
}

const internalInit = (config) => {
  firebase.initializeApp({ databaseURL: config.relayUrl })
  relayConnections = firebase.database()
  initPublisher(config)
  let subscribers = initSubscribers(config)
  composeStreams(subscribers)
}

const streamAll = () => {
  return subscriberStreams
}

const externalInit = () => {
  // todo?
}

internalInit(config)

module.exports = {
  init: externalInit,
  streamAll
}
