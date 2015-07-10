var osc = require("osc");
var ArduinoFirmata = require('arduino-firmata');
var arduino = new ArduinoFirmata();
 
arduino.connect(); // use default arduino 
arduino.connect('/dev/cu.usbserial-A403IN4Y');


// Create an osc.js UDP Port listening on port 57121. 
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 5013
});

var map = {
  alpha: 9,
  beta: 10,
  theta: 11,
  delta: 12,
  gamma: 13
}


var avgs = {
  alpha: 0,
  beta: 0,
  theta: 0,
  delta: 0,
  gamma: 0
};


var analog_limit = 11;
var turnOn = function(band, val) {

    var motor_scale = 2;
    var led_scale = 4;
    var ch = map[band];
    var avg = (val[1] + val[2])/2;
    if(!avg) {
        avg = 0;
    }
    avgs[ch] = avg;
    var motor_intensity = parseInt(avg * motor_scale * 255);
    var led_intensity = parseInt(avg * led_scale * 255);
    avgs['led_intensity'] = led_intensity;
    console.log(JSON.stringify(avgs));
    if (ch <= analog_limit) {
        arduino.analogWrite(ch, motor_intensity, function() {
            console.log('pin ' + ch + ' turned on ' + motor_intensity);
        });
    } else {
       if (motor_intensity === 0) {
           arduino.digitalWrite(ch, false, function() {
               console.log('pin ' + ch + ' turned on');
           });
       } else {
           arduino.digitalWrite(ch, true, function() {
               console.log('pin ' + ch + ' turned on');
           });
       }
    }
    var led_on = 128 < led_intensity;
    arduino.digitalWrite(ch-7, led_on, function() {
        console.log('pin ' + ch-7 + ' turned on');
    });
} 
 
// Listen for incoming OSC bundles. 
udpPort.on("message", function (oscBundle) {
    switch(oscBundle.address) {
        case '/muse/elements/alpha_relative': {
            turnOn('alpha', oscBundle.args);
            break;
        }
        case '/muse/elements/beta_relative': {
            turnOn('beta', oscBundle.args);
            break;
        }
        case '/muse/elements/theta_relative': {
            turnOn('theta', oscBundle.args);
            break;
        }
        case '/muse/elements/delta_relative': {
            turnOn('delta', oscBundle.args);
            break;
        }
        case '/muse/elements/gamma_relative': {
            turnOn('gamma', oscBundle.args);
            break;
        }
    }
});


// Open the socket. 
udpPort.open();
