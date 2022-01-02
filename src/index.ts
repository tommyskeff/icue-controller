import { Client } from "./Client";
import { Device } from "./Device";
import { DeviceType } from "./DeviceType";
import { LED } from "./LED";

import { ErrorHandler } from "./ErrorHandler";

const errorHandler = new ErrorHandler();

export { Client, Device, DeviceType, LED, errorHandler }