"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
describe('Provider', () => {
    let provider;
    beforeEach(givenProvider);
    describe('value()', () => {
        it('returns the value of the binding', () => {
            testlab_1.expect(provider.value()).to.equal('hello world');
        });
    });
    function givenProvider() {
        provider = new MyProvider('hello');
    }
});
class MyProvider {
    constructor(_msg) {
        this._msg = _msg;
    }
    value() {
        return this._msg + ' world';
    }
}
//# sourceMappingURL=provider.unit.js.map