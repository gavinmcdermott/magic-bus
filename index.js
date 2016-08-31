'use strict'


import R from 'ramda'
import $ from 'jquery'
import { events } from './nomadData'

events.on('new_value', (data) => {
  // console.log(data.type)
  const ref = $('#' + data.type).find('.sensor-inner')
  const textRef = $('#' + data.type + '-data')
  const activeClass = 'active'
  const activeAlertClass = 'active-alert'

  const timeDiff = new Date() - new Date(data.value.time)
  const newExplosion = timeDiff <= 2000

  const type = data.type
  const value = data.value.value
  const explosion = data.value.explosion

  const lightThreshold = 3000 // sensor units
  const soundThreshold = 200 // sensor units

  let exceededThreshold = false

  // Handle data
  switch (type) {
    case 'light':
      exceededThreshold = value > lightThreshold
      textRef.text(value)
      break
    case 'sound':
      exceededThreshold = value > soundThreshold
      textRef.text(value)
      break
    case 'explosion':
      if (newExplosion) textRef.text(explosion)
      break
  }

  // Handle UI
  if (ref.hasClass(activeClass)) return

  if (exceededThreshold || type === 'explosion') {
    console.log('Exceeded! ', type)
    // remove the active class
    if (!ref.hasClass(activeClass)) {
      ref.removeClass(activeClass)
    }

    // if there is no active-alert class, add it
    if (!ref.hasClass(activeClass)) {
      ref.addClass(activeAlertClass)
      setTimeout(() => {
        ref.removeClass(activeAlertClass)
      }, 4000)
    }

    // you're done here
    return
  }

  // if it already has an active class, bail
  if (ref.hasClass(activeClass)) return

  ref.addClass(activeClass)
  let timer = setTimeout(() => {
    clearTimeout(timer)
    ref.removeClass(activeClass)
  }, 500)
})
