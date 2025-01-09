import { Request, Response, NextFunction } from 'express'

//IMPLEMENT AUTHENTICATION AND AUTHORIZATION METHODS
export const authorizeRequest = (request: Request, response: Response, next: NextFunction) => {
    console.log('authorized');
    next();
}