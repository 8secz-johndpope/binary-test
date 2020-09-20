"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const expect_1 = require("../../expect");
const to_json_1 = require("../../to-json");
describe('toJSON', () => {
    it('removes properties set to undefined', () => {
        const value = to_json_1.toJSON({
            title: 'a-todo-title',
            isComplete: undefined,
        });
        expectObjectValue(value, {
            title: 'a-todo-title',
        });
    });
    it('handles null', () => {
        const value = to_json_1.toJSON(null);
        expectNull(value);
    });
    it('handles undefined', () => {
        const value = to_json_1.toJSON(undefined);
        expectUndefined(value);
    });
    it('handles numbers', () => {
        const value = to_json_1.toJSON(123);
        expectNumericValue(value, 123);
    });
    it('handles strings', () => {
        const value = to_json_1.toJSON('text');
        expectStringValue(value, 'text');
    });
    it('handles booleans', () => {
        const value = to_json_1.toJSON(true);
        expectBooleanValue(value, true);
    });
    it('handles dates', () => {
        const value = to_json_1.toJSON(new Date('2018-01-01T00:00:00.000Z'));
        expectStringValue(value, '2018-01-01T00:00:00.000Z');
    });
    it('handles top-level arrays', () => {
        const value = to_json_1.toJSON([1, 'text']);
        expectArrayValue(value, [1, 'text']);
    });
    it('handles nested array', () => {
        const value = to_json_1.toJSON({ items: ['pen', 'pencil'] });
        expectObjectValue(value, { items: ['pen', 'pencil'] });
    });
    it('handles functions', () => {
        const value = to_json_1.toJSON(function foo() { });
        expectUndefined(value);
    });
    it('handles `object | null`', () => {
        const input = createValueOfUnionType({});
        const output = to_json_1.toJSON(input);
        expectComplexType(output, input);
    });
    it('handles `object | undefined`', () => {
        const input = createValueOfUnionType({});
        const output = to_json_1.toJSON(input);
        expectComplexType(output, input);
    });
    it('handles `object | null | undefined`', () => {
        const input = createValueOfUnionType({});
        const output = to_json_1.toJSON(input);
        expectComplexType(output, input);
    });
    it('handles `unknown[] | null`', () => {
        const input = createValueOfUnionType([]);
        const output = to_json_1.toJSON(input);
        expectComplexType(output, input);
    });
    it('handles `unknown[] | undefined`', () => {
        const input = createValueOfUnionType([]);
        const output = to_json_1.toJSON(input);
        expectComplexType(output, input);
    });
    it('handles `unknown[] | null | undefined`', () => {
        const input = createValueOfUnionType([]);
        const output = to_json_1.toJSON(input);
        expectComplexType(output, input);
    });
    it('handles classes with custom toJSON', () => {
        class Customer {
            constructor(id, email) {
                this.id = id;
                this.email = email;
                this._data = { id, email };
            }
            toJSON() {
                return { id: this.id, email: this.email };
            }
        }
        const value = to_json_1.toJSON(new Customer('an-id', 'test@example.com'));
        expectObjectValue(value, { id: 'an-id', email: 'test@example.com' });
        expect_1.expect(value.constructor).to.equal(Object);
    });
    it('handles nested class instance with custom toJSON', () => {
        class Address {
            constructor(street, city) {
                this.street = street;
                this.city = city;
            }
            toJSON() {
                return {
                    model: 'Address',
                    street: this.street,
                    city: this.city,
                };
            }
        }
        class Customer {
            constructor(email, address) {
                this.email = email;
                this.address = address;
            }
            toJSON() {
                return {
                    model: 'Customer',
                    email: this.email,
                    address: this.address,
                };
            }
        }
        const value = to_json_1.toJSON(new Customer('test@example.com', new Address('10 Downing Street', 'London')));
        expectObjectValue(value, {
            model: 'Customer',
            email: 'test@example.com',
            address: {
                model: 'Address',
                street: '10 Downing Street',
                city: 'London',
            },
        });
        expect_1.expect(value.constructor).to.equal(Object);
        expect_1.expect(value.address.constructor).to.equal(Object);
    });
});
// Helpers to enforce compile-time type checks
function expectStringValue(actual, expected) {
    expect_1.expect(actual).to.equal(expected);
}
function expectNumericValue(actual, expected) {
    expect_1.expect(actual).to.equal(expected);
}
function expectBooleanValue(actual, expected) {
    expect_1.expect(actual).to.equal(expected);
}
function expectObjectValue(actual, expected) {
    expect_1.expect(actual).to.deepEqual(expected);
}
function expectArrayValue(actual, expected) {
    expect_1.expect(actual).to.deepEqual(expected);
}
function expectNull(actual) {
    expect_1.expect(actual).to.be.null();
}
function expectUndefined(actual) {
    expect_1.expect(actual).to.be.undefined();
}
function expectComplexType(actual, expected) {
    expect_1.expect(actual).to.deepEqual(expected);
}
// A helper to force TypeScript to treat the given value as of a union type,
// e.g. treat `{}` as `object | undefined | null`.
function createValueOfUnionType(value) {
    return value;
}
//# sourceMappingURL=to-json.test.js.map