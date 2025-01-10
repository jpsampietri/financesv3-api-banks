import { Router, Request, Response, NextFunction } from 'express';
import { validateRequestBody, validateRequestId } from './validation/requestValidator.js';
import { HTTPStatus } from './util/httpStatus.js';
import { APIError } from './util/apiError.js';
import { Properties } from './util/properties.js';
import { Bank } from '../data/model/bank.js';
import { ObjectId } from 'mongodb';
import { BanksController } from './controller/banksController.js';

const prop = Properties.instance;
const banksPath = prop.getProperty('api.banksPath');
const accountsPath = prop.getProperty('api.accountsPath');

export const router = Router();

router.route(banksPath)
    .get((request: Request, response: Response, next: NextFunction) => {
        BanksController.findAll().then((result: Bank[]) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .post(validateRequestBody)
    .post((request: Request, response: Response, next: NextFunction) => {
        BanksController.insertOne(request.body).then((result: Bank) => {
            response.status(HTTPStatus.CREATED).json(result);
        }).catch(next);
    });

router.use(`${banksPath}/:id`, validateRequestId);
router.route(`${banksPath}/:id`)
    .get((request: Request, response: Response, next: NextFunction) => {
        BanksController.findOne(request.params.id).then((result: Bank) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .put(validateRequestBody)
    .put((request: Request, response: Response, next: NextFunction) => {
        BanksController.updateOne(request.params.id, request.body).then((result: Bank) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .delete((request: Request, response: Response, next: NextFunction) => {
        BanksController.deleteOne(request.params.id).then((result: number) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    });

router.use(`${banksPath}/:id${accountsPath}`, validateRequestId);
router.route(`${banksPath}/:id${accountsPath}`)
    .get((request: Request, response: Response, next: NextFunction) => {
        BanksController.findOne(request.params.id).then((result: Bank) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .put(validateRequestBody)
    .put((request: Request, response: Response, next: NextFunction) => {
        BanksController.updateOne(request.params.id, request.body).then((result: Bank) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .delete((request: Request, response: Response, next: NextFunction) => {
        BanksController.deleteOne(request.params.id).then((result: number) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    });


router.use(banksPath, (request: Request, response: Response, next: NextFunction) => {
    throw new APIError(HTTPStatus.METHOD_NOT_ALLOWED, `Method ${request.method} not allowed`);
});
router.use(`${banksPath}/:id`, (request: Request, response: Response, next: NextFunction) => {
    throw new APIError(HTTPStatus.METHOD_NOT_ALLOWED, `Method ${request.method} not allowed`);
});

router.use((request: Request, response: Response, next: NextFunction) => {
    throw new APIError(HTTPStatus.NOT_FOUND, 'Path not found');
});

router.use((error: APIError, request: Request, response: Response, next: NextFunction) => {
    console.log(error);
    response.status(error.code).json(error);
})