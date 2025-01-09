import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { APIError } from "../util/apiError.js"
import { HTTPStatus } from "../util/httpStatus.js";

export const validateRequestId = (request: Request, response: Response, next: NextFunction) => {
    if (request.params.bankId) {
        try {
            const _id = new ObjectId(request.params.id);
        } catch (e: any) {
            throw new APIError(HTTPStatus.BAD_REQUEST, 'Invalid ID', e);
        }
    }
    if (request.params.accountId) {
        try {
            const _id = new ObjectId(request.params.id);
        } catch (e: any) {
            throw new APIError(HTTPStatus.BAD_REQUEST, 'Invalid ID', e);
        }
    }
    next();
}

export const validateRequestBody = (request: Request, response: Response, next: NextFunction) => {
    let valid = true;
    if (!request.body.label || typeof(request.body.label) !== "string") {
        valid = false;
    }
    if (!request.body.color || 
        typeof(request.body.color) !== "string" || 
        !request.body.color.toUpperCase().match(/\#[A-F0-9]{6}/g)){
        valid = false;
    }
    if (!valid) {
        throw new APIError(HTTPStatus.BAD_REQUEST, 'BAD REQUEST', 'Required field missing or invalid.');
    }
    next();
}