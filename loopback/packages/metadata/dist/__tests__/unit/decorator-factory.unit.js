"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/metadata
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('DecoratorFactory.cloneDeep', () => {
    it('keeps functions/classes', () => {
        class MyController {
        }
        const val = {
            target: MyController,
            fn: function () { },
            spec: { x: 1 },
        };
        const copy = __1.DecoratorFactory.cloneDeep(val);
        testlab_1.expect(copy.target).to.be.exactly(val.target);
        testlab_1.expect(copy.fn).to.be.exactly(val.fn);
        testlab_1.expect(copy.spec).to.not.exactly(val.spec);
        testlab_1.expect(copy).to.be.eql(val);
    });
    it('keeps class prototypes', () => {
        class MyController {
        }
        const val = {
            target: MyController.prototype,
            spec: { x: 1 },
        };
        const copy = __1.DecoratorFactory.cloneDeep(val);
        testlab_1.expect(copy.target).to.be.exactly(val.target);
        testlab_1.expect(copy.spec).to.not.exactly(val.spec);
        testlab_1.expect(copy).to.be.eql(val);
    });
    it('keeps user-defined class instances', () => {
        class MyController {
            constructor(x) {
                this.x = x;
            }
        }
        const val = {
            target: new MyController('A'),
        };
        const copy = __1.DecoratorFactory.cloneDeep(val);
        testlab_1.expect(copy.target).to.exactly(val.target);
    });
    it('clones dates', () => {
        const val = {
            d: new Date(),
        };
        const copy = __1.DecoratorFactory.cloneDeep(val);
        testlab_1.expect(copy.d).to.not.exactly(val.d);
        testlab_1.expect(copy).to.be.eql(val);
    });
    it('clones regexp', () => {
        const val = {
            re: /Ab/,
        };
        const copy = __1.DecoratorFactory.cloneDeep(val);
        testlab_1.expect(copy.re).to.not.exactly(val.re);
        testlab_1.expect(copy).to.be.eql(val);
    });
});
describe('ClassDecoratorFactory', () => {
    /**
     * Define `@classDecorator(spec)`
     * @param spec
     */
    function classDecorator(spec) {
        return __1.ClassDecoratorFactory.createDecorator('test', spec);
    }
    function testDecorator(spec) {
        return __1.ClassDecoratorFactory.createDecorator('test', spec, {
            decoratorName: '@test',
        });
    }
    const xSpec = { x: 1 };
    let BaseController = class BaseController {
    };
    BaseController = tslib_1.__decorate([
        classDecorator(xSpec)
    ], BaseController);
    let SubController = class SubController extends BaseController {
    };
    SubController = tslib_1.__decorate([
        classDecorator({ y: 2 })
    ], SubController);
    it('applies metadata to a class', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql(xSpec);
        // By default, the input spec is cloned
        testlab_1.expect(meta).to.not.exactly(xSpec);
        testlab_1.expect(meta[__1.DecoratorFactory.TARGET]).to.equal(BaseController);
    });
    it('merges with base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController);
        testlab_1.expect(meta).to.eql({ x: 1, y: 2 });
        // The subclass spec should not the same instance as the input spec
        testlab_1.expect(meta).to.not.exactly(xSpec);
        testlab_1.expect(meta[__1.DecoratorFactory.TARGET]).to.equal(SubController);
    });
    it('does not mutate base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql({ x: 1 });
        testlab_1.expect(meta[__1.DecoratorFactory.TARGET]).to.equal(BaseController);
    });
    it('throws if applied more than once on the target', () => {
        testlab_1.expect(() => {
            let MyController = 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MyController {
            };
            MyController = tslib_1.__decorate([
                classDecorator({ x: 1 }),
                classDecorator({ y: 2 })
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ], MyController);
        }).to.throw(/ClassDecorator cannot be applied more than once on class MyController/);
    });
    it('throws with decoratorName if applied more than once on the target', () => {
        testlab_1.expect(() => {
            let MyController = 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MyController {
            };
            MyController = tslib_1.__decorate([
                testDecorator({ x: 1 }),
                testDecorator({ y: 2 })
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ], MyController);
        }).to.throw(/@test cannot be applied more than once on class MyController/);
    });
});
describe('ClassDecoratorFactory for primitive types', () => {
    /**
     * Define `@classDecorator(spec)`
     * @param spec
     */
    function classDecorator(spec) {
        return __1.ClassDecoratorFactory.createDecorator('test', spec);
    }
    const xSpec = 1;
    let BaseController = class BaseController {
    };
    BaseController = tslib_1.__decorate([
        classDecorator(xSpec)
    ], BaseController);
    let SubController = class SubController extends BaseController {
    };
    SubController = tslib_1.__decorate([
        classDecorator(2)
    ], SubController);
    it('applies metadata to a class', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.equal(xSpec);
    });
    it('merges with base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController);
        testlab_1.expect(meta).to.equal(2);
    });
    it('does not mutate base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.equal(1);
    });
});
describe('ClassDecoratorFactory with create', () => {
    /**
     * Define `@classDecorator(spec)`
     * @param spec
     */
    function classDecorator(spec) {
        const factory = new __1.ClassDecoratorFactory('test', spec);
        return factory.create();
    }
    let BaseController = class BaseController {
    };
    BaseController = tslib_1.__decorate([
        classDecorator({ x: 1 })
    ], BaseController);
    let SubController = class SubController extends BaseController {
    };
    SubController = tslib_1.__decorate([
        classDecorator({ y: 2 })
    ], SubController);
    it('applies metadata to a class', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
    it('merges with base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController);
        testlab_1.expect(meta).to.eql({ x: 1, y: 2 });
    });
    it('does not mutate base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
});
describe('ClassDecoratorFactory without inheritance', () => {
    /**
     * Define `@classDecorator(spec)`
     * @param spec
     */
    function classDecorator(spec) {
        return __1.ClassDecoratorFactory.createDecorator('test', spec, {
            allowInheritance: false,
        });
    }
    let BaseController = class BaseController {
    };
    BaseController = tslib_1.__decorate([
        classDecorator({ x: 1 })
    ], BaseController);
    let SubController = class SubController extends BaseController {
    };
    SubController = tslib_1.__decorate([
        classDecorator({ y: 2 })
    ], SubController);
    it('applies metadata to a class', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
    it('merges with base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController);
        testlab_1.expect(meta).to.eql({ y: 2 });
    });
    it('does not mutate base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
});
describe('ClassDecoratorFactory with cloneInputSpec set to false', () => {
    /**
     * Define `@classDecorator(spec)`
     * @param spec
     */
    function classDecorator(spec) {
        return __1.ClassDecoratorFactory.createDecorator('test', spec, {
            cloneInputSpec: false,
        });
    }
    const mySpec = { x: 1 };
    let BaseController = class BaseController {
    };
    BaseController = tslib_1.__decorate([
        classDecorator(mySpec)
    ], BaseController);
    it('clones input spec', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.exactly(mySpec);
        testlab_1.expect(meta).to.eql(mySpec);
    });
});
describe('ClassDecoratorFactory does not inherit array values', () => {
    /**
     * Define `@classDecorator(spec)`
     * @param spec
     */
    function classDecorator(spec) {
        return __1.ClassDecoratorFactory.createDecorator('test', spec);
    }
    let BaseController = class BaseController {
    };
    BaseController = tslib_1.__decorate([
        classDecorator([1])
    ], BaseController);
    let SubController = class SubController extends BaseController {
    };
    SubController = tslib_1.__decorate([
        classDecorator([2])
    ], SubController);
    it('applies metadata to a class', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql([1]);
    });
    it('merges with base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController);
        testlab_1.expect(meta).to.eql([2]);
    });
    it('does not mutate base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql([1]);
    });
});
describe('ClassDecoratorFactory with custom inherit', () => {
    /**
     * Define `@classDecorator(spec)`
     * @param spec
     */
    function classDecorator(spec) {
        class MyClassDecoratorFactory extends __1.ClassDecoratorFactory {
            /**
             * Override the `inherit` method to skip metadata from the base
             * @param baseMeta
             */
            inherit(baseMeta) {
                return this.spec;
            }
        }
        return MyClassDecoratorFactory.createDecorator('test', spec);
    }
    let BaseController = class BaseController {
    };
    BaseController = tslib_1.__decorate([
        classDecorator({ x: 1 })
    ], BaseController);
    let SubController = class SubController extends BaseController {
    };
    SubController = tslib_1.__decorate([
        classDecorator({ y: 2 })
    ], SubController);
    it('applies metadata to a class', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
    it('merges with base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController);
        testlab_1.expect(meta).to.eql({ y: 2 });
    });
    it('does not mutate base class metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
});
describe('PropertyDecoratorFactory', () => {
    /**
     * Define `@propertyDecorator(spec)`
     * @param spec
     */
    function propertyDecorator(spec) {
        return __1.PropertyDecoratorFactory.createDecorator('test', spec);
    }
    class BaseController {
    }
    tslib_1.__decorate([
        propertyDecorator({ x: 1 }),
        tslib_1.__metadata("design:type", String)
    ], BaseController.prototype, "myProp", void 0);
    class SubController extends BaseController {
    }
    tslib_1.__decorate([
        propertyDecorator({ y: 2 }),
        tslib_1.__metadata("design:type", String)
    ], SubController.prototype, "myProp", void 0);
    it('applies metadata to a property', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
        testlab_1.expect(meta.myProp).to.eql({ x: 1 });
    });
    it('merges with base property metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController.prototype);
        testlab_1.expect(meta.myProp).to.eql({ x: 1, y: 2 });
    });
    it('does not mutate base property metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
        testlab_1.expect(meta.myProp).to.eql({ x: 1 });
    });
    it('throws if applied more than once on the same property', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MyController {
            }
            tslib_1.__decorate([
                propertyDecorator({ x: 1 }),
                propertyDecorator({ y: 2 }),
                tslib_1.__metadata("design:type", String)
            ], MyController.prototype, "myProp", void 0);
        }).to.throw(/Decorator cannot be applied more than once on MyController\.prototype\.myProp/);
    });
});
describe('PropertyDecoratorFactory for static properties', () => {
    /**
     * Define `@propertyDecorator(spec)`
     * @param spec
     */
    function propertyDecorator(spec) {
        return __1.PropertyDecoratorFactory.createDecorator('test', spec);
    }
    class BaseController {
    }
    tslib_1.__decorate([
        propertyDecorator({ x: 1 }),
        tslib_1.__metadata("design:type", String)
    ], BaseController, "myProp", void 0);
    class SubController extends BaseController {
    }
    tslib_1.__decorate([
        propertyDecorator({ y: 2 }),
        tslib_1.__metadata("design:type", String)
    ], SubController, "myProp", void 0);
    it('applies metadata to a property', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta.myProp).to.eql({ x: 1 });
    });
    it('merges with base property metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController);
        testlab_1.expect(meta.myProp).to.eql({ x: 1, y: 2 });
    });
    it('does not mutate base property metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta.myProp).to.eql({ x: 1 });
    });
    it('throws if applied more than once on the same static property', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MyController {
            }
            tslib_1.__decorate([
                propertyDecorator({ x: 1 }),
                propertyDecorator({ y: 2 }),
                tslib_1.__metadata("design:type", String)
            ], MyController, "myProp", void 0);
        }).to.throw(/Decorator cannot be applied more than once on MyController\.myProp/);
    });
});
describe('MethodDecoratorFactory', () => {
    /**
     * Define `@methodDecorator(spec)`
     * @param spec
     */
    function methodDecorator(spec) {
        return __1.MethodDecoratorFactory.createDecorator('test', spec);
    }
    class BaseController {
        myMethod() { }
    }
    tslib_1.__decorate([
        methodDecorator({ x: 1 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController.prototype, "myMethod", null);
    class SubController extends BaseController {
        myMethod() { }
    }
    tslib_1.__decorate([
        methodDecorator({ y: 2 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], SubController.prototype, "myMethod", null);
    it('applies metadata to a method', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
        testlab_1.expect(meta.myMethod).to.eql({ x: 1 });
    });
    it('merges with base method metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController.prototype);
        testlab_1.expect(meta.myMethod).to.eql({ x: 1, y: 2 });
    });
    it('does not mutate base method metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
        testlab_1.expect(meta.myMethod).to.eql({ x: 1 });
    });
    it('throws if applied more than once on the same method', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MyController {
                myMethod() { }
            }
            tslib_1.__decorate([
                methodDecorator({ x: 1 }),
                methodDecorator({ y: 2 }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "myMethod", null);
        }).to.throw(/Decorator cannot be applied more than once on MyController\.prototype\.myMethod\(\)/);
    });
});
describe('MethodDecoratorFactory for static methods', () => {
    /**
     * Define `@methodDecorator(spec)`
     * @param spec
     */
    function methodDecorator(spec) {
        return __1.MethodDecoratorFactory.createDecorator('test', spec);
    }
    class BaseController {
        static myMethod() { }
    }
    tslib_1.__decorate([
        methodDecorator({ x: 1 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController, "myMethod", null);
    class SubController extends BaseController {
        static myMethod() { }
    }
    tslib_1.__decorate([
        methodDecorator({ y: 2 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], SubController, "myMethod", null);
    it('applies metadata to a method', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta.myMethod).to.eql({ x: 1 });
    });
    it('merges with base method metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController);
        testlab_1.expect(meta.myMethod).to.eql({ x: 1, y: 2 });
    });
    it('does not mutate base method metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta.myMethod).to.eql({ x: 1 });
    });
    it('throws if applied more than once on the same static method', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MyController {
                static myMethod() { }
            }
            tslib_1.__decorate([
                methodDecorator({ x: 1 }),
                methodDecorator({ y: 2 }),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", []),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController, "myMethod", null);
        }).to.throw(/Decorator cannot be applied more than once on MyController\.myMethod\(\)/);
    });
});
describe('MethodMultiDecoratorFactory', () => {
    function methodMultiArrayDecorator(...spec) {
        return __1.MethodMultiDecoratorFactory.createDecorator('test', spec);
    }
    function methodMultiDecorator(spec) {
        return __1.MethodMultiDecoratorFactory.createDecorator('test', spec);
    }
    class BaseController {
        myMethod() { }
        multiMethod() { }
        checkDecorator() { }
    }
    tslib_1.__decorate([
        methodMultiArrayDecorator({ x: 1 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController.prototype, "myMethod", null);
    tslib_1.__decorate([
        methodMultiArrayDecorator({ foo: 1 }),
        methodMultiArrayDecorator({ foo: 2 }),
        methodMultiArrayDecorator({ foo: 3 }, { foo: 4 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController.prototype, "multiMethod", null);
    tslib_1.__decorate([
        methodMultiDecorator({ a: 'a' }),
        methodMultiDecorator({ b: 'b' }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController.prototype, "checkDecorator", null);
    class SubController extends BaseController {
        myMethod() { }
        multiMethod() { }
    }
    tslib_1.__decorate([
        methodMultiArrayDecorator({ y: 2 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], SubController.prototype, "myMethod", null);
    tslib_1.__decorate([
        methodMultiArrayDecorator({ bar: 1 }),
        methodMultiArrayDecorator({ bar: 2 }, { bar: 3 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], SubController.prototype, "multiMethod", null);
    describe('single-decorator methods', () => {
        it('applies metadata to a method', () => {
            const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
            testlab_1.expect(meta.myMethod).to.eql([{ x: 1 }]);
        });
        it('merges with base method metadata', () => {
            const meta = __1.Reflector.getOwnMetadata('test', SubController.prototype);
            testlab_1.expect(meta.myMethod).to.eql([{ x: 1 }, { y: 2 }]);
        });
        it('does not mutate base method metadata', () => {
            const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
            testlab_1.expect(meta.myMethod).to.eql([{ x: 1 }]);
        });
    });
    describe('multi-decorator methods', () => {
        it('applies to non-array decorator creation', () => {
            const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
            testlab_1.expect(meta.checkDecorator).to.eql([{ b: 'b' }, { a: 'a' }]);
        });
        it('applies metadata to a method', () => {
            const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
            testlab_1.expect(meta.multiMethod).to.eql([{ foo: 3 }, { foo: 4 }, { foo: 2 }, { foo: 1 }]);
        });
        it('merges with base method metadata', () => {
            const meta = __1.Reflector.getOwnMetadata('test', SubController.prototype);
            testlab_1.expect(meta.multiMethod).to.eql([
                { foo: 3 },
                { foo: 4 },
                { foo: 2 },
                { foo: 1 },
                { bar: 2 },
                { bar: 3 },
                { bar: 1 },
            ]);
        });
        it('does not mutate base method metadata', () => {
            const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
            testlab_1.expect(meta.multiMethod).to.eql([{ foo: 3 }, { foo: 4 }, { foo: 2 }, { foo: 1 }]);
        });
    });
});
describe('MethodMultiDecoratorFactory for static methods', () => {
    function methodMultiArrayDecorator(...spec) {
        return __1.MethodMultiDecoratorFactory.createDecorator('test', spec);
    }
    function methodMultiDecorator(spec) {
        return __1.MethodMultiDecoratorFactory.createDecorator('test', spec);
    }
    class BaseController {
        static myMethod() { }
        static multiMethod() { }
        static checkDecorator() { }
    }
    tslib_1.__decorate([
        methodMultiArrayDecorator({ x: 1 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController, "myMethod", null);
    tslib_1.__decorate([
        methodMultiArrayDecorator({ foo: 1 }),
        methodMultiArrayDecorator({ foo: 2 }),
        methodMultiArrayDecorator({ foo: 3 }, { foo: 4 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController, "multiMethod", null);
    tslib_1.__decorate([
        methodMultiDecorator({ a: 'a' }),
        methodMultiDecorator({ b: 'b' }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController, "checkDecorator", null);
    class SubController extends BaseController {
        static myMethod() { }
        static multiMethod() { }
    }
    tslib_1.__decorate([
        methodMultiArrayDecorator({ y: 2 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], SubController, "myMethod", null);
    tslib_1.__decorate([
        methodMultiArrayDecorator({ bar: 1 }),
        methodMultiArrayDecorator({ bar: 2 }, { bar: 3 }),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", void 0)
    ], SubController, "multiMethod", null);
    describe('single-decorator methods', () => {
        it('applies metadata to a method', () => {
            const meta = __1.Reflector.getOwnMetadata('test', BaseController);
            testlab_1.expect(meta.myMethod).to.eql([{ x: 1 }]);
        });
        it('merges with base method metadata', () => {
            const meta = __1.Reflector.getOwnMetadata('test', SubController);
            testlab_1.expect(meta.myMethod).to.eql([{ x: 1 }, { y: 2 }]);
        });
        it('does not mutate base method metadata', () => {
            const meta = __1.Reflector.getOwnMetadata('test', BaseController);
            testlab_1.expect(meta.myMethod).to.eql([{ x: 1 }]);
        });
    });
    describe('multi-decorator methods', () => {
        it('applies metadata to a method', () => {
            const meta = __1.Reflector.getOwnMetadata('test', BaseController);
            testlab_1.expect(meta.multiMethod).to.eql([{ foo: 3 }, { foo: 4 }, { foo: 2 }, { foo: 1 }]);
        });
        it('applies to non-array decorator creation', () => {
            const meta = __1.Reflector.getOwnMetadata('test', BaseController);
            testlab_1.expect(meta.checkDecorator).to.eql([{ b: 'b' }, { a: 'a' }]);
        });
        it('merges with base method metadata', () => {
            const meta = __1.Reflector.getOwnMetadata('test', SubController);
            testlab_1.expect(meta.multiMethod).to.eql([
                { foo: 3 },
                { foo: 4 },
                { foo: 2 },
                { foo: 1 },
                { bar: 2 },
                { bar: 3 },
                { bar: 1 },
            ]);
        });
        it('does not mutate base method metadata', () => {
            const meta = __1.Reflector.getOwnMetadata('test', BaseController);
            testlab_1.expect(meta.multiMethod).to.eql([{ foo: 3 }, { foo: 4 }, { foo: 2 }, { foo: 1 }]);
        });
    });
});
describe('ParameterDecoratorFactory', () => {
    /**
     * Define `@parameterDecorator(spec)`
     * @param spec
     */
    function parameterDecorator(spec) {
        return __1.ParameterDecoratorFactory.createDecorator('test', spec);
    }
    class BaseController {
        myMethod(a, b) { }
    }
    tslib_1.__decorate([
        tslib_1.__param(0, parameterDecorator({ x: 1 })),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Number]),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController.prototype, "myMethod", null);
    class SubController extends BaseController {
        myMethod(a, b) { }
    }
    tslib_1.__decorate([
        tslib_1.__param(0, parameterDecorator({ y: 2 })),
        tslib_1.__param(1, parameterDecorator({ x: 2 })),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Number]),
        tslib_1.__metadata("design:returntype", void 0)
    ], SubController.prototype, "myMethod", null);
    it('applies metadata to a method parameter', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
        testlab_1.expect(meta.myMethod).to.eql([{ x: 1 }, undefined]);
    });
    it('merges with base method metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController.prototype);
        testlab_1.expect(meta.myMethod).to.eql([{ x: 1, y: 2 }, { x: 2 }]);
    });
    it('does not mutate base method parameter metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
        testlab_1.expect(meta.myMethod).to.eql([{ x: 1 }, undefined]);
    });
    it('throws if applied more than once on the same parameter', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MyController {
                myMethod(x) { }
            }
            tslib_1.__decorate([
                tslib_1.__param(0, parameterDecorator({ x: 1 })),
                tslib_1.__param(0, parameterDecorator({ y: 2 })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "myMethod", null);
        }).to.throw(/Decorator cannot be applied more than once on MyController\.prototype\.myMethod\[0\]/);
    });
});
describe('ParameterDecoratorFactory for a constructor', () => {
    /**
     * Define `@parameterDecorator(spec)`
     * @param spec
     */
    function parameterDecorator(spec) {
        return __1.ParameterDecoratorFactory.createDecorator('test', spec);
    }
    let BaseController = class BaseController {
        constructor(a, b) { }
    };
    BaseController = tslib_1.__decorate([
        tslib_1.__param(0, parameterDecorator({ x: 1 })),
        tslib_1.__metadata("design:paramtypes", [String, Number])
    ], BaseController);
    let SubController = class SubController extends BaseController {
        constructor(a, b) {
            super(a, b);
        }
    };
    SubController = tslib_1.__decorate([
        tslib_1.__param(0, parameterDecorator({ y: 2 })),
        tslib_1.__param(1, parameterDecorator({ x: 2 })),
        tslib_1.__metadata("design:paramtypes", [String, Number])
    ], SubController);
    it('applies metadata to a method parameter', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta['']).to.eql([{ x: 1 }, undefined]);
    });
    it('merges with base method metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController);
        testlab_1.expect(meta['']).to.eql([{ x: 1, y: 2 }, { x: 2 }]);
    });
    it('does not mutate base method parameter metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta['']).to.eql([{ x: 1 }, undefined]);
    });
});
describe('ParameterDecoratorFactory for a static method', () => {
    /**
     * Define `@parameterDecorator(spec)`
     * @param spec
     */
    function parameterDecorator(spec) {
        return __1.ParameterDecoratorFactory.createDecorator('test', spec);
    }
    class BaseController {
        static myMethod(a, b) { }
    }
    tslib_1.__decorate([
        tslib_1.__param(0, parameterDecorator({ x: 1 })),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Number]),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController, "myMethod", null);
    class SubController extends BaseController {
        static myMethod(a, b) { }
    }
    tslib_1.__decorate([
        tslib_1.__param(0, parameterDecorator({ y: 2 })),
        tslib_1.__param(1, parameterDecorator({ x: 2 })),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Number]),
        tslib_1.__metadata("design:returntype", void 0)
    ], SubController, "myMethod", null);
    it('applies metadata to a method parameter', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta['myMethod']).to.eql([{ x: 1 }, undefined]);
    });
    it('merges with base method metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController);
        testlab_1.expect(meta['myMethod']).to.eql([{ x: 1, y: 2 }, { x: 2 }]);
    });
    it('does not mutate base method parameter metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController);
        testlab_1.expect(meta['myMethod']).to.eql([{ x: 1 }, undefined]);
    });
    it('throws if applied more than once on the same parameter', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MyController {
                static myMethod(x) { }
            }
            tslib_1.__decorate([
                tslib_1.__param(0, parameterDecorator({ x: 1 })),
                tslib_1.__param(0, parameterDecorator({ y: 2 })),
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController, "myMethod", null);
        }).to.throw(/Decorator cannot be applied more than once on MyController\.myMethod\[0\]/);
    });
});
describe('MethodParameterDecoratorFactory', () => {
    /**
     * Define `@parameterDecorator(spec)`
     * @param spec
     */
    function methodParameterDecorator(spec) {
        return __1.MethodParameterDecoratorFactory.createDecorator('test', spec);
    }
    class BaseController {
        myMethod(a, b) { }
    }
    tslib_1.__decorate([
        methodParameterDecorator({ x: 1 }) // Will be applied to b
        ,
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Number]),
        tslib_1.__metadata("design:returntype", void 0)
    ], BaseController.prototype, "myMethod", null);
    class SubController extends BaseController {
        myMethod(a, b) { }
    }
    tslib_1.__decorate([
        methodParameterDecorator({ x: 2 }) // For a
        ,
        methodParameterDecorator({ y: 2 }) // For b
        ,
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Number]),
        tslib_1.__metadata("design:returntype", void 0)
    ], SubController.prototype, "myMethod", null);
    it('applies metadata to a method parameter', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
        testlab_1.expect(meta.myMethod).to.eql([undefined, { x: 1 }]);
    });
    it('merges with base method metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', SubController.prototype);
        testlab_1.expect(meta.myMethod).to.eql([{ x: 2 }, { x: 1, y: 2 }]);
    });
    it('does not mutate base method parameter metadata', () => {
        const meta = __1.Reflector.getOwnMetadata('test', BaseController.prototype);
        testlab_1.expect(meta.myMethod).to.eql([undefined, { x: 1 }]);
    });
});
describe('MethodParameterDecoratorFactory with invalid decorations', () => {
    /**
     * Define `@parameterDecorator(spec)`
     * @param spec
     */
    function methodParameterDecorator(spec) {
        return __1.MethodParameterDecoratorFactory.createDecorator('test', spec, {
            decoratorName: '@param',
        });
    }
    it('reports error if the # of decorations exceeeds the # of params', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MyController {
                myMethod(a, b) { }
            }
            tslib_1.__decorate([
                methodParameterDecorator({ x: 1 }) // Causing error
                ,
                methodParameterDecorator({ x: 2 }) // For a
                ,
                methodParameterDecorator({ x: 3 }) // For b
                ,
                tslib_1.__metadata("design:type", Function),
                tslib_1.__metadata("design:paramtypes", [String, Number]),
                tslib_1.__metadata("design:returntype", void 0)
            ], MyController.prototype, "myMethod", null);
        }).to.throw(/@param is used more than 2 time\(s\) on MyController\.prototype\.myMethod\(\)/);
    });
});
//# sourceMappingURL=decorator-factory.unit.js.map