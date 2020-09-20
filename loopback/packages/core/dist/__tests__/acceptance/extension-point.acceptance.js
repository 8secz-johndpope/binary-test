"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('extension point', () => {
    describe('@extensionPoint', () => {
        it('specifies name of the extension point as a binding tag', () => {
            let GreetingService = class GreetingService {
            };
            tslib_1.__decorate([
                __1.extensions(),
                tslib_1.__metadata("design:type", Function)
            ], GreetingService.prototype, "greeters", void 0);
            GreetingService = tslib_1.__decorate([
                __1.extensionPoint('greeters', { scope: context_1.BindingScope.SINGLETON })
            ], GreetingService);
            const bindingMetadata = context_1.MetadataInspector.getClassMetadata(context_1.BINDING_METADATA_KEY, GreetingService);
            testlab_1.expect(bindingMetadata).to.not.undefined();
            testlab_1.expect(bindingMetadata.templates).to.be.an.Array();
            const binding = context_1.createBindingFromClass(GreetingService);
            testlab_1.expect(binding.tagMap).to.containEql({
                [__1.CoreTags.EXTENSION_POINT]: 'greeters',
            });
            testlab_1.expect(binding.scope).to.eql(context_1.BindingScope.SINGLETON);
        });
    });
    describe('@extensions', () => {
        let ctx;
        beforeEach(givenContext);
        it('injects a getter function of extensions', async () => {
            let GreetingService = class GreetingService {
            };
            tslib_1.__decorate([
                __1.extensions(),
                tslib_1.__metadata("design:type", Function)
            ], GreetingService.prototype, "greeters", void 0);
            GreetingService = tslib_1.__decorate([
                __1.extensionPoint('greeters')
            ], GreetingService);
            // `@extensionPoint` is a sugar decorator for `@injectable`
            const binding = context_1.createBindingFromClass(GreetingService, {
                key: 'greeter-service',
            });
            ctx.add(binding);
            registerGreeters('greeters');
            const greeterService = await ctx.get('greeter-service');
            const greeters = await greeterService.greeters();
            assertGreeterExtensions(greeters);
        });
        it('injects a view of extensions', async () => {
            let GreetingService = class GreetingService {
                constructor(greetersView) {
                    this.greetersView = greetersView;
                    this.bindings = new Set(this.greetersView.bindings);
                    // Track bind events
                    this.greetersView.on('bind', (event) => {
                        this.bindings.add(event.binding);
                    });
                    // Track unbind events
                    this.greetersView.on('unbind', (event) => {
                        this.bindings.delete(event.binding);
                    });
                }
            };
            GreetingService = tslib_1.__decorate([
                __1.extensionPoint('greeters'),
                tslib_1.__param(0, __1.extensions.view()),
                tslib_1.__metadata("design:paramtypes", [context_1.ContextView])
            ], GreetingService);
            // `@extensionPoint` is a sugar decorator for `@injectable`
            const binding = context_1.createBindingFromClass(GreetingService, {
                key: 'greeter-service',
            });
            ctx.add(binding);
            const registeredBindings = registerGreeters('greeters');
            const greeterService = await ctx.get('greeter-service');
            testlab_1.expect(Array.from(greeterService.bindings)).to.eql(registeredBindings);
            let greeters = await greeterService.greetersView.values();
            assertGreeterExtensions(greeters);
            testlab_1.expect(greeters.length).to.equal(2);
            ctx.unbind(registeredBindings[0].key);
            greeters = await greeterService.greetersView.values();
            testlab_1.expect(greeters.length).to.equal(1);
            testlab_1.expect(Array.from(greeterService.bindings)).to.eql([
                registeredBindings[1],
            ]);
        });
        it('injects a list of extensions', async () => {
            let GreetingService = class GreetingService {
            };
            tslib_1.__decorate([
                __1.extensions.list(),
                tslib_1.__metadata("design:type", Array)
            ], GreetingService.prototype, "greeters", void 0);
            GreetingService = tslib_1.__decorate([
                __1.extensionPoint('greeters')
            ], GreetingService);
            // `@extensionPoint` is a sugar decorator for `@injectable`
            const binding = context_1.createBindingFromClass(GreetingService, {
                key: 'greeter-service',
            });
            ctx.add(binding);
            const registeredBindings = registerGreeters('greeters');
            const greeterService = await ctx.get('greeter-service');
            testlab_1.expect(greeterService.greeters.length).to.eql(registeredBindings.length);
            assertGreeterExtensions(greeterService.greeters);
            const copy = Array.from(greeterService.greeters);
            // Now unbind the 1st greeter
            ctx.unbind(registeredBindings[0].key);
            // The injected greeters are not impacted
            testlab_1.expect(greeterService.greeters).to.eql(copy);
        });
        it('injects extensions based on `name` tag of the extension point binding', async () => {
            class GreetingService {
            }
            tslib_1.__decorate([
                __1.extensions(),
                tslib_1.__metadata("design:type", Function)
            ], GreetingService.prototype, "greeters", void 0);
            ctx
                .bind('greeter-service')
                .toClass(GreetingService)
                .tag({ name: 'greeters' }); // Tag the extension point with a name
            registerGreeters('greeters');
            const greeterService = await ctx.get('greeter-service');
            const greeters = await greeterService.greeters();
            assertGreeterExtensions(greeters);
        });
        it('injects extensions based on class name of the extension point', async () => {
            let GreetingService = class GreetingService {
                constructor(greeters) {
                    this.greeters = greeters;
                }
            };
            GreetingService = tslib_1.__decorate([
                tslib_1.__param(0, __1.extensions()),
                tslib_1.__metadata("design:paramtypes", [Function])
            ], GreetingService);
            ctx.bind('greeter-service').toClass(GreetingService);
            registerGreeters(GreetingService.name);
            const greeterService = await ctx.get('greeter-service');
            const loadedGreeters = await greeterService.greeters();
            assertGreeterExtensions(loadedGreeters);
        });
        it('injects extensions based on class name of the extension point using property', async () => {
            class GreetingService {
            }
            tslib_1.__decorate([
                __1.extensions(),
                tslib_1.__metadata("design:type", Function)
            ], GreetingService.prototype, "greeters", void 0);
            ctx.bind('greeter-service').toClass(GreetingService);
            registerGreeters(GreetingService.name);
            const greeterService = await ctx.get('greeter-service');
            const greeters = await greeterService.greeters();
            assertGreeterExtensions(greeters);
        });
        it('injects extensions based on extension point name from @extensions', async () => {
            class GreetingService {
            }
            tslib_1.__decorate([
                __1.extensions('greeters'),
                tslib_1.__metadata("design:type", Function)
            ], GreetingService.prototype, "greeters", void 0);
            ctx.bind('greeter-service').toClass(GreetingService);
            registerGreeters('greeters');
            const greeterService = await ctx.get('greeter-service');
            const greeters = await greeterService.greeters();
            assertGreeterExtensions(greeters);
        });
        it('injects multiple types of extensions', async () => {
            class ConsoleLogger {
                log(message) {
                    console.log(message);
                }
            }
            let GreetingService = class GreetingService {
                constructor(greeters, loggers) {
                    this.greeters = greeters;
                    this.loggers = loggers;
                }
            };
            GreetingService = tslib_1.__decorate([
                tslib_1.__param(0, __1.extensions('greeters')),
                tslib_1.__param(1, __1.extensions('loggers')),
                tslib_1.__metadata("design:paramtypes", [Function, Function])
            ], GreetingService);
            ctx.bind('greeter-service').toClass(GreetingService);
            registerGreeters('greeters');
            __1.addExtension(ctx, 'loggers', ConsoleLogger);
            const greeterService = await ctx.get('greeter-service');
            const loadedGreeters = await greeterService.greeters();
            assertGreeterExtensions(loadedGreeters);
            const loadedLoggers = await greeterService.loggers();
            testlab_1.expect(loadedLoggers).to.be.an.Array();
            testlab_1.expect(loadedLoggers.length).to.equal(1);
            testlab_1.expect(loadedLoggers[0]).to.be.instanceOf(ConsoleLogger);
        });
        it('allows an extension to contribute to multiple extension points', () => {
            let MyExtension = class MyExtension {
            };
            MyExtension = tslib_1.__decorate([
                context_1.injectable(__1.extensionFor('extensionPoint-1'), __1.extensionFor('extensionPoint-2'))
            ], MyExtension);
            const binding = context_1.createBindingFromClass(MyExtension);
            testlab_1.expect(binding.tagMap[__1.CoreTags.EXTENSION_FOR]).to.eql([
                'extensionPoint-1',
                'extensionPoint-2',
            ]);
        });
        it('allows an extension of multiple extension points with extensionFor', () => {
            class MyExtension {
            }
            const binding = ctx.bind('my-extension').toClass(MyExtension);
            __1.extensionFor('extensionPoint-1')(binding);
            testlab_1.expect(binding.tagMap[__1.CoreTags.EXTENSION_FOR]).to.eql('extensionPoint-1');
            // Now we have two extension points
            __1.extensionFor('extensionPoint-2')(binding);
            testlab_1.expect(binding.tagMap[__1.CoreTags.EXTENSION_FOR]).to.eql([
                'extensionPoint-1',
                'extensionPoint-2',
            ]);
            // No duplication
            __1.extensionFor('extensionPoint-1')(binding);
            testlab_1.expect(binding.tagMap[__1.CoreTags.EXTENSION_FOR]).to.eql([
                'extensionPoint-1',
                'extensionPoint-2',
            ]);
        });
        it('allows multiple extension points for extensionFor', () => {
            class MyExtension {
            }
            const binding = ctx.bind('my-extension').toClass(MyExtension);
            __1.extensionFor('extensionPoint-1', 'extensionPoint-2')(binding);
            testlab_1.expect(__1.extensionFilter('extensionPoint-1')(binding)).to.be.true();
            testlab_1.expect(__1.extensionFilter('extensionPoint-2')(binding)).to.be.true();
            testlab_1.expect(__1.extensionFilter('extensionPoint-3')(binding)).to.be.false();
        });
        it('allows multiple extension points for extensionFilter', () => {
            class MyExtension {
            }
            const binding = ctx.bind('my-extension').toClass(MyExtension);
            __1.extensionFor('extensionPoint-1', 'extensionPoint-2')(binding);
            testlab_1.expect(__1.extensionFilter('extensionPoint-1', 'extensionPoint3')(binding)).to.be.true();
            testlab_1.expect(__1.extensionFilter('extensionPoint-2', 'extensionPoint3')(binding)).to.be.true();
        });
        it('allows multiple extension points for @extensions', async () => {
            let MyExtensionPoint1 = class MyExtensionPoint1 {
            };
            tslib_1.__decorate([
                __1.extensions(),
                tslib_1.__metadata("design:type", Function)
            ], MyExtensionPoint1.prototype, "getMyExtensions", void 0);
            MyExtensionPoint1 = tslib_1.__decorate([
                __1.extensionPoint('extensionPoint-1')
            ], MyExtensionPoint1);
            let MyExtensionPoint2 = class MyExtensionPoint2 {
            };
            tslib_1.__decorate([
                __1.extensions(),
                tslib_1.__metadata("design:type", Function)
            ], MyExtensionPoint2.prototype, "getMyExtensions", void 0);
            MyExtensionPoint2 = tslib_1.__decorate([
                __1.extensionPoint('extensionPoint-2')
            ], MyExtensionPoint2);
            let MyExtension = class MyExtension {
            };
            MyExtension = tslib_1.__decorate([
                context_1.injectable(__1.extensionFor('extensionPoint-1', 'extensionPoint-2'))
            ], MyExtension);
            ctx.add(context_1.createBindingFromClass(MyExtensionPoint1, { key: 'extensionPoint1' }));
            ctx.add(context_1.createBindingFromClass(MyExtensionPoint2, { key: 'extensionPoint2' }));
            ctx.add(context_1.createBindingFromClass(MyExtension));
            const ep1 = await ctx.get('extensionPoint1');
            const ep2 = await ctx.get('extensionPoint2');
            const extensionsFor1 = await ep1.getMyExtensions();
            const extensionsFor2 = await ep2.getMyExtensions();
            testlab_1.expect(extensionsFor1.length).to.eql(1);
            testlab_1.expect(extensionsFor1[0]).to.be.instanceOf(MyExtension);
            testlab_1.expect(extensionsFor2.length).to.eql(1);
            testlab_1.expect(extensionsFor2[0]).to.be.instanceOf(MyExtension);
        });
        function givenContext() {
            ctx = new context_1.Context();
        }
        function registerGreeters(extensionPointName) {
            const g1 = __1.addExtension(ctx, extensionPointName, EnglishGreeter, {
                namespace: 'greeters',
            });
            const g2 = __1.addExtension(ctx, extensionPointName, ChineseGreeter, {
                namespace: 'greeters',
            });
            return [g1, g2];
        }
    });
    class EnglishGreeter {
        constructor() {
            this.language = 'en';
        }
        greet(name) {
            return `Hello, ${name}!`;
        }
    }
    class ChineseGreeter {
        constructor() {
            this.language = 'zh';
        }
        greet(name) {
            return `你好，${name}！`;
        }
    }
    function assertGreeterExtensions(greeters) {
        const languages = greeters.map(greeter => greeter.language).sort();
        testlab_1.expect(languages).to.eql(['en', 'zh']);
    }
});
//# sourceMappingURL=extension-point.acceptance.js.map