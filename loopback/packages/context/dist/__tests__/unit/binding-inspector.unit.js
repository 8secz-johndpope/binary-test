"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const inject_1 = require("../../inject");
describe('createBindingFromClass()', () => {
    it('inspects classes', () => {
        const spec = {
            tags: { type: 'controller', name: 'my-controller', rest: 'rest' },
            scope: __1.BindingScope.SINGLETON,
        };
        let MyController = class MyController {
        };
        MyController = tslib_1.__decorate([
            __1.injectable(spec)
        ], MyController);
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyController, ctx);
        testlab_1.expect(binding.scope).to.eql(spec.scope);
        testlab_1.expect(binding.tagMap).to.containEql({
            name: 'my-controller',
            type: 'controller',
            rest: 'rest',
        });
        testlab_1.expect(ctx.getSync(binding.key)).to.be.instanceof(MyController);
    });
    it('inspects classes without @injectable', () => {
        class MyController {
        }
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyController, ctx);
        testlab_1.expect(binding.key).to.eql('classes.MyController');
        testlab_1.expect(ctx.getSync(binding.key)).to.be.instanceof(MyController);
    });
    it('supports options to customize class bindings with @injectable', () => {
        const spec = {
            tags: { name: 'my-controller', rest: 'rest' },
            scope: __1.BindingScope.SINGLETON,
        };
        let MyController = class MyController {
        };
        MyController = tslib_1.__decorate([
            __1.injectable(spec)
        ], MyController);
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyController, ctx, {
            key: 'controllers.controller1',
        });
        testlab_1.expect(binding.key).to.eql('controllers.controller1');
        testlab_1.expect(binding.tagMap).to.containEql({
            name: 'my-controller',
            rest: 'rest',
        });
    });
    it('supports options to customize class bindings without @injectable', () => {
        class MyController {
        }
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyController, ctx, {
            type: 'controller',
            namespace: 'controllers',
            name: 'my-controller',
        });
        testlab_1.expect(binding.key).to.eql('controllers.my-controller');
        testlab_1.expect(binding.tagMap).to.containEql({
            controller: 'controller',
            name: 'my-controller',
            type: 'controller',
        });
        testlab_1.expect(ctx.getSync(binding.key)).to.be.instanceof(MyController);
    });
    it('inspects provider classes', () => {
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
            __1.injectable.provider(spec)
        ], MyProvider);
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyProvider, ctx);
        testlab_1.expect(binding.key).to.eql('providers.MyProvider');
        testlab_1.expect(binding.scope).to.eql(spec.scope);
        testlab_1.expect(binding.tagMap).to.containDeep({
            type: 'provider',
            provider: 'provider',
            rest: 'rest',
        });
        testlab_1.expect(ctx.getSync(binding.key)).to.eql('my-value');
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
            __1.injectable(spec)
        ], MyProvider);
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyProvider, ctx);
        testlab_1.expect(binding.key).to.eql('providers.MyProvider');
        testlab_1.expect(binding.scope).to.eql(spec.scope);
        testlab_1.expect(binding.tagMap).to.containDeep({
            type: 'provider',
            provider: 'provider',
            rest: 'rest',
        });
        testlab_1.expect(ctx.getSync(binding.key)).to.eql('my-value');
    });
    it('recognizes provider classes without @injectable', () => {
        class MyProvider {
            value() {
                return 'my-value';
            }
        }
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyProvider, ctx);
        testlab_1.expect(binding.key).to.eql('providers.MyProvider');
        testlab_1.expect(ctx.getSync(binding.key)).to.eql('my-value');
    });
    it('inspects dynamic value provider classes', () => {
        const spec = {
            tags: ['rest'],
            scope: __1.BindingScope.CONTEXT,
        };
        let MyProvider = class MyProvider {
            static value() {
                return 'my-value';
            }
        };
        MyProvider = tslib_1.__decorate([
            __1.injectable(spec)
        ], MyProvider);
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyProvider, ctx);
        testlab_1.expect(binding.key).to.eql('dynamicValueProviders.MyProvider');
        testlab_1.expect(binding.scope).to.eql(spec.scope);
        testlab_1.expect(binding.tagMap).to.containDeep({
            type: 'dynamicValueProvider',
            dynamicValueProvider: 'dynamicValueProvider',
            rest: 'rest',
        });
        testlab_1.expect(ctx.getSync(binding.key)).to.eql('my-value');
    });
    it('recognizes dynamic value provider classes', () => {
        const spec = {
            tags: ['rest', { type: 'dynamicValueProvider' }],
            scope: __1.BindingScope.CONTEXT,
        };
        let MyProvider = class MyProvider {
            static value(prefix) {
                return `[${prefix}] my-value`;
            }
        };
        tslib_1.__decorate([
            tslib_1.__param(0, inject_1.inject('prefix')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyProvider, "value", null);
        MyProvider = tslib_1.__decorate([
            __1.injectable(spec)
        ], MyProvider);
        const ctx = new __1.Context();
        ctx.bind('prefix').to('abc');
        const binding = givenBindingFromClass(MyProvider, ctx);
        testlab_1.expect(binding.key).to.eql('dynamicValueProviders.MyProvider');
        testlab_1.expect(binding.scope).to.eql(spec.scope);
        testlab_1.expect(binding.tagMap).to.containDeep({
            type: 'dynamicValueProvider',
            dynamicValueProvider: 'dynamicValueProvider',
            rest: 'rest',
        });
        testlab_1.expect(ctx.getSync(binding.key)).to.eql('[abc] my-value');
    });
    it('recognizes dynamic value provider classes without @injectable', () => {
        class MyProvider {
            static value() {
                return 'my-value';
            }
        }
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyProvider, ctx);
        testlab_1.expect(binding.key).to.eql('dynamicValueProviders.MyProvider');
        testlab_1.expect(ctx.getSync(binding.key)).to.eql('my-value');
    });
    it('honors the binding key', () => {
        const spec = {
            tags: {
                type: 'controller',
                key: 'controllers.my',
                name: 'my-controller',
            },
        };
        let MyController = class MyController {
        };
        MyController = tslib_1.__decorate([
            __1.injectable(spec)
        ], MyController);
        const binding = givenBindingFromClass(MyController);
        testlab_1.expect(binding.key).to.eql('controllers.my');
        testlab_1.expect(binding.tagMap).to.eql({
            name: 'my-controller',
            type: 'controller',
            key: 'controllers.my',
        });
    });
    it('defaults type to class', () => {
        const spec = {};
        let MyClass = class MyClass {
        };
        MyClass = tslib_1.__decorate([
            __1.injectable(spec)
        ], MyClass);
        const binding = givenBindingFromClass(MyClass);
        testlab_1.expect(binding.key).to.eql('classes.MyClass');
    });
    it('honors namespace with @injectable', () => {
        let MyService = class MyService {
        };
        MyService = tslib_1.__decorate([
            __1.injectable({ tags: { namespace: 'services' } })
        ], MyService);
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyService, ctx);
        testlab_1.expect(binding.key).to.eql('services.MyService');
    });
    it('honors namespace with options', () => {
        class MyService {
        }
        const ctx = new __1.Context();
        const binding = givenBindingFromClass(MyService, ctx, {
            namespace: 'services',
        });
        testlab_1.expect(binding.key).to.eql('services.MyService');
    });
    it('honors default namespace with options', () => {
        class MyService {
        }
        let MyServiceWithNS = class MyServiceWithNS {
        };
        MyServiceWithNS = tslib_1.__decorate([
            __1.injectable({ tags: { [__1.ContextTags.NAMESPACE]: 'my-services' } })
        ], MyServiceWithNS);
        const ctx = new __1.Context();
        let binding = givenBindingFromClass(MyService, ctx, {
            defaultNamespace: 'services',
        });
        testlab_1.expect(binding.key).to.eql('services.MyService');
        binding = givenBindingFromClass(MyService, ctx, {
            namespace: 'my-services',
            defaultNamespace: 'services',
        });
        testlab_1.expect(binding.key).to.eql('my-services.MyService');
        binding = givenBindingFromClass(MyServiceWithNS, ctx, {
            defaultNamespace: 'services',
        });
        testlab_1.expect(binding.key).to.eql('my-services.MyServiceWithNS');
    });
    it('includes class name in error messages', () => {
        testlab_1.expect(() => {
            // Reproduce a problem that @bajtos encountered when the project
            // was not built correctly and somehow `@injectable` was called with `undefined`
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let MyClass = class MyClass {
            };
            MyClass = tslib_1.__decorate([
                __1.injectable(undefined)
            ], MyClass);
            return __1.createBindingFromClass(MyClass);
        }).to.throw(/(while building binding for class MyClass)/);
    });
    function givenBindingFromClass(cls, ctx = new __1.Context(), options = {}) {
        const binding = __1.createBindingFromClass(cls, options);
        ctx.add(binding);
        return binding;
    }
});
describe('isProviderClass', () => {
    describe('non-functions', () => {
        assertNotProviderClasses(undefined, null, 'abc', 1, true, false, { x: 1 });
    });
    describe('functions that do not have value()', () => {
        function fn() { }
        class MyClass {
        }
        class MyClassWithVal {
            constructor() {
                this.value = 'abc';
            }
        }
        assertNotProviderClasses(String, Date, fn, MyClass, MyClassWithVal);
    });
    describe('functions that have value()', () => {
        class MyProvider {
            value() {
                return 'abc';
            }
        }
        class MyAsyncProvider {
            value() {
                return Promise.resolve('abc');
            }
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        function MyJsProvider() { }
        MyJsProvider.prototype.value = function () {
            return 'abc';
        };
        assertProviderClasses(MyProvider, MyAsyncProvider, MyJsProvider);
    });
    function assertNotProviderClasses(...values) {
        for (const v of values) {
            it(`recognizes ${v} is not a provider class`, () => {
                testlab_1.expect(__1.isProviderClass(v)).to.be.false();
            });
        }
    }
    function assertProviderClasses(...values) {
        for (const v of values) {
            it(`recognizes ${v} is a provider class`, () => {
                testlab_1.expect(__1.isProviderClass(v)).to.be.true();
            });
        }
    }
});
//# sourceMappingURL=binding-inspector.unit.js.map