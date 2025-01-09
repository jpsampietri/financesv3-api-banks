import { ObjectId } from "mongodb";
import { dbCollectionDeleteOne, dbCollectionFindAll, dbCollectionFindOne, dbCollectionInsertOne, dbCollectionUpdateOne } from "../../data/access/resourceRepository.js";
import { Resource } from "../../data/model/resource.js";
import { Request } from "express";
import { APIError } from "../util/apiError.js";
import { HTTPStatus } from "../util/httpStatus.js";

export const findAll = async (): Promise<Resource[]> => {
    let resources: Resource[] = [];
    const opResult = await dbCollectionFindAll();
    opResult.forEach((b: any) => {
        let resource = new Resource(b);
        resource.fillStandardLinks();
        resources.push(resource);
    });
    return resources;
}

export const findOne = async (id: string): Promise<Resource> => {
    const requestId = new ObjectId(id);
    const opResult = await dbCollectionFindOne(requestId);
    if (opResult) {
        const resource = new Resource(opResult);
        resource.fillStandardLinks();
        return resource;
    } else {
       throw new APIError(HTTPStatus.NOT_FOUND, 'Resource not found');
    }
}

export const insertOne = async (object: any): Promise<Resource> => {
    const requestResource = new Resource({ requiredField: object.requiredField});
    const opResult = await dbCollectionInsertOne(requestResource);
    if (opResult.insertedId) {
        return findOne(opResult.insertedId.toString());
    } else {
        throw new APIError(HTTPStatus.INTERNAL_SERVER_ERROR, 'Resource not created');
    }
}

export const updateOne = async (id: string, object: any): Promise<Resource> => {
    const requestId = new ObjectId(id);
    const requestResource = new Resource({ requiredField: object.requiredField});
    const opResult = await dbCollectionUpdateOne(requestId, requestResource);
    if (opResult.modifiedCount === 1) {
        return findOne(id);
    } else {
        throw new APIError(HTTPStatus.OK, 'Did not update the resource');
    }
}

export const deleteOne = async (id: string): Promise<number> => {
    const requestId = new ObjectId(id);
    const opResult = await dbCollectionDeleteOne(requestId);
    return opResult;
}