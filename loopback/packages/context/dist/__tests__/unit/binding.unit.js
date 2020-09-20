"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const inject_config_1 = require("../../inject-config");
const key = 'foo';
describe('Binding', () => {
    let ctx;
    let binding;
    beforeEach(givenBinding);
    describe('constructor', () => {
        it('sets the given key', () => {
            const result = binding.key;
            testlab_1.expect(result).to.equal(key);
        });
        it('sets the binding lock state to unlocked by default', () => {
            testlab_1.expect(binding.isLocked).to.be.false();
        });
        it('leaves other states to `undefined` by default', () => {
            testlab_1.expect(binding.type).to.be.undefined();
            testlab_1.expect(binding.source).to.be.undefined();
            testlab_1.expect(binding.valueConstructor).to.be.undefined();
            testlab_1.expect(binding.providerConstructor).to.be.undefined();
        });
    });
    describe('lock', () => {
        it('locks the binding', () => {
            binding.lock();
            testlab_1.expect(binding.isLocked).to.be.true();
        });
    });
    describe('tag', () => {
        it('tags the binding', () => {
            binding.tag('t1');
            testlab_1.expect(binding.tagNames).to.eql(['t1']);
            binding.tag('t2');
            testlab_1.expect(binding.tagNames).to.eql(['t1', 't2']);
            testlab_1.expect(binding.tagMap).to.eql({ t1: 't1', t2: 't2' });
        });
        it('tags the binding with rest args', () => {
            binding.tag('t1', 't2');
            testlab_1.expect(binding.tagNames).to.eql(['t1', 't2']);
        });
        it('tags the binding with name/value', () => {
            binding.tag({ name: 'my-controller' });
            testlab_1.expect(binding.tagNames).to.eql(['name']);
            testlab_1.expect(binding.tagMap).to.eql({ name: 'my-controller' });
        });
        it('tags the binding with names and name/value objects', () => {
            binding.tag('controller', { name: 'my-controller' }, 'rest');
            testlab_1.expect(binding.tagNames).to.eql(['controller', 'name', 'rest']);
            testlab_1.expect(binding.tagMap).to.eql({
                controller: 'controller',
                name: 'my-controller',
                rest: 'rest',
            });
        });
        it('throws an error if one of the arguments is an array', () => {
            testlab_1.expect(() => binding.tag(['t1', 't2'])).to.throw(/Tag must be a string or an object \(but not array\):/);
        });
        it('triggers changed event', () => {
            const events = listenOnBinding();
            binding.tag('t1');
            assertEvents(events, 'tag');
        });
    });
    describe('inScope', () => {
        it('defaults to `TRANSIENT` binding scope', () => {
            testlab_1.expect(binding.scope).to.equal(__1.BindingScope.TRANSIENT);
        });
        it('sets the singleton binding scope', () => {
            binding.inScope(__1.BindingScope.SINGLETON);
            testlab_1.expect(binding.scope).to.equal(__1.BindingScope.SINGLETON);
        });
        it('sets the context binding scope', () => {
            binding.inScope(__1.BindingScope.CONTEXT);
            testlab_1.expect(binding.scope).to.equal(__1.BindingScope.CONTEXT);
        });
        it('sets the transient binding scope', () => {
            binding.inScope(__1.BindingScope.TRANSIENT);
            testlab_1.expect(binding.scope).to.equal(__1.BindingScope.TRANSIENT);
        });
        it('triggers changed event', () => {
            const events = listenOnBinding();
            binding.inScope(__1.BindingScope.TRANSIENT);
            assertEvents(events, 'scope');
        });
    });
    describe('applyDefaultScope', () => {
        it('sets the scope if not set', () => {
            binding.applyDefaultScope(__1.BindingScope.SINGLETON);
            testlab_1.expect(binding.scope).to.equal(__1.BindingScope.SINGLETON);
        });
        it('does not override the existing scope', () => {
            binding.inScope(__1.BindingScope.TRANSIENT);
            binding.applyDefaultScope(__1.BindingScope.SINGLETON);
            testlab_1.expect(binding.scope).to.equal(__1.BindingScope.TRANSIENT);
        });
    });
    describe('to(value)', () => {
        it('returns the value synchronously', () => {
            binding.to('value');
            testlab_1.expect(binding.getValue(ctx)).to.equal('value');
        });
        it('sets the type to CONSTANT', () => {
            var _a;
            binding.to('value');
            testlab_1.expect(binding.type).to.equal(__1.BindingType.CONSTANT);
            testlab_1.expect((_a = binding.source) === null || _a === void 0 ? void 0 : _a.value).to.equal('value');
        });
        it('triggers changed event', () => {
            const events = listenOnBinding();
            binding.to('value');
            assertEvents(events, 'value');
        });
        it('rejects promise values', () => {
            testlab_1.expect(() => binding.to(Promise.resolve('value'))).to.throw(/Promise instances are not allowed.*toDynamicValue/);
        });
        it('rejects rejected promise values', () => {
            const p = Promise.reject('error');
            testlab_1.expect(() => binding.to(p)).to.throw(/Promise instances are not allowed.*toDynamicValue/);
            // Catch the rejected promise to avoid
            // (node:60994) UnhandledPromiseRejectionWarning: Unhandled promise
            // rejection (rejection id: 1): error
            p.catch(e => { });
        });
    });
    describe('toDynamicValue(dynamicValueFn)', () => {
        it('support a factory', async () => {
            var _a;
            const factory = () => Promise.resolve('hello');
            const b = ctx.bind('msg').toDynamicValue(factory);
            testlab_1.expect(b.type).to.equal(__1.BindingType.DYNAMIC_VALUE);
            testlab_1.expect((_a = b.source) === null || _a === void 0 ? void 0 : _a.value).to.equal(factory);
            const value = await ctx.get('msg');
            testlab_1.expect(value).to.equal('hello');
            testlab_1.expect(b.type).to.equal(__1.BindingType.DYNAMIC_VALUE);
        });
        it('support a factory to access context/binding/session', async () => {
            var _a;
            const factory = ({ context, binding: _binding, options, }) => {
                var _a;
                return `Hello, ${context.name}#${_binding.key} ${(_a = options.session) === null || _a === void 0 ? void 0 : _a.getBindingPath()}`;
            };
            const b = ctx.bind('msg').toDynamicValue(factory);
            testlab_1.expect(b.type).to.equal(__1.BindingType.DYNAMIC_VALUE);
            testlab_1.expect((_a = b.source) === null || _a === void 0 ? void 0 : _a.value).to.equal(factory);
            const value = await ctx.get('msg');
            testlab_1.expect(value).to.equal('Hello, test#msg msg');
            testlab_1.expect(b.type).to.equal(__1.BindingType.DYNAMIC_VALUE);
        });
        it('supports a factory to use context to look up a binding', async () => {
            ctx.bind('user').to('John');
            ctx.bind('greeting').toDynamicValue(async ({ context }) => {
                const user = await context.get('user');
                return `Hello, ${user}`;
            });
            const value = await ctx.get('greeting');
            testlab_1.expect(value).to.eql('Hello, John');
        });
        it('supports a factory to use static provider', () => {
            class GreetingProvider {
                static value(user) {
                    return `Hello, ${user}`;
                }
            }
            tslib_1.__decorate([
                tslib_1.__param(0, __1.inject('user')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], GreetingProvider, "value", null);
            ctx.bind('user').to('John');
            ctx.bind('greeting').toDynamicValue(GreetingProvider);
            const value = ctx.getSync('greeting');
            testlab_1.expect(value).to.eql('Hello, John');
        });
        it('supports a factory to use async static provider', async () => {
            class GreetingProvider {
                static async value(user) {
                    return `Hello, ${user}`;
                }
            }
            tslib_1.__decorate([
                tslib_1.__param(0, __1.inject('user')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], GreetingProvider, "value", null);
            ctx.bind('user').to('John');
            const b = ctx.bind('greeting').toDynamicValue(GreetingProvider);
            testlab_1.expect(b.type).to.equal(__1.BindingType.DYNAMIC_VALUE);
            testlab_1.expect(b.source).to.eql({
                type: __1.BindingType.DYNAMIC_VALUE,
                value: GreetingProvider,
            });
            const value = await ctx.get('greeting');
            testlab_1.expect(value).to.eql('Hello, John');
        });
        it('supports a factory to use async static provider to inject binding', async () => {
            class GreetingProvider {
                static async value(user, currentBinding) {
                    return `[${currentBinding.key}] Hello, ${user}`;
                }
            }
            tslib_1.__decorate([
                tslib_1.__param(0, __1.inject('user')),
                tslib_1.__param(1, __1.inject.binding()),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String, __1.Binding]),
                tslib_1.__metadata("design:returntype", Promise)
            ], GreetingProvider, "value", null);
            ctx.bind('user').to('John');
            const b = ctx.bind('greeting').toDynamicValue(GreetingProvider);
            testlab_1.expect(b.type).to.equal(__1.BindingType.DYNAMIC_VALUE);
            testlab_1.expect(b.source).to.eql({
                type: __1.BindingType.DYNAMIC_VALUE,
                value: GreetingProvider,
            });
            const value = await ctx.get('greeting');
            testlab_1.expect(value).to.eql('[greeting] Hello, John');
        });
        it('supports a factory to use async static provider to inject config', async () => {
            class GreetingProvider {
                static async value(user, cfg) {
                    return `[${cfg.prefix}] Hello, ${user}`;
                }
            }
            tslib_1.__decorate([
                tslib_1.__param(0, __1.inject('user')),
                tslib_1.__param(1, inject_config_1.config()),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String, Object]),
                tslib_1.__metadata("design:returntype", Promise)
            ], GreetingProvider, "value", null);
            ctx.bind('user').to('John');
            const b = ctx.bind('greeting').toDynamicValue(GreetingProvider);
            testlab_1.expect(b.type).to.equal(__1.BindingType.DYNAMIC_VALUE);
            testlab_1.expect(b.source).to.eql({
                type: __1.BindingType.DYNAMIC_VALUE,
                value: GreetingProvider,
            });
            ctx.configure(b.key).to({ prefix: '***' });
            const value = await ctx.get('greeting');
            testlab_1.expect(value).to.eql('[***] Hello, John');
        });
        it('triggers changed event', () => {
            const events = listenOnBinding();
            binding.toDynamicValue(() => Promise.resolve('hello'));
            assertEvents(events, 'value');
        });
    });
    describe('toClass(cls)', () => {
        it('support a class', async () => {
            ctx.bind('msg').toDynamicValue(() => Promise.resolve('world'));
            ctx.bind('myService').toClass(MyService);
            const myService = await ctx.get('myService');
            testlab_1.expect(myService.getMessage()).to.equal('hello world');
        });
        it('sets the type to CLASS', async () => {
            var _a;
            const b = ctx.bind('myService').toClass(MyService);
            testlab_1.expect(b.type).to.equal(__1.BindingType.CLASS);
            testlab_1.expect((_a = b.source) === null || _a === void 0 ? void 0 : _a.value).to.equal(MyService);
        });
        it('triggers changed event', () => {
            const events = listenOnBinding();
            binding.toClass(MyService);
            assertEvents(events, 'value');
        });
    });
    describe('toProvider(provider)', () => {
        it('binding returns the expected value', async () => {
            ctx.bind('msg').to('hello');
            ctx.bind('provider_key').toProvider(MyProvider);
            const value = await ctx.get('provider_key');
            testlab_1.expect(value).to.equal('hello world');
        });
        it('can resolve provided value synchronously', () => {
            ctx.bind('msg').to('hello');
            ctx.bind('provider_key').toProvider(MyProvider);
            const value = ctx.getSync('provider_key');
            testlab_1.expect(value).to.equal('hello world');
        });
        it('support asynchronous dependencies of provider class', async () => {
            ctx.bind('msg').toDynamicValue(() => Promise.resolve('hello'));
            ctx.bind('provider_key').toProvider(MyProvider);
            const value = await ctx.get('provider_key');
            testlab_1.expect(value).to.equal('hello world');
        });
        it('sets the type to PROVIDER', () => {
            var _a;
            ctx.bind('msg').to('hello');
            const b = ctx.bind('provider_key').toProvider(MyProvider);
            testlab_1.expect(b.type).to.equal(__1.BindingType.PROVIDER);
            testlab_1.expect((_a = b.source) === null || _a === void 0 ? void 0 : _a.value).to.equal(MyProvider);
        });
        it('sets the providerConstructor', () => {
            ctx.bind('msg').to('hello');
            const b = ctx.bind('provider_key').toProvider(MyProvider);
            testlab_1.expect(b.providerConstructor).to.equal(MyProvider);
        });
        it('triggers changed event', () => {
            const events = listenOnBinding();
            binding.toProvider(MyProvider);
            assertEvents(events, 'value');
        });
    });
    describe('toAlias(bindingKeyWithPath)', () => {
        it('binds to another binding with sync value', () => {
            ctx.bind('parent.options').to({ child: { disabled: true } });
            ctx.bind('child.options').toAlias('parent.options#child');
            const childOptions = ctx.getSync('child.options');
            testlab_1.expect(childOptions).to.eql({ disabled: true });
        });
        it('creates the alias even when the target is not bound yet', () => {
            ctx.bind('child.options').toAlias('parent.options#child');
            ctx.bind('parent.options').to({ child: { disabled: true } });
            const childOptions = ctx.getSync('child.options');
            testlab_1.expect(childOptions).to.eql({ disabled: true });
        });
        it('binds to another binding with async value', async () => {
            ctx
                .bind('parent.options')
                .toDynamicValue(() => Promise.resolve({ child: { disabled: true } }));
            ctx.bind('child.options').toAlias('parent.options#child');
            const childOptions = await ctx.get('child.options');
            testlab_1.expect(childOptions).to.eql({ disabled: true });
        });
        it('reports error if alias binding cannot be resolved', () => {
            ctx.bind('child.options').toAlias('parent.options#child');
            testlab_1.expect(() => ctx.getSync('child.options')).to.throw(/The key 'parent.options' is not bound to any value in context/);
        });
        it('reports error if alias binding cannot be resolved - async', async () => {
            ctx.bind('child.options').toAlias('parent.options#child');
            return testlab_1.expect(ctx.get('child.options')).to.be.rejectedWith(/The key 'parent.options' is not bound to any value in context/);
        });
        it('allows optional if binding does not have a value getter', () => {
            // This can happen for `@inject.binding`
            ctx.bind('child.options');
            const childOptions = ctx.getSync('child.options', { optional: true });
            testlab_1.expect(childOptions).to.be.undefined();
        });
        it('allows optional if alias binding cannot be resolved', () => {
            ctx.bind('child.options').toAlias('parent.options#child');
            const childOptions = ctx.getSync('child.options', { optional: true });
            testlab_1.expect(childOptions).to.be.undefined();
        });
        it('allows optional if alias binding cannot be resolved - async', async () => {
            ctx.bind('child.options').toAlias('parent.options#child');
            const childOptions = await ctx.get('child.options', { optional: true });
            testlab_1.expect(childOptions).to.be.undefined();
        });
        it('sets the type to ALIAS', () => {
            const childBinding = ctx
                .bind('child.options')
                .toAlias('parent.options#child');
            testlab_1.expect(childBinding.type).to.equal(__1.BindingType.ALIAS);
            testlab_1.expect(childBinding.source).to.eql({
                type: __1.BindingType.ALIAS,
                value: 'parent.options#child',
            });
        });
        it('triggers changed event', () => {
            const events = listenOnBinding();
            binding.toAlias('parent.options#child');
            assertEvents(events, 'value');
        });
    });
    describe('apply(templateFn)', () => {
        it('applies a template function', async () => {
            binding.apply(b => {
                b.inScope(__1.BindingScope.SINGLETON).tag('myTag');
            });
            testlab_1.expect(binding.scope).to.eql(__1.BindingScope.SINGLETON);
            testlab_1.expect(binding.tagNames).to.eql(['myTag']);
        });
        it('applies multiple template functions', async () => {
            binding.apply(b => {
                b.inScope(__1.BindingScope.SINGLETON);
            }, b => {
                b.tag('myTag');
            });
            testlab_1.expect(binding.scope).to.eql(__1.BindingScope.SINGLETON);
            testlab_1.expect(binding.tagNames).to.eql(['myTag']);
        });
        it('sets up a placeholder value', async () => {
            const toBeBound = (b) => {
                b.toDynamicValue(() => {
                    throw new Error(`Binding ${b.key} is not bound to a value yet`);
                });
            };
            binding.apply(toBeBound);
            ctx.add(binding);
            await testlab_1.expect(ctx.get(binding.key)).to.be.rejectedWith(/Binding foo is not bound to a value yet/);
        });
    });
    describe('cache', () => {
        let spy;
        beforeEach(() => {
            spy = testlab_1.sinon.spy();
        });
        it('clears cache if scope changes', () => {
            const indexBinding = ctx
                .bind('index')
                .toDynamicValue(spy)
                .inScope(__1.BindingScope.SINGLETON);
            ctx.getSync(indexBinding.key);
            testlab_1.sinon.assert.calledOnce(spy);
            spy.resetHistory();
            // Singleton
            ctx.getSync(indexBinding.key);
            testlab_1.sinon.assert.notCalled(spy);
            spy.resetHistory();
            indexBinding.inScope(__1.BindingScope.CONTEXT);
            ctx.getSync(indexBinding.key);
            testlab_1.sinon.assert.calledOnce(spy);
        });
        it('clears cache if _getValue changes', () => {
            const providerSpy = testlab_1.sinon.spy();
            class IndexProvider {
                value() {
                    return providerSpy();
                }
            }
            const indexBinding = ctx
                .bind('index')
                .toDynamicValue(spy)
                .inScope(__1.BindingScope.SINGLETON);
            ctx.getSync(indexBinding.key);
            testlab_1.sinon.assert.calledOnce(spy);
            spy.resetHistory();
            // Singleton
            ctx.getSync(indexBinding.key);
            testlab_1.sinon.assert.notCalled(spy);
            spy.resetHistory();
            // Now change the value getter
            indexBinding.toProvider(IndexProvider);
            ctx.getSync(indexBinding.key);
            testlab_1.sinon.assert.notCalled(spy);
            testlab_1.sinon.assert.calledOnce(providerSpy);
            spy.resetHistory();
            providerSpy.resetHistory();
            // Singleton
            ctx.getSync(indexBinding.key);
            testlab_1.sinon.assert.notCalled(spy);
            testlab_1.sinon.assert.notCalled(providerSpy);
        });
    });
    describe('toJSON()', () => {
        it('converts a keyed binding to plain JSON object', () => {
            const json = binding.toJSON();
            testlab_1.expect(json).to.eql({
                key: key,
                scope: __1.BindingScope.TRANSIENT,
                tags: {},
                isLocked: false,
            });
        });
        it('converts a binding with more attributes to plain JSON object', () => {
            const myBinding = new __1.Binding(key, true)
                .inScope(__1.BindingScope.CONTEXT)
                .tag('model', { name: 'my-model' })
                .to('a');
            const json = myBinding.toJSON();
            testlab_1.expect(json).to.eql({
                key: key,
                scope: __1.BindingScope.CONTEXT,
                tags: { model: 'model', name: 'my-model' },
                isLocked: true,
                type: __1.BindingType.CONSTANT,
            });
        });
        it('converts a keyed binding with alias to plain JSON object', () => {
            const myBinding = new __1.Binding(key)
                .inScope(__1.BindingScope.TRANSIENT)
                .toAlias(__1.BindingKey.create('b', 'x'));
            const json = myBinding.toJSON();
            testlab_1.expect(json).to.eql({
                key: key,
                scope: __1.BindingScope.TRANSIENT,
                tags: {},
                isLocked: false,
                type: __1.BindingType.ALIAS,
                alias: 'b#x',
            });
        });
    });
    describe('inspect()', () => {
        it('converts a keyed binding to plain JSON object', () => {
            const json = binding.inspect();
            testlab_1.expect(json).to.eql({
                key: key,
                scope: __1.BindingScope.TRANSIENT,
                tags: {},
                isLocked: false,
            });
        });
        it('converts a binding with more attributes to plain JSON object', () => {
            const myBinding = new __1.Binding(key, true)
                .inScope(__1.BindingScope.CONTEXT)
                .tag('model', { name: 'my-model' })
                .to('a');
            const json = myBinding.inspect();
            testlab_1.expect(json).to.eql({
                key: key,
                scope: __1.BindingScope.CONTEXT,
                tags: { model: 'model', name: 'my-model' },
                isLocked: true,
                type: __1.BindingType.CONSTANT,
            });
        });
        it('converts a binding with toDynamicValue to plain JSON object', () => {
            const myBinding = new __1.Binding(key)
                .inScope(__1.BindingScope.SINGLETON)
                .tag('model', { name: 'my-model' })
                .toDynamicValue(() => 'a');
            const json = myBinding.inspect({ includeInjections: true });
            testlab_1.expect(json).to.eql({
                key: key,
                scope: __1.BindingScope.SINGLETON,
                tags: { model: 'model', name: 'my-model' },
                isLocked: false,
                type: __1.BindingType.DYNAMIC_VALUE,
            });
        });
        it('converts a binding with valueConstructor to plain JSON object', () => {
            function myFilter(b) {
                return b.key.startsWith('timers.');
            }
            let MyController = class MyController {
                constructor(x) {
                    this.x = x;
                }
            };
            tslib_1.__decorate([
                __1.inject('y', { optional: true }),
                tslib_1.__metadata("design:type", Object)
            ], MyController.prototype, "y", void 0);
            tslib_1.__decorate([
                __1.inject(__1.filterByTag('task')),
                tslib_1.__metadata("design:type", Array)
            ], MyController.prototype, "tasks", void 0);
            tslib_1.__decorate([
                __1.inject(myFilter),
                tslib_1.__metadata("design:type", Array)
            ], MyController.prototype, "timers", void 0);
            MyController = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject('x')),
                tslib_1.__metadata("design:paramtypes", [String])
            ], MyController);
            const myBinding = new __1.Binding(key, true)
                .tag('model', { name: 'my-model' })
                .toClass(MyController);
            const json = myBinding.inspect({ includeInjections: true });
            testlab_1.expect(json).to.eql({
                key: key,
                scope: __1.BindingScope.TRANSIENT,
                tags: { model: 'model', name: 'my-model' },
                isLocked: true,
                type: __1.BindingType.CLASS,
                valueConstructor: 'MyController',
                injections: {
                    constructorArguments: [
                        { targetName: 'MyController.constructor[0]', bindingKey: 'x' },
                    ],
                    properties: {
                        y: {
                            targetName: 'MyController.prototype.y',
                            bindingKey: 'y',
                            optional: true,
                        },
                        tasks: {
                            targetName: 'MyController.prototype.tasks',
                            bindingTagPattern: 'task',
                        },
                        timers: {
                            targetName: 'MyController.prototype.timers',
                            bindingFilter: 'myFilter',
                        },
                    },
                },
            });
        });
        it('converts a binding with providerConstructor to plain JSON object', () => {
            let MyProvider = class MyProvider {
                constructor(x) {
                    this.x = x;
                }
                value() {
                    return `${this.x}: ${this.y}`;
                }
            };
            tslib_1.__decorate([
                __1.inject('y'),
                tslib_1.__metadata("design:type", Number)
            ], MyProvider.prototype, "y", void 0);
            tslib_1.__decorate([
                __1.inject(__1.filterByTag('task')),
                tslib_1.__metadata("design:type", Array)
            ], MyProvider.prototype, "tasks", void 0);
            MyProvider = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject('x')),
                tslib_1.__metadata("design:paramtypes", [String])
            ], MyProvider);
            const myBinding = new __1.Binding(key, true)
                .inScope(__1.BindingScope.CONTEXT)
                .tag('model', { name: 'my-model' })
                .toProvider(MyProvider);
            const json = myBinding.inspect({ includeInjections: true });
            testlab_1.expect(json).to.eql({
                key: key,
                scope: __1.BindingScope.CONTEXT,
                tags: { model: 'model', name: 'my-model' },
                isLocked: true,
                type: __1.BindingType.PROVIDER,
                providerConstructor: 'MyProvider',
                injections: {
                    constructorArguments: [
                        { targetName: 'MyProvider.constructor[0]', bindingKey: 'x' },
                    ],
                    properties: {
                        y: { targetName: 'MyProvider.prototype.y', bindingKey: 'y' },
                        tasks: {
                            targetName: 'MyProvider.prototype.tasks',
                            bindingTagPattern: 'task',
                        },
                    },
                },
            });
        });
    });
    function givenBinding() {
        ctx = new __1.Context('test');
        binding = new __1.Binding(key);
    }
    function listenOnBinding() {
        const events = [];
        binding.on('changed', event => {
            events.push(event);
        });
        return events;
    }
    function assertEvents(events, operation) {
        testlab_1.expect(events).to.eql([{ binding, operation, type: 'changed' }]);
    }
    let MyProvider = class MyProvider {
        constructor(_msg) {
            this._msg = _msg;
        }
        value() {
            return this._msg + ' world';
        }
    };
    MyProvider = tslib_1.__decorate([
        tslib_1.__param(0, __1.inject('msg')),
        tslib_1.__metadata("design:paramtypes", [String])
    ], MyProvider);
    let MyService = class MyService {
        constructor(_msg) {
            this._msg = _msg;
        }
        getMessage() {
            return 'hello ' + this._msg;
        }
    };
    MyService = tslib_1.__decorate([
        tslib_1.__param(0, __1.inject('msg')),
        tslib_1.__metadata("design:paramtypes", [String])
    ], MyService);
});
//# sourceMappingURL=binding.unit.js.map