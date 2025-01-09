import { ObjectId } from "mongodb";

export class APIResource {
    _id?: ObjectId;
    links: Link[];
    constructor(_id?: ObjectId) {
        if (_id) {
            this._id = _id;
        }
        this.links = [];
    }

    fillStandardLinks(path: string, customPrepend?: string): void {
        const base: string = '/api/v1';

        let prepend: string;
        if (customPrepend) {
            prepend = customPrepend;
        } else {
            prepend = '';
        }

        this.links.push({ href: base + prepend + path + '/' + this._id, rel: 'self', method: APIMethod.GET });
        this.links.push({ href: base + prepend + path + '/' + this._id, rel: 'update', method: APIMethod.PUT });
        this.links.push({ href: base + prepend + path + '/' + this._id, rel: 'delete', method: APIMethod.DELETE });
    }
    
    addRelatedLink(path: string, rel: string, method: APIMethod, customAppend?: string, customBase?: string, customPrepend?: string): void {
        let base: string;
        if (customBase) {
            base = customBase;
        } else {
            base = '/api/v1';
        }

        let prepend: string;
        if (customPrepend) {
            prepend = customPrepend;
        } else {
            prepend = '';
        }

        let append: string;
        if (customAppend) {
            append = customAppend;
        } else {
            append = '';
        }

        this.links.push({ href: base + prepend + path + '/' + this._id + append, rel: rel, method: method });
    }
}

export interface Link {
    href: string;
    rel: string;
    method: APIMethod;
}

export enum APIMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}