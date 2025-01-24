import { Collection, MongoClient, ObjectId, UpdateResult } from 'mongodb';
import { Bank } from '../model/bank.js';
import { Properties } from '../../service/util/properties.js';
import { Account } from '../model/account.js';

const prop = Properties.instance;

const uri = prop.getProperty('db.uri');
const dbName = prop.getProperty('db.name');
const collectionName = prop.getProperty('db.accountsCollection');

export class AccountsRepository {
    static dbCollectionFindOne = async (bankId: ObjectId, accountId: ObjectId) => {
        const dbclient = new MongoClient(uri);
        try {
            const collection = dbclient.db(dbName).collection(collectionName);
            return await collection.find({_id: bankId, "accounts._id" : accountId }).toArray();
        } finally {
            dbclient.close();
        }
    }

    static dbCollectionInsertOne = async (bankId: ObjectId, account: Account) => {
        const dbclient = new MongoClient(uri);
        try {
            const insertId = new ObjectId();
            account._id = insertId;

            let opResult: NestedInsertResult;

            const collection: Collection<Bank> = dbclient.db(dbName).collection(collectionName);
            opResult = {
                result: await collection.updateOne({ _id: bankId }, { 
                    $push: { 
                        accounts: account
                    } 
                }),
                insertId: insertId
            };
            return opResult;
        } finally {
            dbclient.close();
        }
    }

    static dbCollectionUpdateOne = async (bankId: ObjectId, accountId: ObjectId, account: Account) => {
        const dbclient = new MongoClient(uri);
        try {
            const collection = dbclient.db(dbName).collection(collectionName);
            account._id = accountId;
            return await collection.updateOne({ _id: bankId, "accounts._id": accountId }, {
                $set: {'accounts.$': account }
            });
        } finally {
            dbclient.close();
        }
    }

    static dbCollectionDeleteOne = async (bankId: ObjectId, accountId: ObjectId) => {
        const dbclient = new MongoClient(uri);
        try {
            const collection: Collection<Bank> = dbclient.db(dbName).collection(collectionName);
            const opResult = await collection.updateOne({ _id: bankId }, { 
                $pull: { 
                    accounts: { _id: new ObjectId(accountId) }
                } 
            });
            return opResult;
        } finally {
            dbclient.close();
        }
    }
}

interface NestedInsertResult {
    result: UpdateResult,
    insertId: ObjectId
}