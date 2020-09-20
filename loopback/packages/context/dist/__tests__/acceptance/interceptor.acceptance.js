"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Interceptor', () => {
    let ctx;
    beforeEach(givenContextAndEvents);
    it('invokes sync interceptors on a sync method', () => {
        class MyController {
            // Apply `logSync` to a sync instance method
            greetSync(name) {
                return `Hello, ${name}`;
            }
        }
        tslib_1.__decorate([
            __1.intercept(logSync),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greetSync", null);
        const controller = new MyController();
        const msg = __1.invokeMethodWithInterceptors(ctx, controller, 'greetSync', [
            'John',
        ]);
        testlab_1.expect(msg).to.equal('Hello, John');
        testlab_1.expect(events).to.eql([
            'logSync: before-greetSync',
            'logSync: after-greetSync',
        ]);
    });
    it('invokes async interceptors on a sync method', async () => {
        class MyController {
            // Apply `log` to a sync instance method
            greet(name) {
                return `Hello, ${name}`;
            }
        }
        tslib_1.__decorate([
            __1.intercept(log),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyController.prototype, "greet", null);
        const controller = new MyController();
        const msg = await __1.invokeMethodWithInterceptors(ctx, controller, 'greet', [
            'John',
        ]);
        testlab_1.expect(msg).to.equal('Hello, John');
        testlab_1.expect(events).to.eql(['log: before-greet', 'log: after-greet']);
    });
    it('supports interceptor bindings', async () => {
        class MyController {
            // Apply `log` as a binding key to an async instance method
            async greet(name) {
                const hello = await Promise.resolve(`Hello, ${name}`);
                return hello;
            }
        }
        tslib_1.__decorate([
            __1.intercept('log'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        const controller = new MyController();
        ctx.bind('log').to(log);
        const msg = await __1.invokeMethodWithInterceptors(ctx, controller, 'greet', [
            'John',
        ]);
        testlab_1.expect(msg).to.equal('Hello, John');
        testlab_1.expect(events).to.eql(['log: before-greet', 'log: after-greet']);
    });
    it('supports interceptor bindings from a provider', async () => {
        class MyController {
            // Apply `name-validator` backed by a provider class
            async greet(name) {
                return `Hello, ${name}`;
            }
        }
        tslib_1.__decorate([
            __1.intercept('name-validator'),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        const controller = new MyController();
        ctx.bind('valid-names').to(['John', 'Mary']);
        ctx.bind('name-validator').toProvider(NameValidator);
        const msg = await __1.invokeMethodWithInterceptors(ctx, controller, 'greet', [
            'John',
        ]);
        testlab_1.expect(msg).to.equal('Hello, John');
        await testlab_1.expect(__1.invokeMethodWithInterceptors(ctx, controller, 'greet', ['Smith'])).to.be.rejectedWith(/Name 'Smith' is not on the list/);
    });
    it('invokes a method with two interceptors', async () => {
        class MyController {
            // Apply `log` and `logSync` to an async instance method
            async greet(name) {
                return `Hello, ${name}`;
            }
        }
        tslib_1.__decorate([
            __1.intercept('log', logSync),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        const controller = new MyController();
        ctx.bind('log').to(log);
        const msg = await __1.invokeMethodWithInterceptors(ctx, controller, 'greet', [
            'John',
        ]);
        testlab_1.expect(msg).to.equal('Hello, John');
        testlab_1.expect(events).to.eql([
            'log: before-greet',
            'logSync: before-greet',
            'logSync: after-greet',
            'log: after-greet',
        ]);
    });
    it('invokes a method without interceptors', async () => {
        class MyController {
            // No interceptors
            async greet(name) {
                return `Hello, ${name}`;
            }
        }
        const controller = new MyController();
        const msg = await __1.invokeMethodWithInterceptors(ctx, controller, 'greet', [
            'John',
        ]);
        testlab_1.expect(msg).to.equal('Hello, John');
        testlab_1.expect(events).to.eql([]);
    });
    it('allows interceptors to modify args', async () => {
        class MyController {
            // Apply `convertName` to convert `name` arg to upper case
            async greet(name) {
                return `Hello, ${name}`;
            }
        }
        tslib_1.__decorate([
            __1.intercept(convertName),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        const controller = new MyController();
        const msg = await __1.invokeMethodWithInterceptors(ctx, controller, 'greet', [
            'John',
        ]);
        testlab_1.expect(msg).to.equal('Hello, JOHN');
        testlab_1.expect(events).to.eql([
            'convertName: before-greet',
            'convertName: after-greet',
        ]);
    });
    it('allows interceptors to catch errors', async () => {
        class MyController {
            // Apply `logError` to catch errors
            async greet(name) {
                throw new Error('error: ' + name);
            }
        }
        tslib_1.__decorate([
            __1.intercept(logError),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        const controller = new MyController();
        await testlab_1.expect(__1.invokeMethodWithInterceptors(ctx, controller, 'greet', ['John'])).to.be.rejectedWith('error: John');
        testlab_1.expect(events).to.eql(['logError: before-greet', 'logError: error-greet']);
    });
    it('closes invocation context after invocation', async () => {
        const testInterceptor = async (invocationCtx, next) => {
            // Add observers to the invocation context, which in turn adds listeners
            // to its parent - `ctx`
            invocationCtx.subscribe(() => { });
            return next();
        };
        class MyController {
            async greet(name) {
                return `Hello, ${name}`;
            }
        }
        tslib_1.__decorate([
            __1.intercept(testInterceptor),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "greet", null);
        // No invocation context related listeners yet
        const listenerCount = ctx.listenerCount('bind');
        const controller = new MyController();
        // Run the invocation 5 times
        for (let i = 0; i < 5; i++) {
            const count = ctx.listenerCount('bind');
            const invocationPromise = __1.invokeMethodWithInterceptors(ctx, controller, 'greet', ['John']);
            // New listeners are added to `ctx` by the invocation context
            testlab_1.expect(ctx.listenerCount('bind')).to.be.greaterThan(count);
            // Wait until the invocation finishes
            await invocationPromise;
        }
        // Listeners added by invocation context are gone now
        // There is one left for ctx.observers
        testlab_1.expect(ctx.listenerCount('bind')).to.eql(listenerCount + 1);
    });
    it('invokes static interceptors', async () => {
        class MyController {
            // Apply `log` to a static method
            static async greetStatic(name) {
                return `Hello, ${name}`;
            }
        }
        tslib_1.__decorate([
            __1.intercept(log),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController, "greetStatic", null);
        const msg = await __1.invokeMethodWithInterceptors(ctx, MyController, 'greetStatic', ['John']);
        testlab_1.expect(msg).to.equal('Hello, John');
        testlab_1.expect(events).to.eql([
            'log: before-greetStatic',
            'log: after-greetStatic',
        ]);
    });
    it('does not allow @intercept on properties', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MyControllerWithProps {
            }
            tslib_1.__decorate([
                __1.intercept(log),
                tslib_1.__metadata("design:type", String)
            ], MyControllerWithProps.prototype, "status", void 0);
        }).to.throw(/@intercept cannot be used on a property/);
    });
    context('method dependency injection', () => {
        it('invokes interceptors on a static method', async () => {
            class MyController {
                // Apply `log` to a static method with parameter injection
                static async greetStaticWithDI(name) {
                    return `Hello, ${name}`;
                }
            }
            tslib_1.__decorate([
                __1.intercept(log),
                tslib_1.__param(0, __1.inject('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController, "greetStaticWithDI", null);
            ctx.bind('name').to('John');
            const msg = await __1.invokeMethod(MyController, 'greetStaticWithDI', ctx);
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'log: before-greetStaticWithDI',
                'log: after-greetStaticWithDI',
            ]);
        });
        it('invokes interceptors on an instance method', async () => {
            class MyController {
                // Apply `log` to an async instance method with parameter injection
                async greetWithDI(name) {
                    return `Hello, ${name}`;
                }
            }
            tslib_1.__decorate([
                __1.intercept(log),
                tslib_1.__param(0, __1.inject('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "greetWithDI", null);
            const controller = new MyController();
            ctx.bind('name').to('John');
            const msg = await __1.invokeMethod(controller, 'greetWithDI', ctx);
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'log: before-greetWithDI',
                'log: after-greetWithDI',
            ]);
        });
    });
    context('method dependency injection without interceptors', () => {
        it('does not invoke interceptors on a static method', async () => {
            class MyController {
                // Apply `log` to a static method with parameter injection
                static async greetStaticWithDI(name) {
                    return `Hello, ${name}`;
                }
            }
            tslib_1.__decorate([
                __1.intercept(log),
                tslib_1.__param(0, __1.inject('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController, "greetStaticWithDI", null);
            ctx.bind('name').to('John');
            const msg = await __1.invokeMethod(MyController, 'greetStaticWithDI', ctx, [], { skipInterceptors: true });
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([]);
        });
        it('does not invoke interceptors on an instance method', async () => {
            class MyController {
                // Apply `log` to an async instance method with parameter injection
                async greetWithDI(name) {
                    return `Hello, ${name}`;
                }
            }
            tslib_1.__decorate([
                __1.intercept(log),
                tslib_1.__param(0, __1.inject('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "greetWithDI", null);
            const controller = new MyController();
            ctx.bind('name').to('John');
            const msg = await __1.invokeMethod(controller, 'greetWithDI', ctx, [], {
                skipInterceptors: true,
            });
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([]);
        });
    });
    context('method interception without injection', () => {
        it('invokes interceptors on a static method', async () => {
            class MyController {
                // Apply `log` to a static method with parameter injection
                static async greetStaticWithDI(name) {
                    return `Hello, ${name}`;
                }
            }
            tslib_1.__decorate([
                __1.intercept(log),
                tslib_1.__param(0, __1.inject('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController, "greetStaticWithDI", null);
            ctx.bind('name').to('John');
            const msg = await __1.invokeMethod(MyController, 'greetStaticWithDI', ctx, ['John'], { skipParameterInjection: true });
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'log: before-greetStaticWithDI',
                'log: after-greetStaticWithDI',
            ]);
        });
        it('invokes interceptors on an instance method', async () => {
            class MyController {
                // Apply `log` to an async instance method with parameter injection
                async greetWithDI(name) {
                    return `Hello, ${name}`;
                }
            }
            tslib_1.__decorate([
                __1.intercept(log),
                tslib_1.__param(0, __1.inject('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "greetWithDI", null);
            const controller = new MyController();
            ctx.bind('name').to('John');
            const msg = await __1.invokeMethod(controller, 'greetWithDI', ctx, ['John'], {
                skipParameterInjection: true,
            });
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'log: before-greetWithDI',
                'log: after-greetWithDI',
            ]);
        });
    });
    context('invocation options for invokeMethodWithInterceptors', () => {
        it('can skip parameter injection', async () => {
            const controller = givenController();
            ctx.bind('name').to('Jane');
            const msg = await __1.invokeMethodWithInterceptors(ctx, controller, 'greetWithDI', 
            // 'John' is passed in as an arg
            ['John'], {
                skipParameterInjection: true,
            });
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'log: before-greetWithDI',
                'log: after-greetWithDI',
            ]);
        });
        it('can support parameter injection', async () => {
            const controller = givenController();
            ctx.bind('name').to('Jane');
            const msg = await __1.invokeMethodWithInterceptors(ctx, controller, 'greetWithDI', 
            // No name is passed in here as it will be provided by the injection
            [], {
                skipParameterInjection: false,
            });
            // `Jane` is bound to `name` in the current context
            testlab_1.expect(msg).to.equal('Hello, Jane');
            testlab_1.expect(events).to.eql([
                'log: before-greetWithDI',
                'log: after-greetWithDI',
            ]);
        });
        it('does not allow skipInterceptors', async () => {
            const controller = givenController();
            testlab_1.expect(() => {
                __1.invokeMethodWithInterceptors(ctx, controller, 'greetWithDI', ['John'], {
                    skipInterceptors: true,
                });
            }).to.throw(/skipInterceptors is not allowed/);
        });
        it('can set source information', async () => {
            const controller = givenController();
            ctx.bind('name').to('Jane');
            const source = {
                type: 'path',
                value: 'rest',
                toString: () => 'path:rest',
            };
            const msg = await __1.invokeMethodWithInterceptors(ctx, controller, 'greetWithDI', 
            // No name is passed in here as it will be provided by the injection
            [], {
                source,
                skipParameterInjection: false,
            });
            // `Jane` is bound to `name` in the current context
            testlab_1.expect(msg).to.equal('Hello, Jane');
            testlab_1.expect(events).to.eql([
                'log: [path:rest] before-greetWithDI',
                'log: [path:rest] after-greetWithDI',
            ]);
        });
        function givenController() {
            class MyController {
                // Apply `log` to an async instance method with parameter injection
                async greetWithDI(name) {
                    return `Hello, ${name}`;
                }
            }
            tslib_1.__decorate([
                __1.intercept(log),
                tslib_1.__param(0, __1.inject('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "greetWithDI", null);
            return new MyController();
        }
    });
    context('controller method with both interception and injection', () => {
        it('allows interceptor to influence parameter injection', async () => {
            const result = await __1.invokeMethodWithInterceptors(ctx, new MyController(), 'interceptedHello', [], { skipParameterInjection: false });
            // `Mary` is bound to `name` by the interceptor
            testlab_1.expect(result).to.eql('Hello, Mary');
        });
        class MyController {
            async interceptedHello(name) {
                return `Hello, ${name}`;
            }
        }
        tslib_1.__decorate([
            __1.intercept(async (invocationCtx, next) => {
                invocationCtx.bind('name').to('Mary');
                return next();
            }),
            tslib_1.__param(0, __1.inject('name')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", Promise)
        ], MyController.prototype, "interceptedHello", null);
    });
    context('class level interceptors', () => {
        it('invokes sync and async interceptors', async () => {
            // Apply `log` to all methods on the class
            let MyController = class MyController {
                // We can apply `@intercept` multiple times on the same method
                // This is needed if a custom decorator is created for `@intercept`
                greetSync(name) {
                    return `Hello, ${name}`;
                }
            };
            tslib_1.__decorate([
                __1.intercept(log),
                __1.intercept(logSync),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greetSync", null);
            MyController = tslib_1.__decorate([
                __1.intercept(log)
            ], MyController);
            const msg = await __1.invokeMethodWithInterceptors(ctx, new MyController(), 'greetSync', ['John']);
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'log: before-greetSync',
                'logSync: before-greetSync',
                'logSync: after-greetSync',
                'log: after-greetSync',
            ]);
        });
        it('invokes async interceptors on an async method', async () => {
            // Apply `log` to all methods on the class
            let MyController = class MyController {
                // Apply multiple interceptors. The order of `log` will be preserved as it
                // explicitly listed at method level
                async greet(name) {
                    return `Hello, ${name}`;
                }
            };
            tslib_1.__decorate([
                __1.intercept(convertName, log),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "greet", null);
            MyController = tslib_1.__decorate([
                __1.intercept(log)
            ], MyController);
            const msg = await __1.invokeMethodWithInterceptors(ctx, new MyController(), 'greet', ['John']);
            testlab_1.expect(msg).to.equal('Hello, JOHN');
            testlab_1.expect(events).to.eql([
                'convertName: before-greet',
                'log: before-greet',
                'log: after-greet',
                'convertName: after-greet',
            ]);
        });
        it('invokes interceptors on a static method', async () => {
            // Apply `log` to all methods on the class
            let MyController = class MyController {
                // The class level `log` will be applied
                static async greetStatic(name) {
                    return `Hello, ${name}`;
                }
            };
            MyController = tslib_1.__decorate([
                __1.intercept(log)
            ], MyController);
            const msg = await __1.invokeMethodWithInterceptors(ctx, MyController, 'greetStatic', ['John']);
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'log: before-greetStatic',
                'log: after-greetStatic',
            ]);
        });
        it('invokes interceptors on a static method with DI', async () => {
            // Apply `log` to all methods on the class
            let MyController = class MyController {
                static async greetStaticWithDI(name) {
                    return `Hello, ${name}`;
                }
            };
            tslib_1.__decorate([
                __1.intercept(log),
                tslib_1.__param(0, __1.inject('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController, "greetStaticWithDI", null);
            MyController = tslib_1.__decorate([
                __1.intercept(log)
            ], MyController);
            ctx.bind('name').to('John');
            const msg = await __1.invokeMethod(MyController, 'greetStaticWithDI', ctx);
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'log: before-greetStaticWithDI',
                'log: after-greetStaticWithDI',
            ]);
        });
    });
    context('global interceptors', () => {
        beforeEach(givenGlobalInterceptor);
        it('invokes sync and async interceptors', async () => {
            // Apply `log` to all methods on the class
            let MyController = class MyController {
                // We can apply `@intercept` multiple times on the same method
                // This is needed if a custom decorator is created for `@intercept`
                greetSync(name) {
                    return `Hello, ${name}`;
                }
            };
            tslib_1.__decorate([
                __1.intercept(log),
                __1.intercept(logSync),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "greetSync", null);
            MyController = tslib_1.__decorate([
                __1.intercept(log)
            ], MyController);
            const msg = await __1.invokeMethodWithInterceptors(ctx, new MyController(), 'greetSync', ['John']);
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'globalLog: before-greetSync',
                'log: before-greetSync',
                'logSync: before-greetSync',
                'logSync: after-greetSync',
                'log: after-greetSync',
                'globalLog: after-greetSync',
            ]);
        });
        it('invokes async interceptors on an async method', async () => {
            // Apply `log` to all methods on the class
            let MyController = class MyController {
                // Apply multiple interceptors. The order of `log` will be preserved as it
                // explicitly listed at method level
                async greet(name) {
                    return `Hello, ${name}`;
                }
            };
            tslib_1.__decorate([
                __1.intercept(convertName, log),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController.prototype, "greet", null);
            MyController = tslib_1.__decorate([
                __1.intercept(log)
            ], MyController);
            const msg = await __1.invokeMethodWithInterceptors(ctx, new MyController(), 'greet', ['John']);
            testlab_1.expect(msg).to.equal('Hello, JOHN');
            testlab_1.expect(events).to.eql([
                'globalLog: before-greet',
                'convertName: before-greet',
                'log: before-greet',
                'log: after-greet',
                'convertName: after-greet',
                'globalLog: after-greet',
            ]);
        });
        it('invokes interceptors on a static method', async () => {
            // Apply `log` to all methods on the class
            let MyController = class MyController {
                // The class level `log` will be applied
                static async greetStatic(name) {
                    return `Hello, ${name}`;
                }
            };
            MyController = tslib_1.__decorate([
                __1.intercept(log)
            ], MyController);
            const msg = await __1.invokeMethodWithInterceptors(ctx, MyController, 'greetStatic', ['John']);
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'globalLog: before-greetStatic',
                'log: before-greetStatic',
                'log: after-greetStatic',
                'globalLog: after-greetStatic',
            ]);
        });
        it('invokes interceptors on a static method with DI', async () => {
            // Apply `log` to all methods on the class
            let MyController = class MyController {
                static async greetStaticWithDI(name) {
                    return `Hello, ${name}`;
                }
            };
            tslib_1.__decorate([
                __1.intercept(log),
                tslib_1.__param(0, __1.inject('name')),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", Promise)
            ], MyController, "greetStaticWithDI", null);
            MyController = tslib_1.__decorate([
                __1.intercept(log)
            ], MyController);
            ctx.bind('name').to('John');
            const msg = await __1.invokeMethod(MyController, 'greetStaticWithDI', ctx);
            testlab_1.expect(msg).to.equal('Hello, John');
            testlab_1.expect(events).to.eql([
                'globalLog: before-greetStaticWithDI',
                'log: before-greetStaticWithDI',
                'log: after-greetStaticWithDI',
                'globalLog: after-greetStaticWithDI',
            ]);
        });
        function givenGlobalInterceptor() {
            const globalLog = async (invocationCtx, next) => {
                events.push('globalLog: before-' + invocationCtx.methodName);
                const result = await next();
                events.push('globalLog: after-' + invocationCtx.methodName);
                return result;
            };
            ctx.bind('globalLog').to(globalLog).apply(__1.asGlobalInterceptor());
        }
    });
    let events;
    const logSync = (invocationCtx, next) => {
        events.push('logSync: before-' + invocationCtx.methodName);
        // Calling `next()` without `await`
        const result = next();
        // It's possible that the statement below is executed before downstream
        // interceptors or the target method finish
        events.push('logSync: after-' + invocationCtx.methodName);
        return result;
    };
    const log = async (invocationCtx, next) => {
        const source = invocationCtx.source ? `[${invocationCtx.source}] ` : '';
        events.push(`log: ${source}before-${invocationCtx.methodName}`);
        const result = await next();
        events.push(`log: ${source}after-${invocationCtx.methodName}`);
        return result;
    };
    const logError = async (invocationCtx, next) => {
        events.push('logError: before-' + invocationCtx.methodName);
        try {
            const result = await next();
            events.push('logError: after-' + invocationCtx.methodName);
            return result;
        }
        catch (err) {
            events.push('logError: error-' + invocationCtx.methodName);
            throw err;
        }
    };
    // An interceptor to convert the 1st arg to upper case
    const convertName = async (invocationCtx, next) => {
        events.push('convertName: before-' + invocationCtx.methodName);
        invocationCtx.args[0] = invocationCtx.args[0].toUpperCase();
        const result = await next();
        events.push('convertName: after-' + invocationCtx.methodName);
        return result;
    };
    /**
     * A binding provider class to produce an interceptor that validates the
     * `name` argument
     */
    let NameValidator = class NameValidator {
        constructor(validNames) {
            this.validNames = validNames;
        }
        value() {
            return this.intercept.bind(this);
        }
        async intercept(invocationCtx, next) {
            const name = invocationCtx.args[0];
            if (!this.validNames.includes(name)) {
                throw new Error(`Name '${name}' is not on the list of '${this.validNames}`);
            }
            return next();
        }
    };
    NameValidator = tslib_1.__decorate([
        tslib_1.__param(0, __1.inject('valid-names')),
        tslib_1.__metadata("design:paramtypes", [Array])
    ], NameValidator);
    function givenContextAndEvents() {
        ctx = new __1.Context();
        events = [];
    }
});
//# sourceMappingURL=interceptor.acceptance.js.map