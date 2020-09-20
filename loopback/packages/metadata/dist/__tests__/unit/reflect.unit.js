"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/metadata
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const reflect_1 = require("../../reflect");
require("reflect-metadata");
function givenReflectContextWithNameSpace() {
    const namespace = 'sample-app-context';
    return new reflect_1.NamespacedReflect(namespace);
}
function givenReflectContext() {
    return new reflect_1.NamespacedReflect();
}
function givenDefaultReflector() {
    return reflect_1.Reflector;
}
describe('Reflect Context', () => {
    describe('with namespace', () => {
        runTests(givenReflectContextWithNameSpace());
    });
    describe('without namespace', () => {
        runTests(givenReflectContext());
    });
    describe('with default instance', () => {
        runTests(givenDefaultReflector());
    });
    function runTests(reflectContext) {
        afterEach(resetMetadata);
        it('adds metadata to a class', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key', metadataValue, SubClass);
            // get the defined metadata using the namespaced reflectContext
            let metadata = reflectContext.getMetadata('key', SubClass);
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            metadata = reflectContext.getOwnMetadata('key', SubClass);
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            // base class should not be impacted
            metadata = reflectContext.getOwnMetadata('key', BaseClass);
            testlab_1.expect(metadata).to.be.undefined();
            metadata = reflectContext.getMetadata('key', BaseClass);
            testlab_1.expect(metadata).to.be.undefined();
            let result = reflectContext.hasOwnMetadata('key', SubClass);
            testlab_1.expect(result).to.be.true();
            result = reflectContext.hasMetadata('key', SubClass);
            testlab_1.expect(result).to.be.true();
        });
        it('adds metadata to a static method', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key', metadataValue, SubClass, 'subStaticMethod');
            // get the defined metadata using the namespaced reflectContext
            let metadata = reflectContext.getMetadata('key', SubClass, 'subStaticMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            metadata = reflectContext.getOwnMetadata('key', SubClass, 'subStaticMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            let result = reflectContext.hasOwnMetadata('key', SubClass, 'subStaticMethod');
            testlab_1.expect(result).to.be.true();
            result = reflectContext.hasMetadata('key', SubClass, 'subStaticMethod');
            testlab_1.expect(result).to.be.true();
        });
        it('adds metadata to a prototype method', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key', metadataValue, SubClass.prototype, 'subMethod');
            // get the defined metadata using the namespaced reflectContext
            let metadata = reflectContext.getMetadata('key', SubClass.prototype, 'subMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            metadata = reflectContext.getOwnMetadata('key', SubClass.prototype, 'subMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            let result = reflectContext.hasOwnMetadata('key', SubClass.prototype, 'subMethod');
            testlab_1.expect(result).to.be.true();
            result = reflectContext.hasMetadata('key', SubClass.prototype, 'subMethod');
            testlab_1.expect(result).to.be.true();
        });
        it('deletes metadata from a class', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key', metadataValue, SubClass);
            // get the defined metadata using the namespaced reflectContext
            let metadata = reflectContext.getMetadata('key', SubClass);
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            let result = reflectContext.hasOwnMetadata('key', SubClass);
            testlab_1.expect(result).to.be.true();
            result = reflectContext.deleteMetadata('key', SubClass);
            testlab_1.expect(result).to.be.true();
            result = reflectContext.hasOwnMetadata('key', SubClass);
            testlab_1.expect(result).to.be.false();
            result = reflectContext.deleteMetadata('key1', SubClass);
            testlab_1.expect(result).to.be.false();
            metadata = reflectContext.getMetadata('key', SubClass);
            testlab_1.expect(metadata).to.be.undefined();
        });
        it('deletes metadata from a class static menthod', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key', metadataValue, SubClass.prototype, 'staticSubMethod');
            // get the defined metadata using the namespaced reflectContext
            let metadata = reflectContext.getMetadata('key', SubClass.prototype, 'staticSubMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            let result = reflectContext.hasOwnMetadata('key', SubClass.prototype, 'staticSubMethod');
            testlab_1.expect(result).to.be.true();
            result = reflectContext.deleteMetadata('key', SubClass.prototype, 'staticSubMethod');
            testlab_1.expect(result).to.be.true();
            result = reflectContext.hasOwnMetadata('key', SubClass.prototype, 'staticSubMethod');
            testlab_1.expect(result).to.be.false();
            result = reflectContext.deleteMetadata('key1', SubClass.prototype, 'staticSubMethod');
            testlab_1.expect(result).to.be.false();
            metadata = reflectContext.getMetadata('key', SubClass.prototype, 'staticSubMethod');
            testlab_1.expect(metadata).to.be.undefined();
        });
        it('deletes metadata from a class prototype menthod', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key', metadataValue, SubClass, 'subMethod');
            // get the defined metadata using the namespaced reflectContext
            let metadata = reflectContext.getMetadata('key', SubClass, 'subMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            let result = reflectContext.hasOwnMetadata('key', SubClass, 'subMethod');
            testlab_1.expect(result).to.be.true();
            result = reflectContext.deleteMetadata('key', SubClass, 'subMethod');
            testlab_1.expect(result).to.be.true();
            result = reflectContext.hasOwnMetadata('key', SubClass, 'subMethod');
            testlab_1.expect(result).to.be.false();
            result = reflectContext.deleteMetadata('key1', SubClass, 'subMethod');
            testlab_1.expect(result).to.be.false();
            metadata = reflectContext.getMetadata('key', SubClass, 'subMethod');
            testlab_1.expect(metadata).to.be.undefined();
        });
        it('adds metadata to a base class', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key', metadataValue, BaseClass);
            // get the defined metadata using the namespaced reflectContext
            let metadata = reflectContext.getMetadata('key', BaseClass);
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            metadata = reflectContext.getOwnMetadata('key', BaseClass);
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            metadata = reflectContext.getOwnMetadata('key', SubClass);
            testlab_1.expect(metadata).to.be.undefined();
            metadata = reflectContext.getMetadata('key', SubClass);
            testlab_1.expect(metadata).to.be.eql(metadataValue);
        });
        it('adds metadata to a base static method', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key', metadataValue, BaseClass, 'baseStaticMethod');
            // get the defined metadata using the namespaced reflectContext
            let metadata = reflectContext.getMetadata('key', BaseClass, 'baseStaticMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            metadata = reflectContext.getOwnMetadata('key', BaseClass, 'baseStaticMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            // sub class should have the metadata too
            metadata = reflectContext.getMetadata('key', SubClass, 'baseStaticMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            // sub class should not own the metadata
            metadata = reflectContext.getOwnMetadata('key', SubClass, 'baseStaticMethod');
            testlab_1.expect(metadata).to.be.undefined();
        });
        it('adds metadata to a base prototype method', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key', metadataValue, BaseClass.prototype, 'baseMethod');
            // get the defined metadata using the namespaced reflectContext
            let metadata = reflectContext.getMetadata('key', BaseClass.prototype, 'baseMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            metadata = reflectContext.getOwnMetadata('key', BaseClass.prototype, 'baseMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            // sub class should have the metadata too
            metadata = reflectContext.getMetadata('key', SubClass.prototype, 'baseMethod');
            testlab_1.expect(metadata).to.be.equal(metadataValue);
            // sub class should not own the metadata
            metadata = reflectContext.getOwnMetadata('key', SubClass.prototype, 'baseMethod');
            testlab_1.expect(metadata).to.be.undefined();
        });
        it('lists metadata keys of classes', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key1', metadataValue, SubClass);
            reflectContext.defineMetadata('key2', {}, BaseClass);
            let keys = reflectContext.getMetadataKeys(SubClass);
            testlab_1.expect(keys).to.eql(['key1', 'key2']);
            keys = reflectContext.getOwnMetadataKeys(SubClass);
            testlab_1.expect(keys).to.eql(['key1']);
            keys = reflectContext.getMetadataKeys(BaseClass);
            testlab_1.expect(keys).to.eql(['key2']);
            keys = reflectContext.getOwnMetadataKeys(BaseClass);
            testlab_1.expect(keys).to.eql(['key2']);
        });
        it('lists metadata keys of class methods', () => {
            const metadataValue = { value: 'sample' };
            reflectContext.defineMetadata('key3', metadataValue, SubClass, 'staticSubMethod');
            reflectContext.defineMetadata('key4', metadataValue, BaseClass, 'staticBaseMethod');
            reflectContext.defineMetadata('key5', metadataValue, SubClass.prototype, 'subMethod');
            reflectContext.defineMetadata('key6', metadataValue, SubClass.prototype, 'baseMethod');
            reflectContext.defineMetadata('abc:loopback:key7', metadataValue, BaseClass.prototype, 'baseMethod');
            let keys = reflectContext.getOwnMetadataKeys(SubClass, 'staticSubMethod');
            testlab_1.expect(keys).to.eql(['key3']);
            keys = reflectContext.getOwnMetadataKeys(SubClass, 'staticBaseMethod');
            testlab_1.expect(keys).to.eql([]);
            keys = reflectContext.getOwnMetadataKeys(BaseClass, 'staticBaseMethod');
            testlab_1.expect(keys).to.eql(['key4']);
            keys = reflectContext.getOwnMetadataKeys(SubClass.prototype, 'subMethod');
            testlab_1.expect(keys).to.eql(['key5']);
            keys = reflectContext.getOwnMetadataKeys(SubClass.prototype, 'baseMethod');
            testlab_1.expect(keys).to.eql(['key6']);
            keys = reflectContext.getMetadataKeys(SubClass.prototype, 'baseMethod');
            testlab_1.expect(keys).to.eql(['key6', 'abc:loopback:key7']);
            keys = reflectContext.getOwnMetadataKeys(BaseClass.prototype, 'baseMethod');
            testlab_1.expect(keys).to.eql(['abc:loopback:key7']);
        });
        it('checks hasMetadata against a class', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key1', metadataValue, SubClass);
            reflectContext.defineMetadata('key2', {}, BaseClass);
            let result = reflectContext.hasMetadata('key1', SubClass);
            testlab_1.expect(result).to.be.true();
            result = reflectContext.hasMetadata('key2', SubClass);
            testlab_1.expect(result).to.be.true();
            result = reflectContext.hasMetadata('key1', BaseClass);
            testlab_1.expect(result).to.be.false();
            result = reflectContext.hasMetadata('key2', BaseClass);
            testlab_1.expect(result).to.be.true();
        });
        it('checks hasOwnMetadata against a class', () => {
            const metadataValue = { value: 'sample' };
            // define a metadata using the namespaced reflectContext
            reflectContext.defineMetadata('key1', metadataValue, SubClass);
            reflectContext.defineMetadata('key2', {}, BaseClass);
            let result = reflectContext.hasOwnMetadata('key1', SubClass);
            testlab_1.expect(result).to.be.true();
            result = reflectContext.hasOwnMetadata('key2', SubClass);
            testlab_1.expect(result).to.be.false();
            result = reflectContext.hasOwnMetadata('key1', BaseClass);
            testlab_1.expect(result).to.be.false();
            result = reflectContext.hasOwnMetadata('key2', BaseClass);
            testlab_1.expect(result).to.be.true();
        });
        function deleteMetadata(target, propertyKey) {
            if (propertyKey) {
                const keys = reflectContext.getOwnMetadataKeys(target, propertyKey);
                for (const k of keys) {
                    reflectContext.deleteMetadata(k, target, propertyKey);
                }
            }
            else {
                const keys = reflectContext.getOwnMetadataKeys(target);
                for (const k of keys) {
                    reflectContext.deleteMetadata(k, target);
                }
            }
        }
        // Clean up the metadata
        function resetMetadata() {
            deleteMetadata(BaseClass);
            deleteMetadata(BaseClass, 'staticBaseMethod');
            deleteMetadata(BaseClass.prototype, 'baseMethod');
            deleteMetadata(SubClass);
            deleteMetadata(SubClass, 'staticSubMethod');
            deleteMetadata(SubClass.prototype, 'subMethod');
            deleteMetadata(SubClass.prototype, 'baseMethod');
        }
        class BaseClass {
            static staticBaseMethod() { }
            constructor() { }
            baseMethod() { }
        }
        class SubClass extends BaseClass {
            static staticSubMethod() { }
            constructor() {
                super();
            }
            baseMethod() {
                super.baseMethod();
            }
            subMethod() {
                return true;
            }
        }
    }
    describe('@Reflector.metadata', () => {
        const val1 = { x: 1 };
        const val2 = { y: 'a' };
        let TestClass = class TestClass {
            testMethod() { }
        };
        tslib_1.__decorate([
            reflect_1.Reflector.metadata('key2', val2),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", []),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass.prototype, "testMethod", null);
        TestClass = tslib_1.__decorate([
            reflect_1.Reflector.metadata('key1', val1)
        ], TestClass);
        it('adds metadata', () => {
            let meta = reflect_1.Reflector.getOwnMetadata('key1', TestClass);
            testlab_1.expect(meta).to.eql(val1);
            meta = reflect_1.Reflector.getOwnMetadata('key2', TestClass.prototype, 'testMethod');
            testlab_1.expect(meta).to.eql(val2);
        });
    });
    describe('@Reflector.decorate', () => {
        const val1 = { x: 1 };
        const val2 = { y: 'a' };
        class TestClass {
            testMethod() { }
        }
        it('adds metadata', () => {
            const x = reflect_1.Reflector.metadata('key1', val1);
            reflect_1.Reflector.decorate([x], TestClass);
            const y = reflect_1.Reflector.metadata('key2', val2);
            reflect_1.Reflector.decorate([y], TestClass.prototype, 'testMethod');
            let meta = reflect_1.Reflector.getOwnMetadata('key1', TestClass);
            testlab_1.expect(meta).to.eql(val1);
            meta = reflect_1.Reflector.getOwnMetadata('key2', TestClass.prototype, 'testMethod');
            testlab_1.expect(meta).to.eql(val2);
        });
    });
});
//# sourceMappingURL=reflect.unit.js.map