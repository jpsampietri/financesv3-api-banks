import { before, describe, it } from "mocha";
import { assert } from "chai";
import { Bank } from "../../../data/model/bank.js";
import { MongoClient, ObjectId } from "mongodb";
import { Properties } from "../../../service/util/properties.js";
import { BanksRepository } from "../../../data/access/banksRepository.js";
let insertOneId: ObjectId;

describe('BanksRepository', () => {
    describe('+dbCollectionInsertOne()', () => {
        it('should return the id for the created object', async () => {
            const result = await BanksRepository.dbCollectionInsertOne(new Bank({ label: 'testInsert', color: '#FFFFFF' }));
            assert.isTrue(ObjectId.isValid(result.insertedId));
            insertOneId = result.insertedId;
        });
    });
    describe('+dbCollectionFindAll()',  () => {
        it('should return an array of length 2', async () => {
            const result = await BanksRepository.dbCollectionFindAll()
            assert.lengthOf(result, 2);
        });
    });
    describe('+dbCollectionFindOne()', () => {
        it('should return the object for the given id', async () => {
            const result = await BanksRepository.dbCollectionFindOne(insertOneId);
            assert.equal(result?.label, 'testInsert');
            assert.equal(result?.color, '#FFFFFF');
        });
    });
    describe('+dbCollectionUpdateOne()', () => {
        it('should return modifiedCount == 1', async () => {
            const result = await BanksRepository.dbCollectionUpdateOne(insertOneId, new Bank({label: 'testUpdate', color: '#FFFF00'}));
            assert.equal(result.modifiedCount, 1);
        });
        it('should return modifiedCount == 0', async () => {
            const result = await BanksRepository.dbCollectionUpdateOne(insertOneId, new Bank({label: 'testUpdate', color: '#FFFF00'}));
            assert.equal(result.modifiedCount, 0);
        });
    });
    describe('+dbCollectionDeleteOne()', () => {
        it('should return 1', async () => {
            const result = await BanksRepository.dbCollectionDeleteOne(insertOneId);
            assert.equal(result, 1);
        });
        it('should return 0', async () => {
            const result = await BanksRepository.dbCollectionDeleteOne(insertOneId);
            assert.equal(result, 0);
        });
    });
});