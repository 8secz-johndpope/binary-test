"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
function testBindingDecorator(injectable, name) {
    describe(name, () => {
        const expectedScopeAndTags = {
            tags: { rest: 'rest' },
            scope: __1.BindingScope.SINGLETON,
        };
        it('decorates a class', () => {
            const spec = {
                tags: ['rest'],
                scope: __1.BindingScope.SINGLETON,
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec)
            ], MyController);
            testlab_1.expect(inspectScopeAndTags(MyController)).to.eql(expectedScopeAndTags);
        });
        it('allows inheritance for certain tags and scope', () => {
            const spec = {
                tags: ['rest'],
                scope: __1.BindingScope.SINGLETON,
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec)
            ], MyController);
            class MySubController extends MyController {
            }
            testlab_1.expect(inspectScopeAndTags(MySubController)).to.eql(expectedScopeAndTags);
        });
        it('ignores `name` and `key` from base class', () => {
            const spec = {
                tags: [
                    'rest',
                    {
                        name: 'my-controller',
                        key: 'controllers.my-controller',
                    },
                ],
                scope: __1.BindingScope.SINGLETON,
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec)
            ], MyController);
            let MySubController = class MySubController extends MyController {
            };
            MySubController = tslib_1.__decorate([
                injectable()
            ], MySubController);
            const result = inspectScopeAndTags(MySubController);
            testlab_1.expect(result).to.containEql(expectedScopeAndTags);
            testlab_1.expect(result.tags).to.not.containEql({
                name: 'my-controller',
            });
            testlab_1.expect(result.tags).to.not.containEql({
                key: 'controllers.my-controller',
            });
        });
        it('accepts template functions', () => {
            const spec = binding => {
                binding.tag('rest').inScope(__1.BindingScope.SINGLETON);
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec)
            ], MyController);
            testlab_1.expect(inspectScopeAndTags(MyController)).to.eql(expectedScopeAndTags);
        });
        it('accepts multiple scope/tags', () => {
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable({ tags: 'rest' }, { scope: __1.BindingScope.SINGLETON })
            ], MyController);
            testlab_1.expect(inspectScopeAndTags(MyController)).to.eql(expectedScopeAndTags);
        });
        it('accepts multiple template functions', () => {
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(binding => binding.tag('rest'), binding => binding.inScope(__1.BindingScope.SINGLETON))
            ], MyController);
            testlab_1.expect(inspectScopeAndTags(MyController)).to.eql(expectedScopeAndTags);
        });
        it('accepts both template functions and tag/scopes', () => {
            const spec = binding => {
                binding.tag('rest').inScope(__1.BindingScope.SINGLETON);
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec, { tags: [{ name: 'my-controller' }] })
            ], MyController);
            testlab_1.expect(inspectScopeAndTags(MyController)).to.eql({
                tags: { rest: 'rest', name: 'my-controller' },
                scope: __1.BindingScope.SINGLETON,
            });
        });
        it('allows the decorator to be applied multiple times', () => {
            const spec = binding => {
                binding.tag('rest').inScope(__1.BindingScope.SINGLETON);
            };
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable(spec),
                injectable({ tags: [{ name: 'my-controller' }] })
            ], MyController);
            testlab_1.expect(inspectScopeAndTags(MyController)).to.eql({
                tags: { rest: 'rest', name: 'my-controller' },
                scope: __1.BindingScope.SINGLETON,
            });
        });
        it('allows the decorator to override metadata from others', () => {
            let MyController = class MyController {
            };
            MyController = tslib_1.__decorate([
                injectable({
                    scope: __1.BindingScope.SINGLETON,
                    tags: { rest: 'rest', grpc: false },
                }),
                injectable({
                    scope: __1.BindingScope.TRANSIENT,
                    tags: { name: 'my-controller', grpc: true },
                })
            ], MyController);
            testlab_1.expect(inspectScopeAndTags(MyController)).to.eql({
                tags: { rest: 'rest', name: 'my-controller', grpc: false },
                scope: __1.BindingScope.SINGLETON,
            });
        });
        it('decorates a provider classes', () => {
            const spec = {
                tags: ['rest'],
                scope: __1.BindingScope.CONTEXT,
            };
            let MyProvider = class MyProvider {
                value() {
                    return 'my-value';
                }
            };
            MyProvider = tslib_1.__decorate([
                injectable.provider(spec)
            ], MyProvider);
            testlab_1.expect(inspectScopeAndTags(MyProvider)).to.eql({
                tags: { rest: 'rest', type: 'provider', provider: 'provider' },
                scope: __1.BindingScope.CONTEXT,
            });
        });
        it('recognizes provider classes', () => {
            const spec = {
                tags: ['rest', { type: 'provider' }],
                scope: __1.BindingScope.CONTEXT,
            };
            let MyProvider = class MyProvider {
                value() {
                    return 'my-value';
                }
            };
            MyProvider = tslib_1.__decorate([
                injectable(spec)
            ], MyProvider);
            testlab_1.expect(inspectScopeAndTags(MyProvider)).to.eql({
                tags: { rest: 'rest', type: 'provider', provider: 'provider' },
                scope: __1.BindingScope.CONTEXT,
            });
        });
        function inspectScopeAndTags(cls) {
            const templateFn = __1.bindingTemplateFor(cls);
            const bindingTemplate = new __1.Binding('template').apply(templateFn);
            return {
                scope: bindingTemplate.scope,
                tags: bindingTemplate.tagMap,
            };
        }
    });
}
// Test @injectable
testBindingDecorator(__1.injectable, '@injectable');
// Test @bind
testBindingDecorator(__1.bind, '@bind');
//# sourceMappingURL=binding-decorator.unit.js.map