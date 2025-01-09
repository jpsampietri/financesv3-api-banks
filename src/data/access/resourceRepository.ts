import { MongoClient, ObjectId } from 'mongodb';
import { Resource } from '../model/resource.js';
import { Properties } from '../../service/util/properties.js';

const prop = Properties.instance;

const uri = prop.getProperty('db.uri');
const dbName = prop.getProperty('db.name');
const collectionName = prop.getProperty('db.collection');

export const dbCollectionFindAll = async () => {
    const dbclient = new MongoClient(uri);
    try {
        const collection = dbclient.db(dbName).collection(collectionName);
        const cursor = collection.find();
        let data: any = [];
        for await (const doc of cursor) {
            data.push(doc);
        }
        return data;
    } finally {
        dbclient.close();
    }
}

export const dbCollectionFindOne = async (_id: ObjectId) => {
    const dbclient = new MongoClient(uri);
    try {
        const collection = dbclient.db(dbName).collection(collectionName);
        return await collection.findOne({ _id: _id });
    } finally {
        dbclient.close();
    }
}

export const dbCollectionInsertOne = async (content: Resource) => {
    const dbclient = new MongoClient(uri);
    try {
        const collection = dbclient.db(dbName).collection(collectionName);
        return await collection.insertOne(content);
    } finally {
        dbclient.close();
    }
}

export const dbCollectionUpdateOne = async (_id: ObjectId, content: Resource) => {
    const dbclient = new MongoClient(uri);
    try {
        const collection = dbclient.db(dbName).collection(collectionName);
        return await collection.updateOne({ _id: _id }, { $set: { requiredField: content.requiredField} });
    } finally {
        dbclient.close();
    }
}

export const dbCollectionDeleteOne = async (_id: ObjectId) => {
    const dbclient = new MongoClient(uri);
    try {
        const collection = dbclient.db(dbName).collection(collectionName);
        const result = await collection.deleteOne({ _id: _id });
        return result.deletedCount;
    } finally {
        dbclient.close();
    }
}