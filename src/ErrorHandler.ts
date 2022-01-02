import * as SDK from "cue-sdk";

export class ErrorHandler {

    private messages = {
        0: "None",
        1: "Failed to detect an instance of iCUE running or third party control is disabled in iCUE settings.",
        2: "Another client has taken over exclusive control of iCUE.",
        3: "The protocol handshake to iCUE has not been performed.",
        4: "The requested action is not supported by the iCUE server.",
        5: "The arguments provided were insufficient to the requested action.",
    };

    get code() {
        return SDK.CorsairGetLastError();
    }

    get message() {
        return this.messages[SDK.CorsairGetLastError()];
    }

    catchError() {
        if (this.code) {
            throw new Error(this.message);
        }
    }

}