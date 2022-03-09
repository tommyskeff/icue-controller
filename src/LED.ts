import * as SDK from "cue-sdk";

export class LED {

    private _id: number;
    private _colour: [number, number, number, number];

    public constructor(id: number) {
        this._id = id;
        this._colour = [0, 0, 0, 1];
    }

    private parseColour(colour: [number, number, number, number]) {
        for (let i = 0; i < colour.length; i++) {
            var led = colour[i] %= 256;
            colour[i] = led < 0 ? led * -1 : led;
        }

        return colour;
    }

    private performOpacity(value: number) {
        const alpha = this._colour[3];
        return Math.round((255 - alpha) + (alpha * value / 255));
    }

    /**
     * Convert LED data into iCUE compatible format.
     */

    public transform(): SDK.CorsairLedColor {
        return {
            ledId: this._id,
            r: this.performOpacity(this._colour[0]),
            g: this.performOpacity(this._colour[1]),
            b: this.performOpacity(this._colour[2])
        };
    }

    /**
     * Colour of LED in RGBA (e.g. [255, 0, 255, 1]).
     */

    get colour() {
        return this._colour;
    }

    /**
     * Colour of LED in RGBA (e.g. [255, 0, 255, 0.5]).
     */

    set colour(colour: [number, number, number, number]) {
        this._colour = this.parseColour(colour);
    }

}