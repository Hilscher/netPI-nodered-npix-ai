module.exports = function (RED) {
    "use strict";

    // need a mutex
    var locks = require('locks');

    // need a mutex per ADS1115 chip to exclude parallel access in case multiple nodes are in use
    var mutexADS1115_1 = locks.createMutex();
    var mutexADS1115_2 = locks.createMutex();

    // load the library
    var ads1x15 = require("node-ads1x15");

    function ads1x15Node(n) {
        RED.nodes.createNode(this, n);
        var node = this;

        // configure i2c address and channels based on selected input port
        if(n.in === "0") {
          this.address = 0x48;
          this.ch0 = 0;
          this.ch1 = 0;
          this.mutex = mutexADS1115_1;
        } else if( n.in === "1" ) {
          this.address = 0x48;
          this.ch0 = 2;
          this.ch1 = 3;
          this.mutex = mutexADS1115_1;
        } else if( n.in === "2" ) {
          this.address = 0x49;
          this.ch0 = 0;
          this.ch1 = 0;
          this.mutex = mutexADS1115_2;
        } else {
          this.address = 0x49;
          this.ch0 = 2;
          this.ch1 = 3;
          this.mutex = mutexADS1115_2;
        }

        // calibration offset 
        this.calib = parseFloat(n.calib);

        // data rate is 860 SPS always
        this.datarate = "860";

        // configured gain
        this.gainamplifier = n.range;

        var adc = new ads1x15(1, this.address, '/dev/i2c-1');

        node.on("input", function (msg) {
            if (!adc.busy) {

               // lock before the value can be read, else parallel reading would be possible
               node.mutex.lock(function () {

                    adc.readADCDifferential(node.ch0, node.ch1, node.gainamplifier, node.datarate, function (err, data) {

                        // unlock 
                        node.mutex.unlock();
                        if (err) {
                            node.status({ fill: "red", shape: "dot", text: "Error" });
                            node.warn(err);
                        } else {
                            node.status({ fill: "green", shape: "dot", text: "Read" });
                            // returned data value is by factor 100 too high
                            // and there is a preamplifier installed prior the ADS1115 with a split ratio of 1:1.4 
                            node.send({
                                payload: (((data*1.4)/100)+node.calib).toFixed(3)
                            });
                        }
                    });

               });

            } else {
                    node.status({ fill: "yellow", shape: "dot", text: "Waiting" });
            }
        });
        node.on("close", function () {
        });
    }
    RED.nodes.registerType("npixaiinput", ads1x15Node);
}
