"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe(`Context bindings - Unlocking bindings`, () => {
    describe('Unlocking a locked binding', () => {
        let ctx;
        let binding;
        before('given a context', createContext);
        before('and a bound key `foo` that is locked', createLockedBinding);
        describe('when the binding', () => {
            context('is unlocked', () => {
                before(unlockBinding);
                it("sets it's lock state to false", () => {
                    testlab_1.expect(binding.isLocked).to.be.false();
                });
                function unlockBinding() {
                    binding.unlock();
                }
            });
        });
        describe('when the context', () => {
            context('rebinds the duplicate key with an unlocked binding', () => {
                it('does not throw a rebinding error', () => {
                    const operation = () => ctx.bind('foo').to('baz');
                    testlab_1.expect(operation).to.not.throw();
                });
                it('binds the duplicate key to the new value', async () => {
                    const result = await ctx.get('foo');
                    testlab_1.expect(result).to.equal('baz');
                });
            });
        });
        function createContext() {
            ctx = new __1.Context();
        }
        function createLockedBinding() {
            binding = ctx.bind('foo').to('bar');
            binding.lock();
        }
    });
});
//# sourceMappingURL=unlocking-bindings.acceptance.js.map