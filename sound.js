import BeagleBone from 'beaglebone-io'

let board = new BeagleBone();
 
board.on('ready', function () {
  this.analogRead('A0', function (value) {
    console.log(value);
  });
});