import { before, describe, it } from "mocha";
import { assert } from "chai";
import { MongoClient, ObjectId } from "mongodb";
import { Properties } from "../../../service/util/properties.js";
import { Bank } from "../../../data/model/bank.js";
import { deleteOne, findAll, findOne, insertOne, updateOne } from "../../../service/controller/banksController.js";
import { APIError } from "../../../service/util/apiError.js";
let insertOneId: ObjectId;

describe('BanksController', () => {
    describe('+insertOne()', () => {
        it('should return the created resource', async () => {
            const result: Bank = await insertOne({ label: 'testInsert', color: '#FFFFFF' });
            assert.equal(result.label, 'testInsert');
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
            assert.equal(result?.label, 'testInsert');
            assert.equal(result?.color, '#FFFFFF');
        });
    });
    describe('+updateOne()', () => {
        it('should return the modified resource', async () => {
            const result = await updateOne(insertOneId.toString(), new Bank({ label: 'testUpdate', color: '#FFFF00' }));
            assert.equal(result?.label, 'testUpdate');
            assert.equal(result?.color, '#FFFF00');
        });
        it('should throw an error', async () => {
            try {
                await updateOne(insertOneId.toString(), new Bank({ label: 'testInsert', color: '#FFFFFF' }));
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