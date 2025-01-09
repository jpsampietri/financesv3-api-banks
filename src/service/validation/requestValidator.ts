import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { APIError } from "../util/apiError.js"
import { HTTPStatus } from "../util/httpStatus.js";

export const validateRequestId = (request: Request, response: Response, next: NextFunction) => {
    if (request.params.id) {
        try {
            const _id = new ObjectId(request.params.id);
        } catch (e: any) {
            throw new APIError(HTTPStatus.BAD_REQUEST, 'Invalid ID', e.stack);
        }
    }
    next();
}

export const validateRequestBody = (request: Request, response: Response, next: NextFunction) => {
    let valid = true;
    if (!request.body.requiredField) {
        valid = false;
    }
    if (!valid) {
        throw new APIError(HTTPStatus.BAD_REQUEST, 'Required fields missing or invalid');
    }
    console.log('validated');
    next();
}