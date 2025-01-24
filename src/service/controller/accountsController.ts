import { ObjectId } from "mongodb";
import { Bank } from "../../data/model/bank.js";
import { APIError } from "../util/apiError.js";
import { HTTPStatus } from "../util/httpStatus.js";
import { BanksController } from "./banksController.js";
import { AccountsRepository } from "../../data/access/accountsRepository.js";
import { Account } from "../../data/model/account.js";

export class AccountsController {

    static findAll = async (bankId: string): Promise<Account[]> => {
        const opResult = await BanksController.findOne(bankId);
        if (opResult) {
            const bank = new Bank(opResult);
            bank.fillStandardLinks( );
            return bank.accounts;
        }
        throw new APIError(HTTPStatus.NOT_FOUND, 'Resource not found');
    }

    static findOne = async (bankId: string, accountId: string): Promise<Account> => {
        const opResult = await AccountsRepository.dbCollectionFindOne(new ObjectId(bankId), new ObjectId(accountId));
        if (opResult.length > 0) {
            const bank = new Bank(opResult[0]);
            bank.accounts = bank.accounts.filter( a => a._id?.toString() == accountId);
            bank.fillStandardLinks();
            return bank.accounts[0];
        }
        throw new APIError(HTTPStatus.NOT_FOUND, 'Resource not found');
    }

    static insertOne = async (bankId: string, object: any): Promise<Account> => {
        if (object._id) {
            delete (object._id);
        }
        const requestResource = new Account(object);
        const opResult = await AccountsRepository.dbCollectionInsertOne(new ObjectId(bankId), requestResource);
        if (opResult.result.modifiedCount === 1) {
            return this.findOne(bankId, opResult.insertId.toString());
        } else {
            throw new APIError(HTTPStatus.OK, 'Did not update the resource');
        }

    }

    static updateOne = async (bankId: string, accountId: string, object: any): Promise<Account> => {
        const requestResource = new Account({...object, _id: new ObjectId(accountId)});
        const opResult = await AccountsRepository.dbCollectionUpdateOne(new ObjectId(bankId), new ObjectId(accountId), requestResource);
        if (opResult.modifiedCount === 1) {
            return this.findOne(bankId, accountId);
        } else {
            throw new APIError(HTTPStatus.OK, 'Did not update the resource');
        }
    }

    static deleteOne = async (bankId: string, accountId: string): Promise<number> => {
        const opResult = await AccountsRepository.dbCollectionDeleteOne(new ObjectId(bankId), new ObjectId(accountId));
        return opResult.modifiedCount;
    }
}

