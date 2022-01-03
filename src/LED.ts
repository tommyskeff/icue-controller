import * as SDK from "cue-sdk";

export class LED {

    private _id: number;
    private _colour: [number, number, number];

    public constructor(id: number) {
        this._id = id;
        this._colour = [0, 0, 0];
    }

    private parseColour(colour: [number, number, number]) {
        for (let i = 0; i < colour.length; i++) {
            var led = colour[i] %= 256;
            colour[i] = led < 0 ? led * -1 : led;
        }

        return colour;
    }

    /**
     * Convert LED data into iCUE compatible format.
     */

    public transform(): SDK.CorsairLedColor {
        return {
            ledId: this._id,
            r: this._colour[0],
            g: this._colour[1],
            b: this._colour[2]
        };
    }

    /**
     * Colour of LED in RGB (e.g. [255, 0, 255]).
     */

    get colour() {
        return this._colour;
    }

    /**
     * Colour of LED in RGB (e.g. [255, 0, 255]).
     */

    set colour(colour: [number, number, number]) {
        this._colour = this.parseColour(colour);
    }

}