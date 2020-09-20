"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const unique_id_1 = require("../../unique-id");
describe('BindingKey', () => {
    describe('create', () => {
        it('creates a key with a binding key only', () => {
            testlab_1.expect(__1.BindingKey.create('foo')).to.have.properties({
                key: 'foo',
                propertyPath: undefined,
            });
        });
        it('creates a key with a binding key and a property path', () => {
            testlab_1.expect(__1.BindingKey.create('foo', 'port')).to.have.properties({
                key: 'foo',
                propertyPath: 'port',
            });
        });
        it('creates a key with a property path parsed from the key arg', () => {
            const keyString = __1.BindingKey.create('foo', 'port').toString();
            testlab_1.expect(__1.BindingKey.create(keyString)).to.have.properties({
                key: 'foo',
                propertyPath: 'port',
            });
        });
        it('rejects a key with an encoded path when the path arg is provided', () => {
            testlab_1.expect(() => __1.BindingKey.create('foo#port', 'port')).to.throw(/Binding key.*cannot contain/);
        });
    });
    describe('buildKeyWithPath', () => {
        it('composes address parts using correct separator', () => {
            testlab_1.expect(__1.BindingKey.create('foo', 'bar').toString()).to.equal('foo#bar');
        });
    });
    describe('parseKeyWithPath', () => {
        it('parses key without path', () => {
            testlab_1.expect(__1.BindingKey.parseKeyWithPath('foo')).to.have.properties({
                key: 'foo',
                propertyPath: undefined,
            });
        });
        it('parses key with path', () => {
            testlab_1.expect(__1.BindingKey.parseKeyWithPath('foo#bar')).to.have.properties({
                key: 'foo',
                propertyPath: 'bar',
            });
        });
    });
    describe('generate', () => {
        it('generates binding key without namespace', () => {
            const key1 = __1.BindingKey.generate().key;
            testlab_1.expect(key1).to.match(new RegExp(`^${unique_id_1.UNIQUE_ID_PATTERN.source}$`));
            const key2 = __1.BindingKey.generate().key;
            testlab_1.expect(key1).to.not.eql(key2);
        });
        it('generates binding key with namespace', () => {
            const key1 = __1.BindingKey.generate('services').key;
            testlab_1.expect(key1).to.match(new RegExp(`^services\\.${unique_id_1.UNIQUE_ID_PATTERN.source}$`, 'i'));
            const key2 = __1.BindingKey.generate('services').key;
            testlab_1.expect(key1).to.not.eql(key2);
        });
    });
});
//# sourceMappingURL=binding-key.unit.js.map