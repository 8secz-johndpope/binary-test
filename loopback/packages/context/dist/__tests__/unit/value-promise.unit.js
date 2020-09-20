"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('getDeepProperty', () => {
    it('gets the root value if path is empty', () => {
        const obj = { x: { y: 1 } };
        testlab_1.expect(__1.getDeepProperty(obj, '')).to.eql(obj);
    });
    it('gets the root value with a name', () => {
        const obj = { x: { y: 1 } };
        testlab_1.expect(__1.getDeepProperty(obj, 'x')).to.eql({ y: 1 });
    });
    it('gets the root value with a path', () => {
        const obj = { x: { y: 1 } };
        testlab_1.expect(__1.getDeepProperty(obj, 'x.y')).to.eql(1);
    });
    it('returns undefined for non-existent path', () => {
        const obj = { x: { y: 1 } };
        testlab_1.expect(__1.getDeepProperty(obj, 'x.z')).to.be.undefined();
    });
    it('allows undefined value', () => {
        testlab_1.expect(__1.getDeepProperty(undefined, 'x.z')).to.be.undefined();
        testlab_1.expect(__1.getDeepProperty(null, 'x.z')).to.be.undefined();
    });
    it('allows null value', () => {
        testlab_1.expect(__1.getDeepProperty({ x: { z: null } }, 'x.z')).to.be.null();
        testlab_1.expect(__1.getDeepProperty(null, '')).to.be.null();
    });
    it('allows boolean value', () => {
        testlab_1.expect(__1.getDeepProperty(true, 'x.z')).to.be.undefined();
    });
    it('allows number value', () => {
        testlab_1.expect(__1.getDeepProperty(1, 'x.z')).to.be.undefined();
        testlab_1.expect(__1.getDeepProperty(NaN, 'x.z')).to.be.undefined();
    });
    it('allows to get length string value', () => {
        testlab_1.expect(__1.getDeepProperty('xyz', 'length')).to.eql(3);
    });
    it('allows to get length and items of an array by index', () => {
        const arr = ['x', 'y'];
        testlab_1.expect(__1.getDeepProperty(arr, 'length')).to.eql(2);
        testlab_1.expect(__1.getDeepProperty(arr, '0')).to.eql('x');
        testlab_1.expect(__1.getDeepProperty(arr, '1')).to.eql('y');
    });
    it('allows to get items of a nested array by index', () => {
        const obj = { a: ['x', 'y'] };
        testlab_1.expect(__1.getDeepProperty(obj, 'a.0')).to.eql('x');
        testlab_1.expect(__1.getDeepProperty(obj, 'a.1')).to.eql('y');
    });
    it('allows to use parameter types', () => {
        const arr = ['x', 'y'];
        testlab_1.expect(__1.getDeepProperty(arr, 'length')).to.eql(2);
        testlab_1.expect(__1.getDeepProperty(arr, '0')).to.eql('x');
        testlab_1.expect(__1.getDeepProperty(arr, '1')).to.eql('y');
        testlab_1.expect(__1.getDeepProperty(arr, '1')).to.eql('y');
    });
});
describe('resolveList', () => {
    it('resolves an array of values', () => {
        const source = ['a', 'b'];
        const result = __1.resolveList(source, v => v.toUpperCase());
        testlab_1.expect(result).to.eql(['A', 'B']);
    });
    it('resolves an array of promises', async () => {
        const source = ['a', 'b'];
        const result = await __1.resolveList(source, v => Promise.resolve(v.toUpperCase()));
        testlab_1.expect(result).to.eql(['A', 'B']);
    });
    it('resolves an array of promises or values', async () => {
        const source = ['a', 'b'];
        const result = await __1.resolveList(source, v => v === 'a' ? 'A' : Promise.resolve(v.toUpperCase()));
        testlab_1.expect(result).to.eql(['A', 'B']);
    });
    it('resolves an array of promises or values with index', async () => {
        const source = ['a', 'b'];
        const result = await __1.resolveList(source, (v, i) => v === 'a' ? 'A' + i : Promise.resolve(v.toUpperCase() + i));
        testlab_1.expect(result).to.eql(['A0', 'B1']);
    });
    it('resolves an object of values with index and array', () => {
        const result = __1.resolveList(['a', 'b'], (v, i, list) => {
            return v.toUpperCase() + i + list.length;
        });
        testlab_1.expect(result).to.eql(['A02', 'B12']);
    });
});
describe('resolveMap', () => {
    it('resolves an object of values', () => {
        const source = { a: 'x', b: 'y' };
        const result = __1.resolveMap(source, v => v.toUpperCase());
        testlab_1.expect(result).to.eql({ a: 'X', b: 'Y' });
    });
    it('does not set a key with value undefined', () => {
        const source = { a: 'x', b: undefined };
        const result = __1.resolveMap(source, v => v === null || v === void 0 ? void 0 : v.toUpperCase());
        testlab_1.expect(result).to.not.have.property('b');
        testlab_1.expect(result).to.eql({ a: 'X' });
    });
    it('resolves an object of promises', async () => {
        const source = { a: 'x', b: 'y' };
        const result = await __1.resolveMap(source, v => Promise.resolve(v.toUpperCase()));
        testlab_1.expect(result).to.eql({ a: 'X', b: 'Y' });
    });
    it('does not set a key with promise resolved to undefined', async () => {
        const source = { a: 'x', b: undefined };
        const result = await __1.resolveMap(source, v => Promise.resolve(v === null || v === void 0 ? void 0 : v.toUpperCase()));
        testlab_1.expect(result).to.not.have.property('b');
        testlab_1.expect(result).to.eql({ a: 'X' });
    });
    it('resolves an object of promises or values', async () => {
        const source = { a: 'x', b: 'y' };
        const result = await __1.resolveMap(source, v => v === 'x' ? 'X' : Promise.resolve(v.toUpperCase()));
        testlab_1.expect(result).to.eql({ a: 'X', b: 'Y' });
    });
    it('resolves an object of promises or values with key', async () => {
        const source = { a: 'x', b: 'y' };
        const result = await __1.resolveMap(source, (v, p) => v === 'x' ? 'X' + p : Promise.resolve(v.toUpperCase() + p));
        testlab_1.expect(result).to.eql({ a: 'Xa', b: 'Yb' });
    });
    it('resolves an object of values with key and object', () => {
        const result = __1.resolveMap({ a: 'x', b: 'y' }, (v, p, map) => {
            return v.toUpperCase() + p + Object.keys(map).length;
        });
        testlab_1.expect(result).to.eql({ a: 'Xa2', b: 'Yb2' });
    });
});
describe('resolveUntil', () => {
    it('resolves an iterator of values', () => {
        const source = ['a', 'b', 'c'];
        const result = __1.resolveUntil(source[Symbol.iterator](), v => v.toUpperCase(), (s, v) => s === 'a');
        testlab_1.expect(result).to.eql('A');
    });
    it('resolves an iterator of values until the end', () => {
        const source = ['a', 'b', 'c'];
        const result = __1.resolveUntil(source[Symbol.iterator](), v => v.toUpperCase(), (s, v) => false);
        testlab_1.expect(result).to.be.undefined();
    });
    it('resolves an iterator of promises', async () => {
        const source = ['a', 'b', 'c'];
        const result = await __1.resolveUntil(source[Symbol.iterator](), v => Promise.resolve(v.toUpperCase()), (s, v) => true);
        testlab_1.expect(result).to.eql('A');
    });
    it('handles a rejected promise from resolver', async () => {
        const source = ['a', 'b', 'c'];
        const result = __1.resolveUntil(source[Symbol.iterator](), v => Promise.reject(new Error(v)), (s, v) => true);
        await testlab_1.expect(result).be.rejectedWith('a');
    });
    it('reports an error thrown from resolver', () => {
        const source = ['a', 'b', 'c'];
        const task = () => __1.resolveUntil(source[Symbol.iterator](), v => {
            throw new Error(v);
        }, (s, v) => true);
        testlab_1.expect(task).throw('a');
    });
    it('handles a rejected promise from evaluator', async () => {
        const source = ['a', 'b', 'c'];
        const result = __1.resolveUntil(source[Symbol.iterator](), async (v) => v.toUpperCase(), (s, v) => {
            throw new Error(v);
        });
        await testlab_1.expect(result).be.rejectedWith('A');
    });
    it('handles mixed value and promise items ', async () => {
        const source = ['b', 'C', 'B', 'c', 'a', 'A'];
        const result = await __1.resolveUntil(source[Symbol.iterator](), v => {
            const up = v.toUpperCase();
            if (up === v)
                return up;
            // Produces a value for upper case
            else
                return Promise.resolve(up); // Produces a promise for lower case
        }, (s, v) => s === 'a');
        testlab_1.expect(result).to.eql('A');
    });
    it('does not cause stack overflow for large # of value items', () => {
        // Create a large array of 1000 items
        const source = new Array(1000);
        // Fill 0-949 with 'b'
        source.fill('b', 0, 950);
        // Fill 950-999 with 'a'
        source.fill('a', 950);
        const result = __1.resolveUntil(source[Symbol.iterator](), v => v.toUpperCase(), (s, v) => s === 'a');
        testlab_1.expect(result).to.eql('A');
    });
    it('does not cause stack overflow for large # of promise items', async () => {
        // Create a large array of 1000 items
        const source = new Array(1000);
        // Fill 0-949 with 'b'
        source.fill('b', 0, 950);
        // Fill 950-999 with 'a'
        source.fill('a', 950);
        const result = await __1.resolveUntil(source[Symbol.iterator](), v => Promise.resolve(v.toUpperCase()), (s, v) => s === 'a');
        testlab_1.expect(result).to.eql('A');
    });
});
describe('transformValueOrPromise', () => {
    it('transforms a value', () => {
        const result = __1.transformValueOrPromise('a', v => v === null || v === void 0 ? void 0 : v.toUpperCase());
        testlab_1.expect(result).to.eql('A');
    });
    it('transforms a promise', async () => {
        const result = await __1.transformValueOrPromise(Promise.resolve('a'), v => v === null || v === void 0 ? void 0 : v.toUpperCase());
        testlab_1.expect(result).to.eql('A');
    });
    it('transforms a value to promise', async () => {
        const result = await __1.transformValueOrPromise('a', v => Promise.resolve(v === null || v === void 0 ? void 0 : v.toUpperCase()));
        testlab_1.expect(result).to.eql('A');
    });
    it('handles a rejected promise from the transformer', async () => {
        const result = __1.transformValueOrPromise('a', v => Promise.reject(new Error(v)));
        await testlab_1.expect(result).be.rejectedWith('a');
    });
    it('handles an error thrown from the transformer', () => {
        testlab_1.expect(() => __1.transformValueOrPromise('a', v => {
            throw new Error(v);
        })).to.throw('a');
    });
});
//# sourceMappingURL=value-promise.unit.js.map