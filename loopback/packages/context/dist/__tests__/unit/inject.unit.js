"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('function argument injection', () => {
    it('can decorate class constructor arguments', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let TestClass = class TestClass {
            constructor(foo) { }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        // the test passes when TypeScript Compiler is happy
    });
    it('can retrieve information about injected constructor arguments', () => {
        let TestClass = class TestClass {
            constructor(foo) { }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        const meta = __1.describeInjectedArguments(TestClass);
        testlab_1.expect(meta.map(m => m.bindingSelector)).to.deepEqual(['foo']);
    });
    it('allows decorator to be explicitly invoked for class ctor args', () => {
        class TestClass {
            constructor(foo) { }
        }
        __1.inject('foo')(TestClass, undefined, 0);
        const meta = __1.describeInjectedArguments(TestClass);
        testlab_1.expect(meta.map(m => m.bindingSelector)).to.deepEqual(['foo']);
    });
    it('can retrieve information about injected method arguments', () => {
        class TestClass {
            test(foo) { }
        }
        tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass.prototype, "test", null);
        const meta = __1.describeInjectedArguments(TestClass.prototype, 'test');
        testlab_1.expect(meta.map(m => m.bindingSelector)).to.deepEqual(['foo']);
    });
    it('can retrieve information about injected static method arguments', () => {
        class TestClass {
            static test(foo) { }
        }
        tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [String]),
            tslib_1.__metadata("design:returntype", void 0)
        ], TestClass, "test", null);
        const meta = __1.describeInjectedArguments(TestClass, 'test');
        testlab_1.expect(meta.map(m => m.bindingSelector)).to.deepEqual(['foo']);
    });
    it('returns an empty array when no ctor arguments are decorated', () => {
        class TestClass {
            constructor(foo) { }
        }
        const meta = __1.describeInjectedArguments(TestClass);
        testlab_1.expect(meta).to.deepEqual([]);
    });
    it('supports inheritance without overriding constructor', () => {
        let TestClass = class TestClass {
            constructor(foo) { }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        class SubTestClass extends TestClass {
        }
        const meta = __1.describeInjectedArguments(SubTestClass);
        testlab_1.expect(meta.map(m => m.bindingSelector)).to.deepEqual(['foo']);
    });
    it('supports inheritance with overriding constructor', () => {
        let TestClass = class TestClass {
            constructor(foo) { }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        let SubTestClass = class SubTestClass extends TestClass {
            constructor(foo) {
                super(foo);
            }
        };
        SubTestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('bar')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], SubTestClass);
        const meta = __1.describeInjectedArguments(SubTestClass);
        testlab_1.expect(meta.map(m => m.bindingSelector)).to.deepEqual(['bar']);
    });
    it('supports inheritance with overriding constructor - no args', () => {
        let TestClass = class TestClass {
            constructor(foo) { }
        };
        TestClass = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject('foo')),
            tslib_1.__metadata("design:paramtypes", [String])
        ], TestClass);
        class SubTestClass extends TestClass {
            constructor() {
                super('foo');
            }
        }
        const meta = __1.describeInjectedArguments(SubTestClass);
        testlab_1.expect(meta.map(m => m.bindingSelector)).to.deepEqual([]);
    });
    // https://github.com/strongloop/loopback-next/issues/2946
    it('allows custom decorator that returns a new constructor', () => {
        class HelloController {
            constructor() {
                this.name = 'Leonard';
            }
        }
        const mixinDecorator = () => (baseConstructor) => class extends baseConstructor {
            constructor() {
                super(...arguments);
                this.classProperty = 'a classProperty';
            }
            classFunction() {
                return 'a classFunction';
            }
        };
        let Test = class Test {
            constructor(controller) {
                this.controller = controller;
            }
        };
        Test = tslib_1.__decorate([
            mixinDecorator(),
            tslib_1.__param(0, __1.inject('controller')),
            tslib_1.__metadata("design:paramtypes", [HelloController])
        ], Test);
        // Now the `Test` class looks like the following:
        /*
        class extends baseConstructor {
                constructor() {
                    super(...arguments);
                    this.classProperty = () => 'a classProperty';
                }
                classFunction() {
                    return 'a classFunction';
                }
            }
        */
        const meta = __1.describeInjectedArguments(Test);
        testlab_1.expect(meta.map(m => m.bindingSelector)).to.deepEqual(['controller']);
    });
    it('reports error if @inject is applied more than once', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            let TestClass = class TestClass {
                constructor(foo) { }
            };
            TestClass = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject('foo')), tslib_1.__param(0, __1.inject('bar')),
                tslib_1.__metadata("design:paramtypes", [String])
            ], TestClass);
        }).to.throw('@inject cannot be applied more than once on TestClass.constructor[0]');
    });
});
describe('property injection', () => {
    it('can decorate properties', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('foo'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "foo", void 0);
        // the test passes when TypeScript Compiler is happy
    });
    it('can retrieve information about injected properties', () => {
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('foo'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "foo", void 0);
        const meta = __1.describeInjectedProperties(TestClass.prototype);
        testlab_1.expect(meta.foo.bindingSelector).to.eql('foo');
    });
    it('returns an empty object when no properties are decorated', () => {
        class TestClass {
        }
        const meta = __1.describeInjectedProperties(TestClass.prototype);
        testlab_1.expect(meta).to.deepEqual({});
    });
    it('cannot decorate static properties', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestClass {
            }
            tslib_1.__decorate([
                __1.inject('foo'),
                tslib_1.__metadata("design:type", String)
            ], TestClass, "foo", void 0);
        }).to.throw(/@inject is not supported for a static property/);
    });
    it('cannot decorate a method', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestClass {
                foo() { }
            }
            tslib_1.__decorate([
                __1.inject('bar'),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], TestClass.prototype, "foo", null);
        }).to.throw(/@inject cannot be used on a method/);
    });
    it('reports error if @inject.* is applied more than once', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestClass {
                constructor() { }
            }
            tslib_1.__decorate([
                __1.inject.getter('foo'),
                __1.inject('bar'),
                tslib_1.__metadata("design:type", String)
            ], TestClass.prototype, "foo", void 0);
        }).to.throw('@inject.getter cannot be applied more than once on TestClass.prototype.foo');
    });
    it('supports inheritance without overriding property', () => {
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('foo'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "foo", void 0);
        class SubTestClass extends TestClass {
        }
        const meta = __1.describeInjectedProperties(SubTestClass.prototype);
        testlab_1.expect(meta.foo.bindingSelector).to.eql('foo');
    });
    it('supports inheritance with overriding property', () => {
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('foo'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "foo", void 0);
        class SubTestClass extends TestClass {
        }
        tslib_1.__decorate([
            __1.inject('bar'),
            tslib_1.__metadata("design:type", String)
        ], SubTestClass.prototype, "foo", void 0);
        const base = __1.describeInjectedProperties(TestClass.prototype);
        testlab_1.expect(base.foo.bindingSelector).to.eql('foo');
        const sub = __1.describeInjectedProperties(SubTestClass.prototype);
        testlab_1.expect(sub.foo.bindingSelector).to.eql('bar');
    });
    it('supports inherited and own properties', () => {
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('foo'),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "foo", void 0);
        class SubTestClass extends TestClass {
        }
        tslib_1.__decorate([
            __1.inject('bar'),
            tslib_1.__metadata("design:type", String)
        ], SubTestClass.prototype, "bar", void 0);
        const meta = __1.describeInjectedProperties(SubTestClass.prototype);
        testlab_1.expect(meta.foo.bindingSelector).to.eql('foo');
        testlab_1.expect(meta.bar.bindingSelector).to.eql('bar');
    });
    it('does not clone metadata deeply', () => {
        const options = { x: 1 };
        class TestClass {
        }
        tslib_1.__decorate([
            __1.inject('foo', options),
            tslib_1.__metadata("design:type", String)
        ], TestClass.prototype, "foo", void 0);
        const meta = __1.describeInjectedProperties(TestClass.prototype);
        testlab_1.expect(meta.foo.metadata).to.be.not.exactly(options);
        testlab_1.expect(meta.foo.metadata).to.eql({ x: 1, decorator: '@inject' });
    });
});
describe('inspectTargetType', () => {
    it('handles static method injection', () => {
        const type = __1.inspectTargetType({
            target: HelloProviderWithMI,
            member: 'value',
            methodDescriptorOrParameterIndex: 0,
            bindingSelector: 'hello',
            metadata: {},
        });
        testlab_1.expect(type).to.eql(Number);
    });
    it('handles prototype method injection', () => {
        const type = __1.inspectTargetType({
            target: HelloProviderWithMI.prototype,
            member: 'count',
            methodDescriptorOrParameterIndex: 0,
            bindingSelector: 'hello',
            metadata: {},
        });
        testlab_1.expect(type).to.eql(Number);
    });
    it('handles constructor injection', () => {
        const type = __1.inspectTargetType({
            target: HelloProviderWithCI,
            member: '',
            methodDescriptorOrParameterIndex: 0,
            bindingSelector: 'hello',
            metadata: {},
        });
        testlab_1.expect(type).to.eql(Number);
    });
    it('handles property injection', () => {
        const type = __1.inspectTargetType({
            target: HelloProviderWithPI.prototype,
            member: 'count',
            bindingSelector: 'hello',
            metadata: {},
        });
        testlab_1.expect(type).to.eql(Number);
    });
    class HelloProviderWithMI {
        static value(count) {
            return 'hello';
        }
        count(count) {
            return count;
        }
    }
    tslib_1.__decorate([
        tslib_1.__param(0, __1.inject('count')),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Number]),
        tslib_1.__metadata("design:returntype", void 0)
    ], HelloProviderWithMI.prototype, "count", null);
    tslib_1.__decorate([
        tslib_1.__param(0, __1.inject('count')),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [Number]),
        tslib_1.__metadata("design:returntype", void 0)
    ], HelloProviderWithMI, "value", null);
    let HelloProviderWithCI = class HelloProviderWithCI {
        constructor(count) { }
    };
    HelloProviderWithCI = tslib_1.__decorate([
        tslib_1.__param(0, __1.inject('count')),
        tslib_1.__metadata("design:paramtypes", [Number])
    ], HelloProviderWithCI);
    class HelloProviderWithPI {
    }
    tslib_1.__decorate([
        __1.inject('count'),
        tslib_1.__metadata("design:type", Number)
    ], HelloProviderWithPI.prototype, "count", void 0);
});
//# sourceMappingURL=inject.unit.js.map