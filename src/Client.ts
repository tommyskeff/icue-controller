import { Device, errorHandler, DeviceType } from ".";
import { EventEmitter } from "events";
import * as SDK from "cue-sdk";

export type CorsairEvent = {
    id: "macrokeydown" | "macrokeyup" | "deviceconnect" | "devicedisconnect";
    deviceId: string;
    keyId?: number
}

export declare interface Client {
    on(event: "connect", listener: () => void): this;
    on(event: "deviceconnect", listener: (device: Device) => void): this;
    on(event: "devicedisconnect", listener: (device: Device) => void): this;
}

export class Client extends EventEmitter {

    private _details?: SDK.CorsairProtocolHandshake;
    private _devices: Device[] = [];

    /**
     * Initiate connection to iCUE server.
     */

    public async connect() {
        var details = SDK.CorsairPerformProtocolHandshake();
        errorHandler.catchError();

        SDK.CorsairRequestControl();
        errorHandler.catchError();

        SDK.CorsairSubscribeForEvents(e => {
            var event = <CorsairEvent>e;
            switch (event.id) {
                case "macrokeydown":
                    var device = this.findDevice(event.deviceId);
                    if (device !== undefined /* && device */) {
                        device.emit("macrodown", event.keyId);
                    }

                    break;
                case "macrokeyup":
                    var device = this.findDevice(event.deviceId);
                    if (device !== undefined) {
                        device.emit("macroup", event.keyId);
                    }

                    break;
            }
        });

        errorHandler.catchError();

        this.indexDevices(true);
        this.emit("connect");
        this._details = details;
    }

    /**
     * Get iCUE device from its ID.
     */

    public findDevice(id: string) {
        return this._devices.find(d => d.id === id);
    }

    private indexDevices(initial = false) {
        var count = SDK.CorsairGetDeviceCount();
        errorHandler.catchError();

        var devices = [];
        for (let i = 0; i < count; i++) {
            var info = SDK.CorsairGetDeviceInfo(i);
            errorHandler.catchError();

            if (!info) {
                continue;
            }

            var positions = SDK.CorsairGetLedPositionsByDeviceIndex(i);
            errorHandler.catchError();

            var leds = positions.map(p => p.ledId).sort((a, b) => a - b);
            var device = new Device(info.model, info.deviceId, info.type, leds);

            // if (info.type === 7) {
            //     for (const channel of info.channels) {
            //         var led = 0;
            //         for (const channelDevice of channel.devices) {
            //             var child = new Device("Unknown", "None", 0, leds.slice(led, led + channelDevice.deviceLedCount), device);
            //             device.addChild(child);
            //             led += channelDevice.deviceLedCount;
            //         }
            //     }
            // }

            devices.push(device);
        }

        if (initial) {
            for (const device of devices) {
                this.emit("deviceconnect", device);
            }
        }

        this._devices = devices;
    }

    /**
     * Get iCUE devices of a certain type.
     * 
     * @param {DeviceType} type - Device type (e.g. KEYBOARD)
     */

    public getDevices(type: DeviceType): ReadonlyArray<Device> {
        return this._devices.filter(d => d.type === DeviceType[type]);
    }

    /**
     * Push colour modifications to LEDs.
     * 
     * @param {Device[]} [devices] - List of devices to update
     */

    public update(devices?: Device[]) {
        return new Promise<void>((resolve, reject) => {
            var count = SDK.CorsairGetDeviceCount();
            errorHandler.catchError();

            for (let i = 0; i < count; i++) {
                var info = SDK.CorsairGetDeviceInfo(i);
                if (errorHandler.code) {
                    return reject(errorHandler.message)
                }

                for (const device of devices ? devices : this._devices) {
                    if (info?.deviceId === device.id) {
                        SDK.CorsairSetLedsColorsBufferByDeviceIndex(i, device.transform());
                        if (errorHandler.code) {
                            return reject(errorHandler.message)
                        }
                    }
                }
            }

            SDK.CorsairSetLedsColorsFlushBuffer();
            errorHandler.catchError();

            resolve();
        });
    }

    /**
     * Connection details to iCUE server.
     */

    get connection() {
        return this._details;
    }

    /**
     * Devices currently connected to iCUE.
     */

    get devices(): ReadonlyArray<Device> {
        return this._devices;
    }

}