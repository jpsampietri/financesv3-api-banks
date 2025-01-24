import { describe, it } from "mocha";
import { assert } from "chai";
import { Bank } from "../../../data/model/bank.js";
import { MongoClient, ObjectId } from "mongodb";
import { BanksRepository } from "../../../data/access/banksRepository.js";
import { AccountsRepository } from "../../../data/access/accountsRepository.js";
import { Account } from "../../../data/model/account.js";
import { Properties } from "../../../service/util/properties.js";
let bankId: ObjectId;
let insertOneId: ObjectId;

const prop = Properties.instance;

const uri = prop.getProperty('db.uri');
const dbName = prop.getProperty('db.name');
const collectionName = prop.getProperty('db.banksCollection');

before(async () => {
    const dbclient = new MongoClient(uri);
    try {
        const collection = dbclient.db(dbName).collection(collectionName);
        const result = await collection.insertOne(new Bank({label: 'testBank', color: '#FF0000'}));
        if (result.insertedId) {
            bankId = result.insertedId;
            prop.properties['bankId'] = result.insertedId;
        } else {
            throw new Error('Could not insert bank before accounts tests.')
        }
    } finally {
        dbclient.close();
    }
})
after(async () => {
    const dbclient = new MongoClient(uri);
    try {
        const collection = dbclient.db(dbName).collection(collectionName);
        const result = await collection.deleteOne({ _id: bankId });
        if (result.deletedCount != 1) {
            throw new Error('Could not delete bank after accounts tests.')
        }
    } finally {
        dbclient.close();
    }
})
describe('AccountsRepository', () => {
    describe('+dbCollectionInsertOne()', () => {
        it('should return the id for the created object', async () => {
            const result = await AccountsRepository.dbCollectionInsertOne(bankId, new Account({ label: 'testInsert', type: 'CREDIT' }));
            assert.isTrue(ObjectId.isValid(result.insertId));
            insertOneId = result.insertId;
        });
    });
    describe('+dbCollectionFindOne()',  () => {
        it('should return an array of length 1', async () => {
            const result = await AccountsRepository.dbCollectionFindOne(bankId, insertOneId);
            assert.lengthOf(result, 1);
            assert.lengthOf(result[0].accounts, 1);
            assert.equal(result[0].accounts[0].label, 'testInsert');
            assert.equal(result[0].accounts[0].type, 'CREDIT');
        });
    });
    describe('+dbCollectionUpdateOne()', () => {
        it('should return modifiedCount == 1', async () => {
            const result = await AccountsRepository.dbCollectionUpdateOne(bankId, insertOneId, new Account({label: 'testUpdate', type: 'CURRENT'}));
            assert.equal(result.modifiedCount, 1);
        });
        it('should return modifiedCount == 0', async () => {
            const result = await AccountsRepository.dbCollectionUpdateOne(bankId, insertOneId, new Account({label: 'testUpdate', type: 'CURRENT'}));
            assert.equal(result.modifiedCount, 0);
        });
    });
    describe('+dbCollectionDeleteOne()', () => {
        it('should return 1', async () => {
            const result = await AccountsRepository.dbCollectionDeleteOne(bankId, insertOneId);
            assert.equal(result.modifiedCount, 1);
        });
        it('should return 0', async () => {
            const result = await AccountsRepository.dbCollectionDeleteOne(bankId, insertOneId);
            assert.equal(result.modifiedCount, 0);
        });
    });
});