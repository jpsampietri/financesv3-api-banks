import { HTTPStatus } from "./httpStatus.js";

export class APIError implements Error{
    code: HTTPStatus; 
    name: string;
    message: string;
    stack?: string | undefined;

    constructor(code: HTTPStatus, message: string, stack?: string | undefined) {
        this.code = code;
        this.name = HTTPStatus[code];
        this.message = message;
        this.stack = stack;

    }
}

