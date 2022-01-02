const icue = require("icue-controller");
const colour = [100, 0, 255];

// Create new iCUE client
var client = new icue.Client();

client.on("connect", () => {
    var devices = client.devices;
    console.log(`Connected to ${devices.length} devices!`);

    // Loop through connected devices
    devices.forEach(device => {
        // Loop through LEDs in the device.
        for (let i = 0; i < device.ledCount; i++) {
            // Set LED colour
            device.setColour(i, colour);
        }
    });

    // Push changes to LEDs
    client.update();
});