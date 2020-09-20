"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Context bindings - Finding bindings', () => {
    let ctx;
    describe('Finding all binding', () => {
        before('given a context', createContext);
        before('with two simple bindings', () => {
            createBinding('foo', 'bar');
            createBinding('baz', 'qux');
        });
        describe('when I find all bindings', () => {
            it('returns all bindings', () => {
                const bindings = ctx.find();
                const keys = bindings.map(binding => {
                    return binding.key;
                });
                testlab_1.expect(keys).to.containDeep(['foo', 'baz']);
            });
        });
    });
    describe('Finding bindings by pattern', () => {
        before('given a context', createContext);
        before('with namespaced bindings', () => {
            createBinding('my.foo', 'bar');
            createBinding('my.baz', 'qux');
            createBinding('ur.quux', 'quuz');
        });
        describe('when I find all bindings using a pattern', () => {
            it('returns all bindings matching the pattern', () => {
                const bindings = ctx.find('my.*');
                const keys = bindings.map(binding => binding.key);
                testlab_1.expect(keys).to.containDeep(['my.foo', 'my.baz']);
                testlab_1.expect(keys).to.not.containDeep(['ur.quux']);
            });
        });
    });
    describe('Finding bindings by tag', () => {
        before('given a context', createContext);
        before('with tagged bindings', createTaggedBindings);
        describe('when I find binding by tag', () => {
            it('returns all bindings matching the tag', () => {
                const bindings = ctx.findByTag('dog');
                const dogs = bindings.map(binding => binding.key);
                testlab_1.expect(dogs).to.containDeep(['spot', 'fido']);
            });
        });
        function createTaggedBindings() {
            class Dog {
            }
            ctx.bind('spot').to(new Dog()).tag('dog');
            ctx.bind('fido').to(new Dog()).tag('dog');
        }
    });
    function createContext() {
        ctx = new __1.Context();
    }
    function createBinding(key, value) {
        ctx.bind(key).to(value);
    }
});
//# sourceMappingURL=finding-bindings.acceptance.js.map