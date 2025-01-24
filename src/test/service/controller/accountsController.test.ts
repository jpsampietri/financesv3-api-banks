import { before, describe, it } from "mocha";
import { assert } from "chai";
import { MongoClient, ObjectId } from "mongodb";
import { Properties } from "../../../service/util/properties.js";
import { Bank } from "../../../data/model/bank.js";
import { APIError } from "../../../service/util/apiError.js";
import { BanksController } from "../../../service/controller/banksController.js";
import { AccountsController } from "../../../service/controller/accountsController.js";
import { Account } from "../../../data/model/account.js";
let insertOneId: ObjectId;

const prop = Properties.instance;
let bankId: string;
describe('AccountsController', () => {
    describe('valid bankId', () => {
        it('should be a valid ObjectId', () => {
            bankId = prop.getProperty('bankId');
            assert.isTrue(ObjectId.isValid(bankId));
        });
    });
    describe('+insertOne()', () => {
        it('should return the created resource', async () => {
            const result = await AccountsController.insertOne(bankId, { label: 'testInsert', type: 'CREDIT' });
            assert.equal(result.label, 'testInsert');
            insertOneId = new ObjectId(result._id);
        });
    });
    describe('+findAll()',  () => {
        it('should return an array of length 1', async () => {
            const result = await AccountsController.findAll(bankId);
            assert.lengthOf(result, 1);
        });
    });
    describe('+findOne()', () => {
        it('should return the resource for the given id', async () => {
            const result = await AccountsController.findOne(bankId, insertOneId.toString());
            assert.equal(result?.label, 'testInsert');
            assert.equal(result?.type, 'CREDIT');
        });
    });
    describe('+updateOne()', () => {
        it('should return the modified resource', async () => {
            const result = await AccountsController.updateOne(bankId, insertOneId.toString(), { label: 'testUpdate', type: 'CURRENT' });
            assert.equal(result?.label, 'testUpdate');
            assert.equal(result?.type, 'CURRENT');
        });
        it('should throw an error', async () => {
            try {
                await AccountsController.updateOne(bankId, insertOneId.toString(), { label: 'testUpdate', type: 'CURRENT' });
            } catch (error) {
                assert.instanceOf(error, APIError);
                assert.equal(error.message, 'Did not update the resource');
            };
        });
    });
    describe('+deleteOne()', () => {
        it('should return 1', async () => {
            const result = await AccountsController.deleteOne(bankId, insertOneId.toString());
            assert.equal(result, 1);
        });
        it('should return 0', async () => {
            const result = await AccountsController.deleteOne(bankId, insertOneId.toString());
            assert.equal(result, 0);
        });
    });
});