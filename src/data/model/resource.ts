import { Properties } from "../../service/util/properties.js";
import { APIMethod, APIResource } from "./apiResource.js";

const prop = Properties.instance;
const resourcePath = prop.getProperty('api.resourcePath');

export class Resource extends APIResource {
    requiredField: string;

    constructor(object: any) {
        super(object?._id);
        this.requiredField = object.requiredField;
    }

    fillStandardLinks(): void {
        super.fillStandardLinks(resourcePath);
    }
}