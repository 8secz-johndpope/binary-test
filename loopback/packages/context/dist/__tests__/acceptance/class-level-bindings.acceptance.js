"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const INFO_CONTROLLER = 'controllers.info';
describe('Context bindings - Injecting dependencies of classes', () => {
    let ctx;
    beforeEach('given a context', createContext);
    it('injects constructor args', async () => {
        ctx.bind('application.name').to('CodeHub');
        let InfoController = class InfoController {
            constructor(appName) {
                this.appName = appName;
            }
        };
        InfoController = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('application.name')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], InfoController);
        ctx.bind(INFO_CONTROLLER).toClass(InfoController);
        const instance = await ctx.get(INFO_CONTROLLER);
        testlab_1.expect(instance).to.have.property('appName', 'CodeHub');
    });
    it('throws helpful error when no ctor args are decorated', () => {
        class InfoController {
            constructor(appName) { }
        }
        ctx.bind(INFO_CONTROLLER).toClass(InfoController);
        return ctx.get(INFO_CONTROLLER).then(function onSuccess() {
            throw new Error('ctx.get() should have failed');
        }, function onError(err) {
            testlab_1.expect(err.message).to.match(/The argument 'InfoController\.constructor\[0\]' is not decorated for dependency injection/);
            testlab_1.expect(err.message).to.match(/but no value was supplied by the caller\. Did you forget to apply @inject\(\) to the argument\?/);
            testlab_1.expect(err.message).to.match(/\(context: [\w\-]+, resolutionPath: controllers\.info\)/);
        });
    });
    it('throws helpful error when some ctor args are not decorated', () => {
        ctx.bind('application.name').to('CodeHub');
        let InfoController = class InfoController {
            constructor(argNotInjected, appName) { }
        };
        InfoController = tslib_1.__decorate([
            tslib_1.__param(1, __1.inject('application.name')),
            tslib_1.__metadata("design:paramtypes", [String, String])
        ], InfoController);
        ctx.bind(INFO_CONTROLLER).toClass(InfoController);
        return ctx.get(INFO_CONTROLLER).then(function onSuccess() {
            throw new Error('ctx.get() should have failed');
        }, function onError(err) {
            testlab_1.expect(err.message).to.match(/The argument 'InfoController\.constructor\[0\]' is not decorated for dependency injection/);
            testlab_1.expect(err.message).to.match(/but no value was supplied by the caller\. Did you forget to apply @inject\(\) to the argument\?/);
            testlab_1.expect(err.message).to.match(/\(context: [\w\-]+, resolutionPath: controllers\.info\)/);
        });
    });
    it('resolves promises before injecting parameters', async () => {
        ctx.bind('authenticated').toDynamicValue(async () => {
            // Emulate asynchronous database call
            await Promise.resolve();
            // Return the authentication result
            return false;
        });
        let InfoController = class InfoController {
            constructor(isAuthenticated) {
                this.isAuthenticated = isAuthenticated;
            }
        };
        InfoController = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('authenticated')),
            tslib_1.__metadata("design:paramtypes", [Boolean])
        ], InfoController);
        ctx.bind(INFO_CONTROLLER).toClass(InfoController);
        const instance = await ctx.get(INFO_CONTROLLER);
        testlab_1.expect(instance).to.have.property('isAuthenticated', false);
    });
    it('creates instance synchronously when all dependencies are sync too', () => {
        ctx.bind('appName').to('CodeHub');
        let InfoController = class InfoController {
            constructor(appName) {
                this.appName = appName;
            }
        };
        InfoController = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('appName')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], InfoController);
        const b = ctx.bind(INFO_CONTROLLER).toClass(InfoController);
        const valueOrPromise = b.getValue(ctx);
        testlab_1.expect(valueOrPromise).to.not.be.Promise();
        testlab_1.expect(valueOrPromise).to.have.property('appName', 'CodeHub');
    });
    it('resolves promises before injecting properties', async () => {
        ctx.bind('authenticated').toDynamicValue(async () => {
            // Emulate asynchronous database call
            await Promise.resolve();
            // Return the authentication result
            return false;
        });
        class InfoController {
        }
        tslib_1.__decorate([
            __1.inject('authenticated'),
            tslib_1.__metadata("design:type", Boolean)
        ], InfoController.prototype, "isAuthenticated", void 0);
        ctx.bind(INFO_CONTROLLER).toClass(InfoController);
        const instance = await ctx.get(INFO_CONTROLLER);
        testlab_1.expect(instance).to.have.property('isAuthenticated', false);
    });
    it('creates instance synchronously when property/constructor dependencies are sync too', () => {
        ctx.bind('appName').to('CodeHub');
        ctx.bind('authenticated').to(false);
        let InfoController = class InfoController {
            constructor(appName) {
                this.appName = appName;
            }
        };
        tslib_1.__decorate([
            __1.inject('authenticated'),
            tslib_1.__metadata("design:type", Boolean)
        ], InfoController.prototype, "isAuthenticated", void 0);
        InfoController = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('appName')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], InfoController);
        const b = ctx.bind(INFO_CONTROLLER).toClass(InfoController);
        const valueOrPromise = b.getValue(ctx);
        testlab_1.expect(valueOrPromise).to.not.be.Promise();
        testlab_1.expect(valueOrPromise).to.have.property('appName', 'CodeHub');
        testlab_1.expect(valueOrPromise).to.have.property('isAuthenticated', false);
    });
    const STORE_KEY = 'store';
    const HASH_KEY = __1.BindingKey.create('hash');
    it('injects a getter function', async () => {
        ctx.bind(HASH_KEY).to('123');
        let Store = class Store {
            constructor(getter) {
                this.getter = getter;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.getter(HASH_KEY)),
            tslib_1.__metadata("design:paramtypes", [Function])
        ], Store);
        ctx.bind(STORE_KEY).toClass(Store);
        const store = ctx.getSync(STORE_KEY);
        testlab_1.expect(store.getter).to.be.Function();
        testlab_1.expect(await store.getter()).to.equal('123');
        // rebind the value to verify that getter always returns a fresh value
        ctx.bind(HASH_KEY).to('456');
        testlab_1.expect(await store.getter()).to.equal('456');
    });
    it('creates getter from a value', () => {
        const getter = __1.Getter.fromValue('data');
        testlab_1.expect(getter).to.be.a.Function();
        return testlab_1.expect(getter()).to.be.fulfilledWith('data');
    });
    it('reports an error if @inject.getter has a non-function target', async () => {
        ctx.bind('key').to('value');
        let Store = class Store {
            constructor(getter) {
                this.getter = getter;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.getter('key')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], Store);
        ctx.bind(STORE_KEY).toClass(Store);
        testlab_1.expect(() => ctx.getSync(STORE_KEY)).to.throw('The type of Store.constructor[0] (String) is not Getter function');
    });
    describe('in SINGLETON scope', () => {
        it('throws if a getter cannot be resolved by the owning context', async () => {
            let Store = class Store {
                constructor(getter) {
                    this.getter = getter;
                }
            };
            Store = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject.getter(HASH_KEY)),
                tslib_1.__metadata("design:paramtypes", [Function])
            ], Store);
            const requestCtx = givenRequestContextWithSingletonStore(Store);
            // Create the store instance from the child context
            // Now the singleton references a `getter` to `hash` binding from
            // the `requestCtx`
            const store = requestCtx.getSync(STORE_KEY);
            // The `hash` injection of `Store` cannot be fulfilled by a binding (123)
            // in `requestCtx` because `Store` is bound to `ctx` in `SINGLETON` scope
            await testlab_1.expect(store.getter()).to.be.rejectedWith(/The key 'hash' is not bound to any value in context .+/);
            // Now bind `hash` to `456` to to ctx
            ctx.bind(HASH_KEY).to('456');
            // The `hash` injection of `Store` can now be resolved
            testlab_1.expect(await store.getter()).to.equal('456');
        });
        it('throws if a value cannot be resolved by the owning context', async () => {
            let Store = class Store {
                constructor(hash) {
                    this.hash = hash;
                }
            };
            Store = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject(HASH_KEY)),
                tslib_1.__metadata("design:paramtypes", [String])
            ], Store);
            const requestCtx = givenRequestContextWithSingletonStore(Store);
            // The `hash` injection of `Store` cannot be fulfilled by a binding (123)
            // in `requestCtx` because `Store` is bound to `ctx` in `SINGLETON` scope
            await testlab_1.expect(requestCtx.get(STORE_KEY)).to.be.rejectedWith(/The key 'hash' is not bound to any value in context .+/);
            // Now bind `hash` to `456` to to ctx
            ctx.bind(HASH_KEY).to('456');
            // The `hash` injection of `Store` can now be resolved
            const store = await requestCtx.get(STORE_KEY);
            testlab_1.expect(store.hash).to.equal('456');
        });
        it('injects method parameters from a child context', async () => {
            class Store {
                constructor() {
                    this.name = 'my-store';
                }
                static getHash(hash) {
                    return hash;
                }
                getHashWithName(hash) {
                    return `${hash}: ${this.name}`;
                }
            }
            tslib_1.__decorate([
                tslib_1.__param(0, __1.inject(HASH_KEY)),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], Store.prototype, "getHashWithName", null);
            tslib_1.__decorate([
                tslib_1.__param(0, __1.inject(HASH_KEY)),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], Store, "getHash", null);
            const requestCtx = givenRequestContextWithSingletonStore(Store);
            let value = await __1.invokeMethod(Store, 'getHash', requestCtx);
            testlab_1.expect(value).to.equal('123');
            const store = await requestCtx.get(STORE_KEY);
            value = await __1.invokeMethod(store, 'getHashWithName', requestCtx);
            testlab_1.expect(value).to.equal('123: my-store');
            // bind the value to to ctx
            ctx.bind(HASH_KEY).to('456');
            value = await __1.invokeMethod(Store, 'getHash', ctx);
            testlab_1.expect(value).to.equal('456');
            value = await __1.invokeMethod(store, 'getHashWithName', ctx);
            testlab_1.expect(value).to.equal('456: my-store');
        });
        it('injects only bindings from the owner context with @inject.tag', async () => {
            let Store = class Store {
                constructor(features) {
                    this.features = features;
                }
            };
            Store = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject.tag('feature')),
                tslib_1.__metadata("design:paramtypes", [Array])
            ], Store);
            const requestCtx = givenRequestContextWithSingletonStore(Store);
            ctx.bind('features.security').to('security').tag('feature');
            requestCtx.bind('features.debug').to('debug').tag('feature');
            const store = await requestCtx.get(STORE_KEY);
            // For singleton bindings, the injected tagged bindings will be only from
            // the owner context (`ctx`) instead of the current one (`requestCtx`)
            // used to resolve the bound `Store`
            testlab_1.expect(store.features).to.eql(['security']);
        });
        it('injects owner context with @inject.context', async () => {
            let Store = class Store {
                constructor(context) {
                    this.context = context;
                }
            };
            Store = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject.context()),
                tslib_1.__metadata("design:paramtypes", [__1.Context])
            ], Store);
            const requestCtx = givenRequestContextWithSingletonStore(Store);
            const store = await requestCtx.get(STORE_KEY);
            // For singleton bindings, the injected context will be the owner context
            // (`ctx`) instead of the current one (`requestCtx`) used to resolve the
            // bound `Store`
            testlab_1.expect(store.context).to.equal(ctx);
        });
        it('injects setter of owner context with @inject.setter', async () => {
            let Store = class Store {
                constructor(setHash) {
                    this.setHash = setHash;
                }
            };
            Store = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject.setter(HASH_KEY)),
                tslib_1.__metadata("design:paramtypes", [Function])
            ], Store);
            const requestCtx = givenRequestContextWithSingletonStore(Store);
            const store = await requestCtx.get(STORE_KEY);
            store.setHash('456');
            // For singleton bindings, the injected setter will set value to the owner
            // context (`ctx`) instead of the current one (`requestCtx`) used to
            // resolve the bound `Store`
            testlab_1.expect(await ctx.get(HASH_KEY)).to.equal('456');
            testlab_1.expect(await requestCtx.get(HASH_KEY)).to.equal('123');
        });
        function givenRequestContextWithSingletonStore(storeClass) {
            // Create a child context of `ctx`
            const requestCtx = new __1.Context(ctx, 'child');
            // Bind `hash` to `123` in the `requestCtx`
            requestCtx.bind(HASH_KEY).to('123');
            // Bind `Store` as a singleton at parent level (`ctx`)
            ctx.bind(STORE_KEY).toClass(storeClass).inScope(__1.BindingScope.SINGLETON);
            return requestCtx;
        }
    });
    describe('@inject.setter', () => {
        let Store = class Store {
            constructor(setter) {
                this.setter = setter;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.setter(HASH_KEY)),
            tslib_1.__metadata("design:paramtypes", [Function])
        ], Store);
        it('injects a setter function', () => {
            ctx.bind(STORE_KEY).toClass(Store);
            const store = ctx.getSync(STORE_KEY);
            testlab_1.expect(store.setter).to.be.Function();
            store.setter('a-value');
            testlab_1.expect(ctx.getSync(HASH_KEY)).to.equal('a-value');
        });
        it('throws error if binding key is empty', async () => {
            let InvalidStore = class InvalidStore {
                constructor(setter) {
                    this.setter = setter;
                }
            };
            InvalidStore = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject.setter('')),
                tslib_1.__metadata("design:paramtypes", [Function])
            ], InvalidStore);
            ctx.bind(STORE_KEY).toClass(InvalidStore);
            return testlab_1.expect(ctx.get(STORE_KEY)).to.be.rejectedWith(/Binding key is not set for @inject\.setter/);
        });
        it('injects a setter function that uses an existing binding', () => {
            // Create a binding for hash key
            ctx.bind(HASH_KEY).to('123').tag('hash');
            ctx.bind(STORE_KEY).toClass(Store);
            const store = ctx.getSync(STORE_KEY);
            // Change the hash value
            store.setter('a-value');
            testlab_1.expect(ctx.getSync(HASH_KEY)).to.equal('a-value');
            // The tag is kept
            testlab_1.expect(ctx.getBinding(HASH_KEY).tagNames).to.containEql('hash');
        });
        it('reports an error if @inject.setter has a non-function target', () => {
            let StoreWithWrongSetterType = class StoreWithWrongSetterType {
                constructor(setter) {
                    this.setter = setter;
                }
            };
            StoreWithWrongSetterType = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject.setter(HASH_KEY)),
                tslib_1.__metadata("design:paramtypes", [Object])
            ], StoreWithWrongSetterType);
            ctx.bind('key').to('value');
            ctx.bind(STORE_KEY).toClass(StoreWithWrongSetterType);
            testlab_1.expect(() => ctx.getSync(STORE_KEY)).to.throw('The type of StoreWithWrongSetterType.constructor[0] (Object) is not Setter function');
        });
        describe('bindingCreation option', () => {
            it('supports ALWAYS_CREATE', () => {
                ctx
                    .bind(STORE_KEY)
                    .toClass(givenStoreClass(__1.BindingCreationPolicy.ALWAYS_CREATE));
                const store = ctx.getSync(STORE_KEY);
                store.setter('a-value');
                const binding1 = ctx.getBinding(HASH_KEY);
                store.setter('b-value');
                const binding2 = ctx.getBinding(HASH_KEY);
                testlab_1.expect(binding1).to.not.exactly(binding2);
            });
            it('supports NEVER_CREATE - throws if not bound', () => {
                ctx
                    .bind(STORE_KEY)
                    .toClass(givenStoreClass(__1.BindingCreationPolicy.NEVER_CREATE));
                const store = ctx.getSync(STORE_KEY);
                testlab_1.expect(() => store.setter('a-value')).to.throw(/The key 'hash' is not bound to any value in context/);
            });
            it('supports NEVER_CREATE with an existing binding', () => {
                // Create a binding for hash key
                const hashBinding = ctx.bind(HASH_KEY).to('123').tag('hash');
                ctx
                    .bind(STORE_KEY)
                    .toClass(givenStoreClass(__1.BindingCreationPolicy.NEVER_CREATE));
                const store = ctx.getSync(STORE_KEY);
                store.setter('a-value');
                testlab_1.expect(ctx.getBinding(HASH_KEY)).to.exactly(hashBinding);
                testlab_1.expect(ctx.getSync(HASH_KEY)).to.equal('a-value');
            });
            it('supports CREATE_IF_NOT_BOUND without an existing binding', async () => {
                ctx
                    .bind(STORE_KEY)
                    .toClass(givenStoreClass(__1.BindingCreationPolicy.CREATE_IF_NOT_BOUND));
                const store = ctx.getSync(STORE_KEY);
                store.setter('a-value');
                testlab_1.expect(ctx.getSync(HASH_KEY)).to.equal('a-value');
            });
            it('supports CREATE_IF_NOT_BOUND with an existing binding', () => {
                // Create a binding for hash key
                const hashBinding = ctx.bind(HASH_KEY).to('123').tag('hash');
                ctx
                    .bind(STORE_KEY)
                    .toClass(givenStoreClass(__1.BindingCreationPolicy.CREATE_IF_NOT_BOUND));
                const store = ctx.getSync(STORE_KEY);
                store.setter('a-value');
                testlab_1.expect(ctx.getBinding(HASH_KEY)).to.exactly(hashBinding);
                testlab_1.expect(ctx.getSync(HASH_KEY)).to.equal('a-value');
            });
            function givenStoreClass(bindingCreation) {
                let StoreWithInjectSetterMetadata = class StoreWithInjectSetterMetadata {
                    constructor(setter) {
                        this.setter = setter;
                    }
                };
                StoreWithInjectSetterMetadata = tslib_1.__decorate([
                    tslib_1.__param(0, __1.inject.setter(HASH_KEY, { bindingCreation })),
                    tslib_1.__metadata("design:paramtypes", [Function])
                ], StoreWithInjectSetterMetadata);
                return StoreWithInjectSetterMetadata;
            }
        });
    });
    it('injects a nested property', async () => {
        let TestComponent = class TestComponent {
            constructor(configForTest) {
                this.configForTest = configForTest;
            }
        };
        TestComponent = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('config#test')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestComponent);
        ctx.bind('config').to({ test: 'test-config' });
        ctx.bind('component').toClass(TestComponent);
        const resolved = await ctx.get('component');
        testlab_1.expect(resolved.configForTest).to.equal('test-config');
    });
    describe('@inject.binding', () => {
        let Store = class Store {
            constructor(binding) {
                this.binding = binding;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.binding(HASH_KEY)),
            tslib_1.__metadata("design:paramtypes", [__1.Binding])
        ], Store);
        it('injects a binding', () => {
            ctx.bind(STORE_KEY).toClass(Store);
            const store = ctx.getSync(STORE_KEY);
            testlab_1.expect(store.binding).to.be.instanceOf(__1.Binding);
        });
        it('injects a binding that exists', () => {
            // Create a binding for hash key
            const hashBinding = ctx.bind(HASH_KEY).to('123').tag('hash');
            ctx.bind(STORE_KEY).toClass(Store);
            const store = ctx.getSync(STORE_KEY);
            testlab_1.expect(store.binding).to.be.exactly(hashBinding);
        });
        it('reports an error if @inject.binding has a wrong target type', () => {
            let StoreWithWrongBindingType = class StoreWithWrongBindingType {
                constructor(binding) {
                    this.binding = binding;
                }
            };
            StoreWithWrongBindingType = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject.binding(HASH_KEY)),
                tslib_1.__metadata("design:paramtypes", [Object])
            ], StoreWithWrongBindingType);
            ctx.bind(STORE_KEY).toClass(StoreWithWrongBindingType);
            testlab_1.expect(() => ctx.getSync(STORE_KEY)).to.throw('The type of StoreWithWrongBindingType.constructor[0] (Object) is not Binding');
        });
        describe('bindingCreation option', () => {
            it('supports ALWAYS_CREATE', () => {
                ctx
                    .bind(STORE_KEY)
                    .toClass(givenStoreClass(__1.BindingCreationPolicy.ALWAYS_CREATE));
                const binding1 = ctx.getSync(STORE_KEY).binding;
                const binding2 = ctx.getSync(STORE_KEY).binding;
                testlab_1.expect(binding1).to.not.be.exactly(binding2);
            });
            it('supports NEVER_CREATE - throws if not bound', () => {
                ctx
                    .bind(STORE_KEY)
                    .toClass(givenStoreClass(__1.BindingCreationPolicy.NEVER_CREATE));
                testlab_1.expect(() => ctx.getSync(STORE_KEY)).to.throw(/The key 'hash' is not bound to any value in context/);
            });
            it('supports NEVER_CREATE with an existing binding', () => {
                // Create a binding for hash key
                const hashBinding = ctx.bind(HASH_KEY).to('123').tag('hash');
                ctx
                    .bind(STORE_KEY)
                    .toClass(givenStoreClass(__1.BindingCreationPolicy.NEVER_CREATE));
                const store = ctx.getSync(STORE_KEY);
                testlab_1.expect(store.binding).to.be.exactly(hashBinding);
            });
            it('supports CREATE_IF_NOT_BOUND without an existing binding', async () => {
                ctx
                    .bind(STORE_KEY)
                    .toClass(givenStoreClass(__1.BindingCreationPolicy.CREATE_IF_NOT_BOUND));
                const store = ctx.getSync(STORE_KEY);
                testlab_1.expect(store.binding).to.be.instanceOf(__1.Binding);
            });
            it('supports CREATE_IF_NOT_BOUND with an existing binding', () => {
                // Create a binding for hash key
                const hashBinding = ctx.bind(HASH_KEY).to('123').tag('hash');
                ctx
                    .bind(STORE_KEY)
                    .toClass(givenStoreClass(__1.BindingCreationPolicy.CREATE_IF_NOT_BOUND));
                const store = ctx.getSync(STORE_KEY);
                testlab_1.expect(store.binding).to.be.exactly(hashBinding);
            });
            function givenStoreClass(bindingCreation) {
                let StoreWithInjectBindingMetadata = class StoreWithInjectBindingMetadata {
                    constructor(binding) {
                        this.binding = binding;
                    }
                };
                StoreWithInjectBindingMetadata = tslib_1.__decorate([
                    tslib_1.__param(0, __1.inject.binding(HASH_KEY, { bindingCreation })),
                    tslib_1.__metadata("design:paramtypes", [__1.Binding])
                ], StoreWithInjectBindingMetadata);
                return StoreWithInjectBindingMetadata;
            }
        });
    });
    describe('@inject.binding without binding key', () => {
        let Store = class Store {
            constructor(binding) {
                this.binding = binding;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.binding()),
            tslib_1.__metadata("design:paramtypes", [__1.Binding])
        ], Store);
        it('injects a binding', () => {
            ctx.bind(STORE_KEY).toClass(Store);
            const store = ctx.getSync(STORE_KEY);
            testlab_1.expect(store.binding).to.equal(ctx.getBinding(STORE_KEY));
        });
    });
    it('injects context with @inject.context', () => {
        let Store = class Store {
            constructor(context) {
                this.context = context;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.context()),
            tslib_1.__metadata("design:paramtypes", [__1.Context])
        ], Store);
        ctx.bind(STORE_KEY).toClass(Store);
        const store = ctx.getSync(STORE_KEY);
        testlab_1.expect(store.context).to.be.exactly(ctx);
    });
    it('injects values by tag', () => {
        let Store = class Store {
            constructor(locations) {
                this.locations = locations;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.tag('store:location')),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], Store);
        ctx.bind(STORE_KEY).toClass(Store);
        ctx.bind('store.locations.sf').to('San Francisco').tag('store:location');
        ctx.bind('store.locations.sj').to('San Jose').tag('store:location');
        const store = ctx.getSync(STORE_KEY);
        testlab_1.expect(store.locations).to.eql(['San Francisco', 'San Jose']);
    });
    it('injects values by tag regex', () => {
        let Store = class Store {
            constructor(locations) {
                this.locations = locations;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.tag(/.+:location:sj/)),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], Store);
        ctx.bind(STORE_KEY).toClass(Store);
        ctx.bind('store.locations.sf').to('San Francisco').tag('store:location:sf');
        ctx.bind('store.locations.sj').to('San Jose').tag('store:location:sj');
        const store = ctx.getSync(STORE_KEY);
        testlab_1.expect(store.locations).to.eql(['San Jose']);
    });
    it('injects empty values by tag if not found', () => {
        let Store = class Store {
            constructor(locations) {
                this.locations = locations;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.tag('store:location')),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], Store);
        ctx.bind(STORE_KEY).toClass(Store);
        const store = ctx.getSync(STORE_KEY);
        testlab_1.expect(store.locations).to.eql([]);
    });
    it('injects values by tag asynchronously', async () => {
        let Store = class Store {
            constructor(locations) {
                this.locations = locations;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.tag('store:location')),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], Store);
        ctx.bind(STORE_KEY).toClass(Store);
        ctx.bind('store.locations.sf').to('San Francisco').tag('store:location');
        ctx
            .bind('store.locations.sj')
            .toDynamicValue(async () => 'San Jose')
            .tag('store:location');
        const store = await ctx.get(STORE_KEY);
        testlab_1.expect(store.locations).to.eql(['San Francisco', 'San Jose']);
    });
    it('reports correct resolution path when injecting values by tag', async () => {
        let Store = class Store {
            constructor(locations) {
                this.locations = locations;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.tag('store:location')),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], Store);
        let resolutionPath;
        class LocationProvider {
            value() {
                return this.location;
            }
        }
        tslib_1.__decorate([
            __1.inject('location', {}, 
            // Set up a custom resolve() to access information from the session
            (c, injection, session) => {
                resolutionPath = session.getResolutionPath();
                return 'San Jose';
            }),
            tslib_1.__metadata("design:type", String)
        ], LocationProvider.prototype, "location", void 0);
        ctx.bind(STORE_KEY).toClass(Store);
        ctx.bind('store.locations.sf').to('San Francisco').tag('store:location');
        ctx
            .bind('store.locations.sj')
            .toProvider(LocationProvider)
            .tag('store:location');
        const store = await ctx.get(STORE_KEY);
        testlab_1.expect(store.locations).to.eql(['San Francisco', 'San Jose']);
        testlab_1.expect(resolutionPath).to.eql('store --> @Store.constructor[0] --> store.locations.sj --> ' +
            '@LocationProvider.prototype.location');
    });
    it('reports error when @inject.tag rejects a promise', async () => {
        let Store = class Store {
            constructor(locations) {
                this.locations = locations;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.tag('store:location')),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], Store);
        ctx.bind(STORE_KEY).toClass(Store);
        ctx.bind('store.locations.sf').to('San Francisco').tag('store:location');
        ctx
            .bind('store.locations.sj')
            .toDynamicValue(() => Promise.reject(new Error('Bad')))
            .tag('store:location');
        await testlab_1.expect(ctx.get(STORE_KEY)).to.be.rejectedWith('Bad');
    });
    it('injects a config property', () => {
        let Store = class Store {
            constructor(optionX, optionY) {
                this.optionX = optionX;
                this.optionY = optionY;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('x')),
            tslib_1.__param(1, __1.config('y')),
            tslib_1.__metadata("design:paramtypes", [Number, String])
        ], Store);
        ctx.configure('store').to({ x: 1, y: 'a' });
        ctx.bind('store').toClass(Store);
        const store = ctx.getSync('store');
        testlab_1.expect(store.optionX).to.eql(1);
        testlab_1.expect(store.optionY).to.eql('a');
    });
    it('injects a config property with promise value', async () => {
        let Store = class Store {
            constructor(optionX) {
                this.optionX = optionX;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('x')),
            tslib_1.__metadata("design:paramtypes", [Number])
        ], Store);
        ctx.configure('store').toDynamicValue(() => Promise.resolve({ x: 1 }));
        ctx.bind('store').toClass(Store);
        const store = await ctx.get('store');
        testlab_1.expect(store.optionX).to.eql(1);
    });
    it('injects a config property with a binding provider', async () => {
        let MyConfigProvider = class MyConfigProvider {
            constructor(prefix) {
                this.prefix = prefix;
            }
            value() {
                return {
                    myOption: this.prefix + 'my-option',
                };
            }
        };
        MyConfigProvider = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('prefix')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], MyConfigProvider);
        let Store = class Store {
            constructor(myOption) {
                this.myOption = myOption;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('myOption')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], Store);
        ctx.bind('config').toProvider(MyConfigProvider);
        ctx.configure('store').toProvider(MyConfigProvider);
        ctx.bind('prefix').to('hello-');
        ctx.bind('store').toClass(Store);
        const store = await ctx.get('store');
        testlab_1.expect(store.myOption).to.eql('hello-my-option');
    });
    it('injects a config property with a rejected promise', async () => {
        let Store = class Store {
            constructor(optionX) {
                this.optionX = optionX;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('x')),
            tslib_1.__metadata("design:paramtypes", [Number])
        ], Store);
        ctx
            .configure('store')
            .toDynamicValue(() => Promise.reject(Error('invalid')));
        ctx.bind('store').toClass(Store);
        await testlab_1.expect(ctx.get('store')).to.be.rejectedWith('invalid');
    });
    it('injects a config property with nested property', () => {
        let Store = class Store {
            constructor(optionXY) {
                this.optionXY = optionXY;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('x.y')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], Store);
        ctx.configure('store').to({ x: { y: 'y' } });
        ctx.bind('store').toClass(Store);
        const store = ctx.getSync('store');
        testlab_1.expect(store.optionXY).to.eql('y');
    });
    it('injects config if the propertyPath is not present', () => {
        let Store = class Store {
            constructor(configObj) {
                this.configObj = configObj;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config()),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], Store);
        ctx.configure('store').to({ x: 1, y: 'a' });
        ctx.bind('store').toClass(Store);
        const store = ctx.getSync('store');
        testlab_1.expect(store.configObj).to.eql({ x: 1, y: 'a' });
    });
    it("injects config if the propertyPath is ''", () => {
        let Store = class Store {
            constructor(configObj) {
                this.configObj = configObj;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('')),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], Store);
        ctx.configure('store').to({ x: 1, y: 'a' });
        ctx.bind('store').toClass(Store);
        const store = ctx.getSync('store');
        testlab_1.expect(store.configObj).to.eql({ x: 1, y: 'a' });
    });
    it('injects config with propertyPath', () => {
        let Store = class Store {
            constructor(optionX) {
                this.optionX = optionX;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('x')),
            tslib_1.__metadata("design:paramtypes", [Number])
        ], Store);
        ctx.configure('store').to({ x: 1, y: 'a' });
        ctx.bind('store').toClass(Store);
        const store = ctx.getSync('store');
        testlab_1.expect(store.optionX).to.eql(1);
    });
    it('injects undefined option if propertyPath not found', () => {
        let Store = class Store {
            constructor(option) {
                this.option = option;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('not-exist')),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], Store);
        ctx.configure('store').to({ x: 1, y: 'a' });
        ctx.bind('store').toClass(Store);
        const store = ctx.getSync('store');
        testlab_1.expect(store.option).to.be.undefined();
    });
    it('injects a config property for different bindings with the same class', async () => {
        let Store = class Store {
            constructor(optionX, optionY) {
                this.optionX = optionX;
                this.optionY = optionY;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('x')),
            tslib_1.__param(1, __1.config('y')),
            tslib_1.__metadata("design:paramtypes", [Number, String])
        ], Store);
        ctx.configure('store1').to({ x: 1, y: 'a' });
        ctx.configure('store2').to({ x: 2, y: 'b' });
        ctx.bind('store1').toClass(Store);
        ctx.bind('store2').toClass(Store);
        const store1 = await ctx.get('store1');
        testlab_1.expect(store1.optionX).to.eql(1);
        testlab_1.expect(store1.optionY).to.eql('a');
        const store2 = await ctx.get('store2');
        testlab_1.expect(store2.optionX).to.eql(2);
        testlab_1.expect(store2.optionY).to.eql('b');
    });
    it('injects undefined config if no binding is present', async () => {
        let Store = class Store {
            constructor(settings) {
                this.settings = settings;
            }
        };
        Store = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('x')),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], Store);
        const store = await __1.instantiateClass(Store, ctx);
        testlab_1.expect(store.settings).to.be.undefined();
    });
    it('injects config from config binding', () => {
        let MyStore = class MyStore {
            constructor(optionX) {
                this.optionX = optionX;
            }
        };
        MyStore = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('x')),
            tslib_1.__metadata("design:paramtypes", [Number])
        ], MyStore);
        ctx.configure('stores.MyStore').to({ x: 1, y: 'a' });
        ctx.bind('stores.MyStore').toClass(MyStore);
        const store = ctx.getSync('stores.MyStore');
        testlab_1.expect(store.optionX).to.eql(1);
    });
    function createContext() {
        ctx = new __1.Context();
    }
});
//# sourceMappingURL=class-level-bindings.acceptance.js.map