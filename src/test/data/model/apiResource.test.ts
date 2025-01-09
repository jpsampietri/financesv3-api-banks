import { describe } from "mocha";
import { assert } from "chai";
import { APIMethod, APIResource } from "../../../data/model/apiResource.js";
import { ObjectId } from "mongodb";


describe('APIResource', () => {
    describe('+fillStandardLinks()', () => {
        it('should add three standard links to the APIResource object', () => {
            let resource = new APIResource(new ObjectId());
            resource.fillStandardLinks('/path');
            assert.lengthOf(resource.links, 3);
            assert.lengthOf(resource.links.filter(l => l.method == "GET"), 1);
            assert.lengthOf(resource.links.filter(l => l.method == "PUT"), 1);
            assert.lengthOf(resource.links.filter(l => l.method == "DELETE"), 1);
        });
    });
    describe('+addRelatedLink()', () => {
        it('should add a custom link to the APIResource object', () => {
            let resource = new APIResource(new ObjectId);
            resource.addRelatedLink('/path', 'related_test_resource', APIMethod.GET, '/test');
            assert.lengthOf(resource.links.filter(l => l.rel == 'related_test_resource'), 1);
        });
    });
});