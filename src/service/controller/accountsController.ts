import { ObjectId } from "mongodb";
import { Bank } from "../../data/model/bank.js";
import { APIError } from "../util/apiError.js";
import { HTTPStatus } from "../util/httpStatus.js";
import { BanksController } from "./banksController.js";
import { AccountsRepository } from "../../data/access/accountsRepository.js";
import { Account } from "../../data/model/account.js";
import { BanksRepository } from "../../data/access/banksRepository.js";

export class AccountsController {

//     static findAll = async (bankId: string): Promise<Account[]> => {
//         const opResult = await BanksController.findOne(bankId);
//         if (opResult) {
//             const bank = new Bank(opResult);
//             if (bank.accounts.length > 0) {
//                 return bank.accounts;
//             }
//         }
//         throw new APIError(HTTPStatus.NOT_FOUND, 'Resource not found');
//     }

//     static findOne = async (bankId: string, accountId: string): Promise<Account> => {
//         const opResult = await BanksController.findOne(bankId);
//         if (opResult) {
//             const bank = new Bank(opResult);
//             const account = bank.accounts.filter(a => a._id == new ObjectId(accountId));
//             if (account.length == 1) {
//                 bank.accounts = account;
//                 bank.fillStandardLinks();
//                 return bank.accounts[0];
//             }
//         }
//         throw new APIError(HTTPStatus.NOT_FOUND, 'Resource not found');
//     }

//     static insertOne = async (bankId: string, object: any): Promise<Account> => {
//         if (object._id) {
//             delete (object._id);
//         }
//         let requestBank = await BanksRepository.dbCollectionFindOne(new ObjectId(bankId));
//         if (requestBank) {
//             let auxBank = new Bank({accounts: [object]});
//             auxBank.accounts[0]._id = new ObjectId();
//             requestBank.accounts.push(auxBank.accounts[0]);
            
//         } else {
//             throw new APIError(HTTPStatus.NOT_FOUND, 'Bank not found');
//         }
//         const requestAccount = requestBank.accounts[0];
//         const opResult = await AccountsRepository.dbCollectionInsertOne(bankId, requestAccount);
//         if (opResult.insertedId) {
//             return this.findOne(bankId, opResult.insertedId.toString());
//         } else {
//             throw new APIError(HTTPStatus.INTERNAL_SERVER_ERROR, 'Resource not created');
//         }
//     }

//     static updateOne = async (bankId: string, accountId: string, object: any): Promise<Bank> => {
//     if (object._id) {
//         delete (object._id);
//     }
//     const requestResource = new Bank({ label: object.label, color: object.color });
//     const opResult = await dbCollectionUpdateOne(requestId, requestResource);
//     if (opResult.modifiedCount === 1) {
//         return findOne(id);
//     } else {
//         throw new APIError(HTTPStatus.OK, 'Did not update the resource');
//     }
// }

//     static deleteOne = async (id: string): Promise<number> => {
//     const requestId = new ObjectId(id);
//     const opResult = await dbCollectionDeleteOne(requestId);
//     return opResult;
// }
}

