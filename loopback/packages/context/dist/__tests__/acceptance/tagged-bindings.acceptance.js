"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Context bindings - Tagged bindings', () => {
    let ctx;
    let binding;
    before('given a context', createContext);
    before(createBinding);
    describe('tag', () => {
        context('when the binding is tagged', () => {
            before(tagBinding);
            it('has a tag name', () => {
                testlab_1.expect(binding.tagNames).to.containEql('controller');
            });
            function tagBinding() {
                binding.tag('controller');
            }
        });
        context('when the binding is tagged with multiple names', () => {
            before(tagBinding);
            it('has tags', () => {
                testlab_1.expect(binding.tagNames).to.containEql('controller');
                testlab_1.expect(binding.tagNames).to.containEql('rest');
            });
            function tagBinding() {
                binding.tag('controller', 'rest');
            }
        });
        context('when the binding is tagged with name/value objects', () => {
            before(tagBinding);
            it('has tags', () => {
                testlab_1.expect(binding.tagNames).to.containEql('controller');
                testlab_1.expect(binding.tagNames).to.containEql('name');
                testlab_1.expect(binding.tagMap).to.containEql({
                    name: 'my-controller',
                    controller: 'controller',
                });
            });
            function tagBinding() {
                binding.tag({ name: 'my-controller' }, 'controller');
            }
        });
    });
    function createContext() {
        ctx = new __1.Context();
    }
    function createBinding() {
        binding = ctx.bind('foo').to('bar');
    }
});
//# sourceMappingURL=tagged-bindings.acceptance.js.map