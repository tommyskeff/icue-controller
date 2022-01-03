# iCUE Controller
Corsair iCUE lighting controller for NodeJS; a wrapper for the cue-sdk library (https://www.npmjs.com/package/cue-sdk). Easily  control the lighting in your Corsair iCUE products through NodeJS, and act on macro key presses for compatible mice and keyboards.

## Prerequisites
### Windows
- iCUE: https://www.corsair.com/icue
- Microsoft Visual C++ Redistributable:
    - x86 https://aka.ms/vs/15/release/VC_redist.x86.exe
    - x64 https://aka.ms/vs/15/release/VC_redist.x64.exe
### macOS
- iCUE: https://www.corsair.com/icue-mac

## Installation
```terminal
npm i icue-controller
```  
  
## Usage
### Example
```js
const icue = require("icue-controller");
const colour = [100, 0, 255];

// Create new iCUE client
var client = new icue.Client();

client.on("connect", () => {
    var devices = client.devices;
    console.log(`Connected to ${devices.length} devices!`);

    // Loop through connected devices
    devices.forEach(device => {
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
```

Make sure you always use `Client#update` to push your changes to the devices' LEDs.

## Docs
Coming Soon