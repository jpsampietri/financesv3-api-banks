import { MongoClient, ObjectId } from 'mongodb';
import { Bank } from '../model/bank.js';
import { Properties } from '../../service/util/properties.js';

const prop = Properties.instance;

const uri = prop.getProperty('db.uri');
const dbName = prop.getProperty('db.name');
const collectionName = prop.getProperty('db.accountsCollection');

export class AccountsRepository {
    static dbCollectionInsertOne = async (content: Bank) => {
        const dbclient = new MongoClient(uri);
        try {
            const collection = dbclient.db(dbName).collection(collectionName);
            return await collection.insertOne(content);
        } finally {
            dbclient.close();
        }
    }

    static dbCollectionUpdateOne = async (_id: ObjectId, content: Bank) => {
        const dbclient = new MongoClient(uri);
        try {
            const collection = dbclient.db(dbName).collection(collectionName);
            const updateContent = {
                label: content.label,
                color: content.color
            };
            return await collection.updateOne({ _id: _id }, { $set: updateContent });
        } finally {
            dbclient.close();
        }
    }

    static dbCollectionDeleteOne = async (_id: ObjectId) => {
        const dbclient = new MongoClient(uri);
        try {
            const collection = dbclient.db(dbName).collection(collectionName);
            const result = await collection.deleteOne({ _id: _id });
            return result.deletedCount;
        } finally {
            dbclient.close();
        }
    }
}
