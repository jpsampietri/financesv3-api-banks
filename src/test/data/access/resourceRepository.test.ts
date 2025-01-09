import { before, describe, it } from "mocha";
import { dbCollectionDeleteOne, dbCollectionFindAll, dbCollectionFindOne, dbCollectionInsertOne, dbCollectionUpdateOne } from "../../../data/access/resourceRepository.js";
import { assert } from "chai";
import { Resource } from "../../../data/model/resource.js";
import { MongoClient, ObjectId } from "mongodb";
import { Properties } from "../../../service/util/properties.js";
let insertOneId: ObjectId;

describe('ResourceRepository', () => {
    describe('+dbCollectionInsertOne()', () => {
        it('should return the id for the created object', async () => {
            const result = await dbCollectionInsertOne(new Resource({ requiredField: 'testInsert' }));
            assert.isTrue(ObjectId.isValid(result.insertedId));
            insertOneId = result.insertedId;
        });
    });
    describe('+dbCollectionFindAll()',  () => {
        it('should return an array of length 1', async () => {
            const result = await dbCollectionFindAll()
            assert.lengthOf(result, 1);
        });
    });
    describe('+dbCollectionFindOne()', () => {
        it('should return the object for the given id', async () => {
            const result = await dbCollectionFindOne(insertOneId);
            assert.equal(result?.requiredField, 'testInsert');
        });
    });
    describe('+dbCollectionUpdateOne()', () => {
        it('should return modifiedCount == 1', async () => {
            const result = await dbCollectionUpdateOne(insertOneId, new Resource({requiredField: 'testUpdate'}));
            assert.equal(result.modifiedCount, 1);
        });
        it('should return modifiedCount == 0', async () => {
            const result = await dbCollectionUpdateOne(insertOneId, new Resource({requiredField: 'testUpdate'}));
            assert.equal(result.modifiedCount, 0);
        });
    });
    describe('+dbCollectionDeleteOne()', () => {
        it('should return 1', async () => {
            const result = await dbCollectionDeleteOne(insertOneId);
            assert.equal(result, 1);
        });
        it('should return 0', async () => {
            const result = await dbCollectionDeleteOne(insertOneId);
            assert.equal(result, 0);
        });
    });
});