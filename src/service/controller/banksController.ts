import { ObjectId } from "mongodb";
import { Bank } from "../../data/model/bank.js";
import { APIError } from "../util/apiError.js";
import { HTTPStatus } from "../util/httpStatus.js";
import { BanksRepository } from "../../data/access/banksRepository.js";

export class BanksController {
    static findAll = async (): Promise<Bank[]> => {
        let resources: Bank[] = [];
        const opResult = await BanksRepository.dbCollectionFindAll();
        opResult.forEach((b: any) => {
            let resource = new Bank(b);
            resource.fillStandardLinks();
            resources.push(resource);
        });
        return resources;
    }
    
    static findOne = async (id: string): Promise<Bank> => {
        const requestId = new ObjectId(id);
        const opResult = await BanksRepository.dbCollectionFindOne(requestId);
        if (opResult) {
            const resource = new Bank(opResult);
            resource.fillStandardLinks();
            return resource;
        } else {
           throw new APIError(HTTPStatus.NOT_FOUND, 'Resource not found');
        }
    }
    
    static insertOne = async (object: any): Promise<Bank> => {
        const requestResource = new Bank({ label: object.label, color: object.color });
        const opResult = await BanksRepository.dbCollectionInsertOne(requestResource);
        if (opResult.insertedId) {
            return this.findOne(opResult.insertedId.toString());
        } else {
            throw new APIError(HTTPStatus.INTERNAL_SERVER_ERROR, 'Resource not created');
        }
    }
    
    static updateOne = async (id: string, object: any): Promise<Bank> => {
        const requestId = new ObjectId(id);
        const requestResource = new Bank({ label: object.label, color: object.color });
        const opResult = await BanksRepository.dbCollectionUpdateOne(requestId, requestResource);
        if (opResult.modifiedCount === 1) {
            return this.findOne(id);
        } else {
            throw new APIError(HTTPStatus.OK, 'Did not update the resource');
        }
    }
    
    static deleteOne = async (id: string): Promise<number> => {
        const requestId = new ObjectId(id);
        const opResult = await BanksRepository.dbCollectionDeleteOne(requestId);
        return opResult;
    }
}