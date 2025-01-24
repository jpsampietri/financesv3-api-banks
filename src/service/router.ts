import { Router, Request, Response, NextFunction } from 'express';
import { validateRequestBody, validateRequestId } from './validation/requestValidator.js';
import { HTTPStatus } from './util/httpStatus.js';
import { APIError } from './util/apiError.js';
import { Properties } from './util/properties.js';
import { Bank } from '../data/model/bank.js';
import { ObjectId } from 'mongodb';
import { BanksController } from './controller/banksController.js';
import { AccountsController } from './controller/accountsController.js';
import { Account } from '../data/model/account.js';

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

router.use(`${banksPath}/:bankId`, validateRequestId);
router.route(`${banksPath}/:bankId`)
    .get((request: Request, response: Response, next: NextFunction) => {
        BanksController.findOne(request.params.bankId).then((result: Bank) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .put(validateRequestBody)
    .put((request: Request, response: Response, next: NextFunction) => {
        BanksController.updateOne(request.params.bankId, request.body).then((result: Bank) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .delete((request: Request, response: Response, next: NextFunction) => {
        BanksController.deleteOne(request.params.bankId).then((result: number) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    });

router.route(`${banksPath}/:bankId${accountsPath}`)
    .get((request: Request, response: Response, next: NextFunction) => {
        AccountsController.findAll(request.params.bankId).then((result: Account[]) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .post((request: Request, response: Response, next: NextFunction) => {
        AccountsController.insertOne(request.params.bankId, request.body).then((result: Account) => {
            response.status(HTTPStatus.CREATED).json(result);
        }).catch(next);
    });

router.use(`${banksPath}/:bankId${accountsPath}/:accountId`, validateRequestId);
router.route(`${banksPath}/:bankId${accountsPath}/:accountId`)
    .get((request: Request, response: Response, next: NextFunction) => {
        AccountsController.findOne(request.params.bankId, request.params.accountId).then((result: Account) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .put((request: Request, response: Response, next: NextFunction) => {
        AccountsController.updateOne(request.params.bankId, request.params.accountId, request.body).then((result: Account) => {
            response.status(HTTPStatus.OK).json(result);
        }).catch(next);
    })
    .delete((request: Request, response: Response, next: NextFunction) => {
        AccountsController.deleteOne(request.params.bankId, request.params.accountId).then((result: number) => {
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