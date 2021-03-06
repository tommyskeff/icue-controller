const icue = require("icue-controller");
const colour = [100, 0, 255, 50];

// Create new iCUE client
var client = new icue.Client();

client.on("connect", () => {
    var devices = client.devices;
    console.log(`Connected to ${devices.length} devices!`);

    // Loop through connected devices
    devices.forEach(device => {
        // Set colour for all LEDs in device
        device.setColour(colour);

        // Log macro presses on iCUE compatible keyboards/mice
        device.on("macrodown", key => {
            console.log(`Macro key ${key} was pressed!`);
        });
    });

    // Push changes to LEDs
    client.update();
});

// Connect to iCUE
client.connect();