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

    public transform() {
        return this._leds.map(led => led.transform());
    }

    public setColour(id: number, colour: [number, number, number]) {
        this._leds[id].colour = colour;
    }

    public getColour(id: number) {
        return this._leds[id].colour;
    }

    public addChild(device: Device) {
        this._children.push(device);
    }

    get model() {
        return this._model;
    }

    get id() {
        return this._id;
    }

    get type() {
        return DeviceType[this._type];
    }

    get ledCount() {
        return this._leds.length;
    }

    get children() : ReadonlyArray<Device> {
        return this._children;
    }

    get parent() {
        return this._parent;
    }

}