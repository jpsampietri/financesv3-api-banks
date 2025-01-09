import { before, describe, it } from "mocha";
import { assert } from "chai";
import { MongoClient, ObjectId } from "mongodb";
import { Properties } from "../../../service/util/properties.js";
import { Resource } from "../../../data/model/resource.js";
import { deleteOne, findAll, findOne, insertOne, updateOne } from "../../../service/controller/resourceController.js";
import { APIError } from "../../../service/util/apiError.js";
let insertOneId: ObjectId;

describe('ResourceController', () => {
    describe('+insertOne()', () => {
        it('should return the created resource', async () => {
            const result: Resource = await insertOne({ requiredField: 'testInsert' });
            assert.equal(result.requiredField, 'testInsert');
            insertOneId = new ObjectId(result._id);
        });
    });
    describe('+findAll()',  () => {
        it('should return an array of length 1', async () => {
            const result = await findAll();
            assert.lengthOf(result, 1);
        });
    });
    describe('+findOne()', () => {
        it('should return the resource for the given id', async () => {
            const result = await findOne(insertOneId.toString());
            assert.equal(result?.requiredField, 'testInsert');
        });
    });
    describe('+updateOne()', () => {
        it('should return the modified resource', async () => {
            const result = await updateOne(insertOneId.toString(), new Resource({requiredField: 'testUpdate'}));
            assert.equal(result.requiredField, 'testUpdate');
        });
        it('should throw an error', async () => {
            try {
                await updateOne(insertOneId.toString(), new Resource({requiredField: 'testUpdate'}));
            } catch (error) {
                assert.instanceOf(error, APIError);
                assert.equal(error.message, 'Did not update the resource');
            };
        });
    });
    describe('+deleteOne()', () => {
        it('should return 1', async () => {
            const result = await deleteOne(insertOneId.toString());
            assert.equal(result, 1);
        });
        it('should return 0', async () => {
            const result = await deleteOne(insertOneId.toString());
            assert.equal(result, 0);
        });
    });
});