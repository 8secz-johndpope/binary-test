"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const __1 = require("../..");
describe('isPromise', () => {
    it('returns false for undefined', () => {
        testlab_1.expect(__1.isPromiseLike(undefined)).to.be.false();
    });
    it('returns false for a string value', () => {
        testlab_1.expect(__1.isPromiseLike('string-value')).to.be.false();
    });
    it('returns false for a plain object', () => {
        testlab_1.expect(__1.isPromiseLike({ foo: 'bar' })).to.be.false();
    });
    it('returns false for an array', () => {
        testlab_1.expect(__1.isPromiseLike([1, 2, 3])).to.be.false();
    });
    it('returns false for a Date', () => {
        testlab_1.expect(__1.isPromiseLike(new Date())).to.be.false();
    });
    it('returns true for a native Promise', () => {
        testlab_1.expect(__1.isPromiseLike(Promise.resolve())).to.be.true();
    });
    it('returns true for a Bluebird Promise', () => {
        testlab_1.expect(__1.isPromiseLike(bluebird_1.default.resolve())).to.be.true();
    });
    it('returns false when .then() is not a function', () => {
        testlab_1.expect(__1.isPromiseLike({ then: 'later' })).to.be.false();
    });
});
//# sourceMappingURL=is-promise.unit.js.map