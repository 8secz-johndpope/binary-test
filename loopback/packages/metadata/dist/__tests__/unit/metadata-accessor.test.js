"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/metadata
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('MetadataAccessor', () => {
    it('creates an accessor with a string key', () => {
        testlab_1.expect(__1.MetadataAccessor.create('foo')).to.have.property('key', 'foo');
    });
    it('overrides toString()', () => {
        testlab_1.expect(__1.MetadataAccessor.create('bar').toString()).to.equal('bar');
    });
    it('can be used to create decorator', () => {
        const nameKey = __1.MetadataAccessor.create('name');
        function classDecorator(name) {
            return __1.ClassDecoratorFactory.createDecorator(nameKey, name);
        }
        let MyController = class MyController {
        };
        MyController = tslib_1.__decorate([
            classDecorator('my-controller')
        ], MyController);
        testlab_1.expect(__1.MetadataInspector.getClassMetadata(nameKey, MyController)).to.equal('my-controller');
    });
});
//# sourceMappingURL=metadata-accessor.test.js.map