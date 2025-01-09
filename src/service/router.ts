import { Router, Request, Response, NextFunction } from 'express';
import { deleteOne, findAll, findOne, insertOne, updateOne } from './controller/resourceController.js';
import { validateRequestBody, validateRequestId } from './validation/requestValidator.js';
import { HTTPStatus } from './util/httpStatus.js';
import { APIError } from './util/apiError.js';
import { Properties } from './util/properties.js';
import { Resource } from '../data/model/resource.js';
import { ObjectId } from 'mongodb';

const prop = Properties.instance;
const resourcePath = prop.getProperty('api.resourcePath');

export const router = Router();

router.route(resourcePath)
    .get((request: Request, response: Response, next: NextFunction) => {
        findAll().then((result: Resource[]) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .post(validateRequestBody)
    .post((request: Request, response: Response, next: NextFunction) => {
        insertOne(request.body).then((result: Resource) => {
            response.status(HTTPStatus.CREATED).json(result);
        }).catch(next);
    });

router.use(`${resourcePath}/:id`, validateRequestId);
router.route(`${resourcePath}/:id`)
    .get((request: Request, response: Response, next: NextFunction) => {
        findOne(request.params.id).then((result: Resource) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .put(validateRequestBody)
    .put((request: Request, response: Response, next: NextFunction) => {
        updateOne(request.params.id, request.body).then((result: Resource) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .delete((request: Request, response: Response, next: NextFunction) => {
        deleteOne(request.params.id).then((result: number) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    });

router.use(resourcePath, (request: Request, response: Response, next: NextFunction) => {
    throw new APIError(HTTPStatus.METHOD_NOT_ALLOWED, `Method ${request.method} not allowed`);
});
router.use(`${resourcePath}/:id`, (request: Request, response: Response, next: NextFunction) => {
    throw new APIError(HTTPStatus.METHOD_NOT_ALLOWED, `Method ${request.method} not allowed`);
});

router.use((request: Request, response: Response, next: NextFunction) => {
    throw new APIError(HTTPStatus.NOT_FOUND, 'Path not found');
});

router.use((error: APIError, request: Request, response: Response, next: NextFunction) => {
    response.status(error.code).json(error);
})