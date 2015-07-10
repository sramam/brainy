# brainy
A simple node server that interfaces the [muse](http://www.choosemuse.com/) brain sensing band to an [arduino](https://www.arduino.cc/) board.

Built as part of [dadaconf 0](http://dadaconf.com/)

Things external to this package.
1. Connecting node to an arduino board.
2. Install the muse [developer kit](http://www.choosemuse.com/developer-kit/)


# How it works
- The muse connects over bluetooth with it's driver.
- The driver then transmits signals using [OSC] (http://opensoundcontrol.org/introduction-osc)
- It needs to be configured to talk to our node.js server (configure the UDP port)) 
- Adjust any arduino ports you might want to interface to.
- Depending on what you are controlling, may you have happy endings!

