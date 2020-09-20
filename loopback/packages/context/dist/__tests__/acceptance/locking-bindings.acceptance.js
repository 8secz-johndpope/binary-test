"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Context bindings - Locking bindings', () => {
    describe('Binding with a duplicate key', () => {
        let ctx;
        let binding;
        before('given a context', createContext);
        before('and a bound key `foo`', createBinding);
        describe('when the binding', () => {
            context('is created', () => {
                it('is locked by default', () => {
                    testlab_1.expect(binding.isLocked).to.be.false();
                });
            });
            context('is locked', () => {
                before(lockBinding);
                it("sets it's lock state to true", () => {
                    testlab_1.expect(binding.isLocked).to.be.true();
                });
                function lockBinding() {
                    binding.lock();
                }
            });
        });
        describe('when the context', () => {
            context('is binding to an existing key', () => {
                it('throws a rebind error', () => {
                    const key = 'foo';
                    const operation = () => ctx.bind('foo');
                    testlab_1.expect(operation).to.throw(new RegExp(`Cannot rebind key "${key}" to a locked binding`));
                });
            });
        });
        function createContext() {
            ctx = new __1.Context();
        }
        function createBinding() {
            binding = ctx.bind('foo');
        }
    });
});
//# sourceMappingURL=locking-bindings.acceptance.js.map