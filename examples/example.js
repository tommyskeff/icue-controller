const icue = require("../");
const colour = [100, 0, 255];

// Create new iCUE client
var client = new icue.Client();

client.on("connect", () => {
    var devices = client.devices;
    console.log(`Connected to ${devices.length} devices!`);

    // Loop through connected devices
    devices.forEach(device => {
        console.log(device.type, device.id);
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