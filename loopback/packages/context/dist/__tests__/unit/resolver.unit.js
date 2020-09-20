"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('constructor injection', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').to('FOO');
        ctx.bind('bar').to('BAR');
    });
    it('resolves constructor arguments', () => {
        let TestClass = class TestClass {
            constructor(foo) {
                this.foo = foo;
            }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const t = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.foo).to.eql('FOO');
    });
    it('allows non-injected arguments in constructor', () => {
        let TestClass = class TestClass {
            constructor(foo, nonInjectedArg) {
                this.foo = foo;
                this.nonInjectedArg = nonInjectedArg;
            }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String, String])
        ], TestClass);
        const theNonInjectedArg = 'BAZ';
        const test = __1.instantiateClass(TestClass, ctx, undefined, [
            theNonInjectedArg,
        ]);
        testlab_1.expect(test.foo).to.eql('FOO');
        testlab_1.expect(test.nonInjectedArg).to.eql('BAZ');
    });
    it('can report error for missing binding key', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let TestClass = class TestClass {
                constructor(fooBar) {
                    this.fooBar = fooBar;
                }
            };
            TestClass = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject('', { x: 'bar' })),
                tslib_1.__metadata("design:paramtypes", [String])
            ], TestClass);
        }).to.throw(/A non-empty binding selector or resolve function is required for @inject/);
    });
    it('allows optional constructor injection', () => {
        let TestClass = class TestClass {
            constructor(fooBar) {
                this.fooBar = fooBar;
            }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('optional-binding-key', { optional: true })),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], TestClass);
        const test = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(test.fooBar).to.be.undefined();
    });
    it('allows optional constructor injection with default value', () => {
        let TestClass = class TestClass {
            constructor(fooBar = 'fooBar') {
                this.fooBar = fooBar;
            }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('optional-binding-key', { optional: true })),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const test = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(test.fooBar).to.be.eql('fooBar');
    });
    it('allows optional property injection with default value', () => {
        class TestClass {
            constructor() {
                this.fooBar = 'fooBar';
            }
        }
        tslib_1.__decorate([
            __1.inject('optional-binding-key', { optional: true }),
            tslib_1.__metadata("design:type", Object)
        ], TestClass.prototype, "fooBar", void 0);
        const test = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(test.fooBar).to.be.eql('fooBar');
    });
    it('resolves constructor arguments with custom resolve function', () => {
        let TestClass = class TestClass {
            constructor(fooBar) {
                this.fooBar = fooBar;
            }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo', { x: 'bar' }, (c, injection) => {
                const barKey = injection.metadata.x;
                const b = c.getSync(barKey);
                const f = c.getSync(injection.bindingSelector);
                return f + ':' + b;
            })),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const t = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.fooBar).to.eql('FOO:BAR');
    });
    it('resolves constructor arguments with custom resolve function and no binding key', () => {
        let TestClass = class TestClass {
            constructor(fooBar) {
                this.fooBar = fooBar;
            }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('', { x: 'bar' }, (c, injection) => {
                const barKey = injection.metadata.x;
                const b = c.getSync(barKey);
                return 'foo' + ':' + b;
            })),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const t = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.fooBar).to.eql('foo:BAR');
    });
    it('resolves constructor arguments with custom decorator', () => {
        let TestClass = class TestClass {
            constructor(fooBar) {
                this.fooBar = fooBar;
            }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, customDecorator({ x: 'bar' })),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const t = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.fooBar).to.eql('FOO:BAR');
    });
    it('reports circular dependencies of two bindings', () => {
        const context = new __1.Context();
        class XClass {
        }
        tslib_1.__decorate([
            __1.inject('y'),
            tslib_1.__metadata("design:type", Object)
        ], XClass.prototype, "y", void 0);
        class YClass {
        }
        tslib_1.__decorate([
            __1.inject('x'),
            tslib_1.__metadata("design:type", Object)
        ], YClass.prototype, "x", void 0);
        context.bind('x').toClass(XClass);
        context.bind('y').toClass(YClass);
        testlab_1.expect(() => context.getSync('x')).to.throw('Circular dependency detected: x --> @XClass.prototype.y ' +
            '--> y --> @YClass.prototype.x --> x');
        testlab_1.expect(() => context.getSync('y')).to.throw('Circular dependency detected: y --> @YClass.prototype.x ' +
            '--> x --> @XClass.prototype.y --> y');
    });
    it('reports circular dependencies of three bindings', () => {
        const context = new __1.Context();
        let XClass = class XClass {
            constructor(y) {
                this.y = y;
            }
        };
        XClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('y')),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], XClass);
        let YClass = class YClass {
            constructor(z) {
                this.z = z;
            }
        };
        YClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('z')),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], YClass);
        let ZClass = class ZClass {
            constructor(x) {
                this.x = x;
            }
        };
        ZClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('x')),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], ZClass);
        context.bind('x').toClass(XClass);
        context.bind('y').toClass(YClass);
        context.bind('z').toClass(ZClass);
        testlab_1.expect(() => context.getSync('x')).to.throw('Circular dependency detected: x --> @XClass.constructor[0] --> y ' +
            '--> @YClass.constructor[0] --> z --> @ZClass.constructor[0] --> x');
        testlab_1.expect(() => context.getSync('y')).to.throw('Circular dependency detected: y --> @YClass.constructor[0] --> z ' +
            '--> @ZClass.constructor[0] --> x --> @XClass.constructor[0] --> y');
        testlab_1.expect(() => context.getSync('z')).to.throw('Circular dependency detected: z --> @ZClass.constructor[0] --> x ' +
            '--> @XClass.constructor[0] --> y --> @YClass.constructor[0] --> z');
    });
    it('will not report circular dependencies if a binding is injected twice', () => {
        const context = new __1.Context();
        class XClass {
        }
        let YClass = class YClass {
            constructor(a, b) {
                this.a = a;
                this.b = b;
            }
        };
        YClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('x')),
            tslib_1.__param(1, __1.inject('x')),
            tslib_1.__metadata("design:paramtypes", [XClass,
                XClass])
        ], YClass);
        context.bind('x').toClass(XClass);
        context.bind('y').toClass(YClass);
        const y = context.getSync('y');
        testlab_1.expect(y.a).to.be.instanceof(XClass);
        testlab_1.expect(y.b).to.be.instanceof(XClass);
    });
    it('tracks path of bindings', () => {
        const context = new __1.Context();
        let bindingPath = '';
        let resolutionPath = '';
        class ZClass {
        }
        tslib_1.__decorate([
            __1.inject('p', {}, 
            // Set up a custom resolve() to access information from the session
            (c, injection, session) => {
                bindingPath = session.getBindingPath();
                resolutionPath = session.getResolutionPath();
            }),
            tslib_1.__metadata("design:type", String)
        ], ZClass.prototype, "myProp", void 0);
        let YClass = class YClass {
            constructor(z) {
                this.z = z;
            }
        };
        YClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('z')),
            tslib_1.__metadata("design:paramtypes", [ZClass])
        ], YClass);
        let XClass = class XClass {
            constructor(y) {
                this.y = y;
            }
        };
        XClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('y')),
            tslib_1.__metadata("design:paramtypes", [YClass])
        ], XClass);
        context.bind('x').toClass(XClass);
        context.bind('y').toClass(YClass);
        context.bind('z').toClass(ZClass);
        context.getSync('x');
        testlab_1.expect(bindingPath).to.eql('x --> y --> z');
        testlab_1.expect(resolutionPath).to.eql('x --> @XClass.constructor[0] --> y --> @YClass.constructor[0]' +
            ' --> z --> @ZClass.prototype.myProp');
    });
    it('tracks path of bindings for @inject.getter', async () => {
        const context = new __1.Context();
        let bindingPath = '';
        let resolutionPath = '';
        let decorators = [];
        class ZClass {
        }
        tslib_1.__decorate([
            __1.inject('p', {}, 
            // Set up a custom resolve() to access information from the session
            (c, injection, session) => {
                bindingPath = session.getBindingPath();
                resolutionPath = session.getResolutionPath();
                decorators = session.injectionStack.map(i => i.metadata.decorator);
            }),
            tslib_1.__metadata("design:type", String)
        ], ZClass.prototype, "myProp", void 0);
        let YClass = class YClass {
            constructor(z) {
                this.z = z;
            }
        };
        YClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.getter('z')),
            tslib_1.__metadata("design:paramtypes", [Function])
        ], YClass);
        let XClass = class XClass {
            constructor(y) {
                this.y = y;
            }
        };
        XClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('y')),
            tslib_1.__metadata("design:paramtypes", [YClass])
        ], XClass);
        context.bind('x').toClass(XClass);
        context.bind('y').toClass(YClass);
        context.bind('z').toClass(ZClass);
        const x = context.getSync('x');
        await x.y.z();
        testlab_1.expect(bindingPath).to.eql('x --> y --> z');
        testlab_1.expect(resolutionPath).to.eql('x --> @XClass.constructor[0] --> y --> @YClass.constructor[0]' +
            ' --> z --> @ZClass.prototype.myProp');
        testlab_1.expect(decorators).to.eql(['@inject', '@inject.getter', '@inject']);
    });
    it('tracks path of injections', () => {
        const context = new __1.Context();
        let injectionPath = '';
        class ZClass {
        }
        tslib_1.__decorate([
            __1.inject('p', {}, 
            // Set up a custom resolve() to access information from the session
            (c, injection, session) => {
                injectionPath = session.getInjectionPath();
            }),
            tslib_1.__metadata("design:type", String)
        ], ZClass.prototype, "myProp", void 0);
        let YClass = class YClass {
            constructor(z) {
                this.z = z;
            }
        };
        YClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('z')),
            tslib_1.__metadata("design:paramtypes", [ZClass])
        ], YClass);
        let XClass = class XClass {
            constructor(y) {
                this.y = y;
            }
        };
        XClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('y')),
            tslib_1.__metadata("design:paramtypes", [YClass])
        ], XClass);
        context.bind('x').toClass(XClass);
        context.bind('y').toClass(YClass);
        context.bind('z').toClass(ZClass);
        context.getSync('x');
        testlab_1.expect(injectionPath).to.eql('XClass.constructor[0] --> YClass.constructor[0] --> ZClass.prototype.myProp');
    });
});
describe('async constructor injection', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').toDynamicValue(() => Promise.resolve('FOO'));
        ctx.bind('bar').toDynamicValue(() => Promise.resolve('BAR'));
    });
    it('resolves constructor arguments', async () => {
        let TestClass = class TestClass {
            constructor(foo) {
                this.foo = foo;
            }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const t = await __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.foo).to.eql('FOO');
    });
    it('resolves constructor arguments with custom async decorator', async () => {
        let TestClass = class TestClass {
            constructor(fooBar) {
                this.fooBar = fooBar;
            }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, customAsyncDecorator({ x: 'bar' })),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const t = await __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.fooBar).to.eql('FOO:BAR');
    });
});
describe('property injection', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').to('FOO');
        ctx.bind('bar').to('BAR');
    });
    it('resolves injected properties', () => {
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('foo'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "foo", void 0);
        const t = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.foo).to.eql('FOO');
    });
    it('can report error for missing binding key', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestClass {
            }
            tslib_1.__decorate([
                __1.inject('', { x: 'bar' }),
                tslib_1.__metadata("design:type", String)
            ], TestClass.prototype, "fooBar", void 0);
        }).to.throw(/A non-empty binding selector or resolve function is required for @inject/);
    });
    it('resolves injected properties with custom resolve function', () => {
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('foo', { x: 'bar' }, (c, injection) => {
                const barKey = injection.metadata.x;
                const b = c.getSync(barKey);
                const f = c.getSync(injection.bindingSelector);
                return f + ':' + b;
            }),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "fooBar", void 0);
        const t = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.fooBar).to.eql('FOO:BAR');
    });
    it('resolves inject properties with custom resolve function and no binding key', () => {
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('', { x: 'bar' }, (c, injection) => {
                const barKey = injection.metadata.x;
                const b = c.getSync(barKey);
                return 'foo' + ':' + b;
            }),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "fooBar", void 0);
        const t = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.fooBar).to.eql('foo:BAR');
    });
    it('resolves injected properties with custom decorator', () => {
        class TestClass {
        }
        tslib_1.__decorate([
            customDecorator({ x: 'bar' }),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "fooBar", void 0);
        const t = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.fooBar).to.eql('FOO:BAR');
    });
});
describe('async property injection', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').toDynamicValue(() => Promise.resolve('FOO'));
        ctx.bind('bar').toDynamicValue(() => Promise.resolve('BAR'));
    });
    it('resolves injected properties', async () => {
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('foo'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "foo", void 0);
        const t = await __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.foo).to.eql('FOO');
    });
    it('resolves properties with custom async decorator', async () => {
        class TestClass {
        }
        tslib_1.__decorate([
            customAsyncDecorator({ x: 'bar' }),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "fooBar", void 0);
        const t = await __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.fooBar).to.eql('FOO:BAR');
    });
});
describe('dependency injection', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').to('FOO');
        ctx.bind('bar').to('BAR');
    });
    it('resolves properties and constructor arguments', () => {
        let TestClass = class TestClass {
            constructor(foo) {
                this.foo = foo;
            }
        };
        tslib_1.__decorate([
            __1.inject('bar'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "bar", void 0);
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const t = __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.foo).to.eql('FOO');
        testlab_1.expect(t.bar).to.eql('BAR');
    });
});
describe('async dependency injection', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').toDynamicValue(() => Promise.resolve('FOO'));
        ctx.bind('bar').toDynamicValue(() => Promise.resolve('BAR'));
    });
    it('resolves properties and constructor arguments', async () => {
        let TestClass = class TestClass {
            constructor(foo) {
                this.foo = foo;
            }
        };
        tslib_1.__decorate([
            __1.inject('bar'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "bar", void 0);
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const t = await __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.foo).to.eql('FOO');
        testlab_1.expect(t.bar).to.eql('BAR');
    });
});
describe('async constructor & sync property injection', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').toDynamicValue(() => Promise.resolve('FOO'));
        ctx.bind('bar').to('BAR');
    });
    it('resolves properties and constructor arguments', async () => {
        let TestClass = class TestClass {
            constructor(foo) {
                this.foo = foo;
            }
        };
        tslib_1.__decorate([
            __1.inject('bar'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "bar", void 0);
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const t = await __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.foo).to.eql('FOO');
        testlab_1.expect(t.bar).to.eql('BAR');
    });
});
describe('async constructor injection with errors', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').toDynamicValue(() => new Promise((resolve, reject) => {
            setImmediate(() => {
                reject(new Error('foo: error'));
            });
        }));
    });
    it('resolves properties and constructor arguments', async () => {
        let TestClass = class TestClass {
            constructor(foo) {
                this.foo = foo;
            }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        await testlab_1.expect(__1.instantiateClass(TestClass, ctx)).to.be.rejectedWith('foo: error');
    });
});
describe('async property injection with errors', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('bar').toDynamicValue(async () => {
            throw new Error('bar: error');
        });
    });
    it('resolves properties and constructor arguments', async () => {
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('bar'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "bar", void 0);
        await testlab_1.expect(__1.instantiateClass(TestClass, ctx)).to.be.rejectedWith('bar: error');
    });
});
describe('sync constructor & async property injection', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').to('FOO');
        ctx.bind('bar').toDynamicValue(() => Promise.resolve('BAR'));
    });
    it('resolves properties and constructor arguments', async () => {
        let TestClass = class TestClass {
            constructor(foo) {
                this.foo = foo;
            }
        };
        tslib_1.__decorate([
            __1.inject('bar'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "bar", void 0);
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const t = await __1.instantiateClass(TestClass, ctx);
        testlab_1.expect(t.foo).to.eql('FOO');
        testlab_1.expect(t.bar).to.eql('BAR');
    });
});
function customDecorator(def) {
    return __1.inject('foo', def, (c, injection) => {
        const barKey = injection.metadata.x;
        const b = c.getSync(barKey);
        const f = c.getSync(injection.bindingSelector);
        return f + ':' + b;
    });
}
function customAsyncDecorator(def) {
    return __1.inject('foo', def, async (c, injection) => {
        const barKey = injection.metadata.x;
        const b = await c.get(barKey);
        const f = await c.get(injection.bindingSelector);
        return f + ':' + b;
    });
}
describe('method injection', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').to('FOO');
        ctx.bind('bar').to('BAR');
    });
    it('resolves method arguments for the prototype', () => {
        let savedInstance;
        class TestClass {
            test(foo) {
                savedInstance = this;
                return `hello ${foo}`;
            }
        }
        tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass.prototype, "test", null);
        const t = __1.invokeMethod(TestClass.prototype, 'test', ctx);
        testlab_1.expect(savedInstance).to.exactly(TestClass.prototype);
        testlab_1.expect(t).to.eql('hello FOO');
    });
    it('resolves method arguments for a given instance', () => {
        let savedInstance;
        class TestClass {
            test(foo) {
                savedInstance = this;
                this.bar = foo;
                return `hello ${foo}`;
            }
        }
        tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass.prototype, "test", null);
        const inst = new TestClass();
        const t = __1.invokeMethod(inst, 'test', ctx);
        testlab_1.expect(savedInstance).to.exactly(inst);
        testlab_1.expect(t).to.eql('hello FOO');
        testlab_1.expect(inst.bar).to.eql('FOO');
    });
    it('reports error for missing binding key', () => {
        class TestClass {
            test(fooBar) { }
        }
        tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('key-does-not-exist')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass.prototype, "test", null);
        testlab_1.expect(() => {
            __1.invokeMethod(TestClass.prototype, 'test', ctx);
        }).to.throw(/The key .+ is not bound to any value/);
    });
    it('resolves arguments for a static method', () => {
        class TestClass {
            static test(fooBar) {
                return `Hello, ${fooBar}`;
            }
        }
        tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass, "test", null);
        const msg = __1.invokeMethod(TestClass, 'test', ctx);
        testlab_1.expect(msg).to.eql('Hello, FOO');
    });
});
describe('async method injection', () => {
    let ctx;
    before(function () {
        ctx = new __1.Context();
        ctx.bind('foo').toDynamicValue(() => Promise.resolve('FOO'));
        ctx.bind('bar').toDynamicValue(() => Promise.resolve('BAR'));
    });
    it('resolves arguments for a prototype method', async () => {
        class TestClass {
            test(foo) {
                return `hello ${foo}`;
            }
        }
        tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass.prototype, "test", null);
        const t = await __1.invokeMethod(TestClass.prototype, 'test', ctx);
        testlab_1.expect(t).to.eql('hello FOO');
    });
    it('resolves arguments for a prototype method with an instance', async () => {
        class TestClass {
            test(foo) {
                this.bar = foo;
                return `hello ${foo}`;
            }
        }
        tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass.prototype, "test", null);
        const inst = new TestClass();
        const t = await __1.invokeMethod(inst, 'test', ctx);
        testlab_1.expect(t).to.eql('hello FOO');
        testlab_1.expect(inst.bar).to.eql('FOO');
    });
    it('resolves arguments for a method that returns a promise', async () => {
        let savedInstance;
        class TestClass {
            test(foo) {
                savedInstance = this;
                this.bar = foo;
                return Promise.resolve(`hello ${foo}`);
            }
        }
        tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass.prototype, "test", null);
        const inst = new TestClass();
        const t = await __1.invokeMethod(inst, 'test', ctx);
        testlab_1.expect(savedInstance).to.exactly(inst);
        testlab_1.expect(t).to.eql('hello FOO');
        testlab_1.expect(inst.bar).to.eql('FOO');
    });
});
describe('concurrent resolutions', () => {
    let asyncCount = 0;
    let syncCount = 0;
    beforeEach(() => {
        asyncCount = 0;
        syncCount = 0;
    });
    it('returns the same value for concurrent resolutions of the same binding - CONTEXT', async () => {
        const ctx = new __1.Context('request');
        ctx
            .bind('asyncValue')
            .toProvider(AsyncValueProvider)
            .inScope(__1.BindingScope.CONTEXT);
        ctx
            .bind('syncValue')
            .toProvider(SyncValueProvider)
            .inScope(__1.BindingScope.CONTEXT);
        ctx.bind('AsyncValueUser').toClass(AsyncValueUser);
        const user = await ctx.get('AsyncValueUser');
        testlab_1.expect(user.asyncValue1).to.eql('async value: 0');
        testlab_1.expect(user.asyncValue2).to.eql('async value: 0');
        testlab_1.expect(user.syncValue1).to.eql('sync value: 0');
        testlab_1.expect(user.syncValue2).to.eql('sync value: 0');
    });
    it('returns the same value for concurrent resolutions of the same binding -  SINGLETON', async () => {
        const ctx = new __1.Context('request');
        ctx
            .bind('asyncValue')
            .toProvider(AsyncValueProvider)
            .inScope(__1.BindingScope.SINGLETON);
        ctx
            .bind('syncValue')
            .toProvider(SyncValueProvider)
            .inScope(__1.BindingScope.SINGLETON);
        ctx.bind('AsyncValueUser').toClass(AsyncValueUser);
        const user = await ctx.get('AsyncValueUser');
        testlab_1.expect(user.asyncValue1).to.eql('async value: 0');
        testlab_1.expect(user.asyncValue2).to.eql('async value: 0');
        testlab_1.expect(user.syncValue1).to.eql('sync value: 0');
        testlab_1.expect(user.syncValue2).to.eql('sync value: 0');
    });
    it('returns new values for concurrent resolutions of the same binding -  TRANSIENT', async () => {
        const ctx = new __1.Context('request');
        ctx
            .bind('asyncValue')
            .toProvider(AsyncValueProvider)
            .inScope(__1.BindingScope.TRANSIENT);
        ctx
            .bind('syncValue')
            .toProvider(SyncValueProvider)
            .inScope(__1.BindingScope.TRANSIENT);
        ctx.bind('AsyncValueUser').toClass(AsyncValueUser);
        const user = await ctx.get('AsyncValueUser');
        testlab_1.expect(user.asyncValue1).to.eql('async value: 0');
        testlab_1.expect(user.asyncValue2).to.eql('async value: 1');
        testlab_1.expect(user.syncValue1).to.eql('sync value: 0');
        testlab_1.expect(user.syncValue2).to.eql('sync value: 1');
    });
    class AsyncValueProvider {
        value() {
            return Promise.resolve(`async value: ${asyncCount++}`);
        }
    }
    class SyncValueProvider {
        value() {
            return `sync value: ${syncCount++}`;
        }
    }
    let AsyncValueUser = class AsyncValueUser {
        constructor(asyncValue1, asyncValue2, syncValue1, syncValue2) {
            this.asyncValue1 = asyncValue1;
            this.asyncValue2 = asyncValue2;
            this.syncValue1 = syncValue1;
            this.syncValue2 = syncValue2;
        }
    };
    AsyncValueUser = tslib_1.__decorate([
        tslib_1.__param(0, __1.inject('asyncValue')),
        tslib_1.__param(1, __1.inject('asyncValue')),
        tslib_1.__param(2, __1.inject('syncValue')),
        tslib_1.__param(3, __1.inject('syncValue')),
        tslib_1.__metadata("design:paramtypes", [String, String, String, String])
    ], AsyncValueUser);
});
//# sourceMappingURL=resolver.unit.js.map