import { LED, DeviceType } from ".";
import { EventEmitter } from "events";

export declare interface Device {
    on(event: "macroup", listener: (key: number) => void): this;
    on(event: "macrodown", listener: (key: number) => void): this;
}

export class Device extends EventEmitter {

    private _model: string;
    private _id: string;
    private _type: number;
    private _leds: LED[];
    private _children: Device[];
    private _parent?: Device;

    public constructor(model: string, id: string, type: number, ledIds: number[], parent?: Device) {
        super();

        this._model = model;
        this._id = id;
        this._type = type;
        this._leds = [];
        this._children = [];
        this._parent = parent;

        for (let i = 0; i < ledIds.length; i++) {
            this._leds.push(new LED(ledIds[i]))
        }
    }

    /**
     * Convert LEDs data into iCUE compatible format.
     */

    public transform() {
        return this._leds.map(led => led.transform());
    }

    /**
     * Set LED colour for entire device.
     * 
     * @param {[number, number, number]} colour - RGB colour to set LEDs
     */

    public setColour(colour: [number, number, number]) {
        for (let i = 0; i < this.ledCount; i++) {
            this.setLED(i, colour);
        }
    }

    /**
     * Set colour for specific LED.
     * 
     * @param {number} id - Index of LED
     * @param {[number, number, number]} colour - RGB colour to set LED
     */

    public setLED(id: number, colour: [number, number, number]) {
        this._leds[id].colour = colour;
    }

    /**
     * Get colour for specific LED.
     * 
     * @param {number} id - Index of LED
     */

    public getLED(id: number) {
        return this._leds[id].colour;
    }

    // public addChild(device: Device) {
    //     this._children.push(device);
    // }

    /**
     * Specific model of device (e.g. K55 RGB PRO).
     */

    get model() {
        return this._model;
    }

    /**
     * Unique identifier for iCUE device (e.g. af010375236bc03b9026f443aa6dee1d)
     */

    get id() {
        return this._id;
    }

    /**
     * Device type: Unknown, Mouse, Keyboard, Headset, MouseMat, HeadsetStand, Commander, LightingNode, Memory, Cooler, Motherboard or GraphicsCard.
     */

    get type() {
        return DeviceType[this._type];
    }

    /**
     * LED count for device.
     */

    get ledCount() {
        return this._leds.length;
    }

    // get children(): ReadonlyArray<Device> {
    //     return this._children;
    // }

    // get parent() {
    //     return this._parent;
    // }

}