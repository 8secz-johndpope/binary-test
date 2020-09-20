"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/metadata
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Inspector for a class', () => {
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
        classDecorator({ x: 1 })
    ], BaseController);
    let SubController = class SubController extends BaseController {
    };
    SubController = tslib_1.__decorate([
        classDecorator({ y: 2 })
    ], SubController);
    class AnotherController extends BaseController {
    }
    const TEST_META = __1.MetadataAccessor.create('test');
    it('inspects metadata of a base class', () => {
        const meta = __1.MetadataInspector.getClassMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
    it('inspects metadata of a sub class', () => {
        const meta = __1.MetadataInspector.getClassMetadata(TEST_META, SubController);
        testlab_1.expect(meta).to.eql({ x: 1, y: 2 });
    });
    it('inspects metadata of a sub class without override', () => {
        const meta = __1.MetadataInspector.getClassMetadata('test', AnotherController);
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
});
describe('Inspector for a class for its own metadata', () => {
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
        classDecorator({ x: 1 })
    ], BaseController);
    let SubController = class SubController extends BaseController {
    };
    SubController = tslib_1.__decorate([
        classDecorator({ y: 2 })
    ], SubController);
    class AnotherController extends BaseController {
    }
    it('inspects metadata of a base class', () => {
        const meta = __1.MetadataInspector.getClassMetadata('test', BaseController, {
            ownMetadataOnly: true,
        });
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
    it('inspects metadata of a sub class', () => {
        const meta = __1.MetadataInspector.getClassMetadata('test', SubController, {
            ownMetadataOnly: true,
        });
        testlab_1.expect(meta).to.eql({ x: 1, y: 2 });
    });
    it('inspects metadata of a sub class without override', () => {
        const meta = __1.MetadataInspector.getClassMetadata('test', AnotherController, {
            ownMetadataOnly: true,
        });
        testlab_1.expect(meta).to.be.undefined();
    });
});
describe('Inspector for instance properties', () => {
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
    class AnotherController extends BaseController {
    }
    const TEST_META = __1.MetadataAccessor.create('test');
    it('inspects metadata of all properties of a base class', () => {
        const meta = __1.MetadataInspector.getAllPropertyMetadata('test', BaseController.prototype);
        testlab_1.expect(meta).to.eql({ myProp: { x: 1 } });
    });
    it('inspects metadata of a property of a base class', () => {
        const meta = __1.MetadataInspector.getPropertyMetadata(TEST_META, BaseController.prototype, 'myProp');
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
    it('inspects metadata of all properties of a sub class', () => {
        const meta = __1.MetadataInspector.getAllPropertyMetadata('test', SubController.prototype);
        testlab_1.expect(meta).to.eql({ myProp: { x: 1, y: 2 } });
    });
    it('inspects own metadata of all properties of a sub class', () => {
        const meta = __1.MetadataInspector.getAllPropertyMetadata('test', AnotherController.prototype, { ownMetadataOnly: true });
        testlab_1.expect(meta).to.be.undefined();
        const propertyMeta = __1.MetadataInspector.getPropertyMetadata('test', AnotherController.prototype, 'myProp', { ownMetadataOnly: true });
        testlab_1.expect(propertyMeta).to.be.undefined();
    });
});
describe('Inspector for static properties', () => {
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
    class AnotherController extends BaseController {
    }
    it('inspects metadata of all properties of a base class', () => {
        const meta = __1.MetadataInspector.getAllPropertyMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql({ myProp: { x: 1 } });
    });
    it('inspects metadata of a property of a base class', () => {
        const meta = __1.MetadataInspector.getPropertyMetadata('test', BaseController, 'myProp');
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
    it('inspects metadata of all properties of a sub class', () => {
        const meta = __1.MetadataInspector.getAllPropertyMetadata('test', SubController);
        testlab_1.expect(meta).to.eql({ myProp: { x: 1, y: 2 } });
    });
    it('inspects own metadata of all properties of a sub class', () => {
        const meta = __1.MetadataInspector.getAllPropertyMetadata('test', AnotherController, { ownMetadataOnly: true });
        testlab_1.expect(meta).to.be.undefined();
        const propertyMeta = __1.MetadataInspector.getPropertyMetadata('test', AnotherController, 'myProp', { ownMetadataOnly: true });
        testlab_1.expect(propertyMeta).to.be.undefined();
    });
});
describe('Inspector for instance methods', () => {
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
    class AnotherController extends BaseController {
    }
    const TEST_META = __1.MetadataAccessor.create('test');
    it('inspects metadata of all methods of a base class', () => {
        const meta = __1.MetadataInspector.getAllMethodMetadata('test', BaseController.prototype);
        testlab_1.expect(meta).to.eql({ myMethod: { x: 1 } });
    });
    it('inspects metadata of a method of a base class', () => {
        const meta = __1.MetadataInspector.getMethodMetadata(TEST_META, BaseController.prototype, 'myMethod');
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
    it('inspects metadata of all methods of a sub class', () => {
        const meta = __1.MetadataInspector.getAllMethodMetadata(TEST_META, SubController.prototype);
        testlab_1.expect(meta).to.eql({ myMethod: { x: 1, y: 2 } });
    });
    it('inspects own metadata of all methods of a sub class', () => {
        const meta = __1.MetadataInspector.getAllMethodMetadata('test', AnotherController.prototype, { ownMetadataOnly: true });
        testlab_1.expect(meta).to.be.undefined();
        const methodMeta = __1.MetadataInspector.getMethodMetadata('test', AnotherController.prototype, 'myMethod', { ownMetadataOnly: true });
        testlab_1.expect(methodMeta).to.be.undefined();
    });
});
describe('Inspector for static methods', () => {
    /**
     * Define `@methodDecorator(spec)`
     * @param spec
     */
    function methodDecorator(spec) {
        return __1.PropertyDecoratorFactory.createDecorator('test', spec);
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
    class AnotherController extends BaseController {
    }
    it('inspects metadata of all methods of a base class', () => {
        const meta = __1.MetadataInspector.getAllMethodMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql({ myMethod: { x: 1 } });
    });
    it('inspects metadata of a property of a base class', () => {
        const meta = __1.MetadataInspector.getMethodMetadata('test', BaseController, 'myMethod');
        testlab_1.expect(meta).to.eql({ x: 1 });
    });
    it('inspects metadata of all properties of a sub class', () => {
        const meta = __1.MetadataInspector.getAllMethodMetadata('test', SubController);
        testlab_1.expect(meta).to.eql({ myMethod: { x: 1, y: 2 } });
    });
    it('inspects own metadata of all methods of a sub class', () => {
        const meta = __1.MetadataInspector.getAllMethodMetadata('test', AnotherController, { ownMetadataOnly: true });
        testlab_1.expect(meta).to.be.undefined();
        const methodMeta = __1.MetadataInspector.getMethodMetadata('test', AnotherController, 'myMethod', { ownMetadataOnly: true });
        testlab_1.expect(methodMeta).to.be.undefined();
        const inherited = __1.MetadataInspector.getAllMethodMetadata('test', AnotherController);
        testlab_1.expect(inherited).to.eql({ myMethod: { x: 1 } });
    });
});
describe('Inspector for parameters of an instance method', () => {
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
    class AnotherController extends BaseController {
    }
    const TEST_META = __1.MetadataAccessor.create('test');
    it('inspects metadata of all parameters of a method of the base class', () => {
        const meta = __1.MetadataInspector.getAllParameterMetadata(TEST_META, BaseController.prototype, 'myMethod');
        testlab_1.expect(meta).to.eql([{ x: 1 }, undefined]);
    });
    it('inspects metadata of all parameters of a method of the sub class', () => {
        const meta = __1.MetadataInspector.getAllParameterMetadata('test', SubController.prototype, 'myMethod');
        testlab_1.expect(meta).to.eql([{ x: 1, y: 2 }, { x: 2 }]);
    });
    it('inspects metadata of a parameter of a method of the sub class', () => {
        const meta = __1.MetadataInspector.getParameterMetadata(TEST_META, SubController.prototype, 'myMethod', 0);
        testlab_1.expect(meta).to.eql({ x: 1, y: 2 });
    });
    it('inspects own metadata of all method parameters of a sub class', () => {
        const meta = __1.MetadataInspector.getAllParameterMetadata('test', AnotherController.prototype, 'myMethod', { ownMetadataOnly: true });
        testlab_1.expect(meta).to.be.undefined();
        const paramsMeta = __1.MetadataInspector.getParameterMetadata('test', AnotherController.prototype, 'myMethod', 0, { ownMetadataOnly: true });
        testlab_1.expect(paramsMeta).to.be.undefined();
        const inherited = __1.MetadataInspector.getAllMethodMetadata('test', AnotherController.prototype);
        testlab_1.expect(inherited).to.eql({ myMethod: [{ x: 1 }, undefined] });
    });
});
describe('Inspector for parameters of a static method', () => {
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
    class AnotherController extends BaseController {
    }
    it('inspects metadata of all parameters of a method of the base class', () => {
        const meta = __1.MetadataInspector.getAllParameterMetadata('test', BaseController, 'myMethod');
        testlab_1.expect(meta).to.eql([{ x: 1 }, undefined]);
    });
    it('inspects metadata of all parameters of a method of the sub class', () => {
        const meta = __1.MetadataInspector.getAllParameterMetadata('test', SubController, 'myMethod');
        testlab_1.expect(meta).to.eql([{ x: 1, y: 2 }, { x: 2 }]);
    });
    it('inspects metadata of a parameter of a method of the sub class', () => {
        const meta = __1.MetadataInspector.getParameterMetadata('test', SubController, 'myMethod', 0);
        testlab_1.expect(meta).to.eql({ x: 1, y: 2 });
    });
    it('inspects own metadata of all method parameters of a sub class', () => {
        const meta = __1.MetadataInspector.getAllParameterMetadata('test', AnotherController, 'myMethod', { ownMetadataOnly: true });
        testlab_1.expect(meta).to.be.undefined();
        const paramsMeta = __1.MetadataInspector.getParameterMetadata('test', AnotherController, 'myMethod', 0, { ownMetadataOnly: true });
        testlab_1.expect(paramsMeta).to.be.undefined();
        const inherited = __1.MetadataInspector.getAllMethodMetadata('test', AnotherController);
        testlab_1.expect(inherited).to.eql({ myMethod: [{ x: 1 }, undefined] });
    });
});
describe('Inspector for parameters of a constructor', () => {
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
    it('inspects metadata of all parameters of the constructor of the base class', () => {
        const meta = __1.MetadataInspector.getAllParameterMetadata('test', BaseController);
        testlab_1.expect(meta).to.eql([{ x: 1 }, undefined]);
    });
    it('inspects metadata of all parameters of the constructor of the sub class', () => {
        const meta = __1.MetadataInspector.getAllParameterMetadata('test', SubController, '');
        testlab_1.expect(meta).to.eql([{ x: 1, y: 2 }, { x: 2 }]);
    });
    it('inspects metadata of a parameter of the constructor of the sub class', () => {
        const meta = __1.MetadataInspector.getParameterMetadata('test', SubController, '', 0);
        testlab_1.expect(meta).to.eql({ x: 1, y: 2 });
    });
});
describe('Inspector for design time metadata', () => {
    function propertyDecorator(spec) {
        return __1.PropertyDecoratorFactory.createDecorator('test:properties', spec);
    }
    function methodDecorator(spec) {
        return __1.MethodDecoratorFactory.createDecorator('test:methods', spec);
    }
    function parameterDecorator(spec) {
        return __1.ParameterDecoratorFactory.createDecorator('test:parameters', spec);
    }
    class MyClass {
    }
    let MyController = class MyController {
        constructor(a, b) { }
        myMethod(x, y) {
            return false;
        }
        static myStaticMethod(x, y) {
            return false;
        }
    };
    MyController.myStaticProp = {};
    tslib_1.__decorate([
        propertyDecorator(),
        tslib_1.__metadata("design:type", String)
    ], MyController.prototype, "myProp", void 0);
    tslib_1.__decorate([
        propertyDecorator(),
        tslib_1.__metadata("design:type", MyClass)
    ], MyController.prototype, "myType", void 0);
    tslib_1.__decorate([
        propertyDecorator(),
        tslib_1.__metadata("design:type", Array)
    ], MyController.prototype, "myArray", void 0);
    tslib_1.__decorate([
        propertyDecorator(),
        tslib_1.__metadata("design:type", Object)
    ], MyController.prototype, "myUnionType", void 0);
    tslib_1.__decorate([
        methodDecorator(),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Number]),
        tslib_1.__metadata("design:returntype", Boolean)
    ], MyController.prototype, "myMethod", null);
    tslib_1.__decorate([
        propertyDecorator(),
        tslib_1.__metadata("design:type", Object)
    ], MyController, "myStaticProp", void 0);
    tslib_1.__decorate([
        methodDecorator(),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String, Number]),
        tslib_1.__metadata("design:returntype", Boolean)
    ], MyController, "myStaticMethod", null);
    MyController = tslib_1.__decorate([
        tslib_1.__param(0, parameterDecorator({ x: 1 })),
        tslib_1.__metadata("design:paramtypes", [String, Number])
    ], MyController);
    it('inspects design time type for properties with simple type', () => {
        const meta = __1.MetadataInspector.getDesignTypeForProperty(MyController.prototype, 'myProp');
        testlab_1.expect(meta).to.eql(String);
    });
    it('inspects design time type for properties with array type', () => {
        const meta = __1.MetadataInspector.getDesignTypeForProperty(MyController.prototype, 'myArray');
        // Unfortunately, we cannot access `string[]` as the item type of an array
        // is not emitted by TypeScript
        testlab_1.expect(meta).to.eql(Array);
    });
    it('inspects design time type for properties with class type', () => {
        const meta = __1.MetadataInspector.getDesignTypeForProperty(MyController.prototype, 'myType');
        testlab_1.expect(meta).to.eql(MyClass);
    });
    it('inspects design time type for properties with union type', () => {
        const meta = __1.MetadataInspector.getDesignTypeForProperty(MyController.prototype, 'myUnionType');
        // Union type is recorded as Object
        testlab_1.expect(meta).to.eql(Object);
    });
    it('inspects design time type for static properties', () => {
        const meta = __1.MetadataInspector.getDesignTypeForProperty(MyController, 'myStaticProp');
        testlab_1.expect(meta).to.eql(Object);
    });
    it('returns no property design type when decorator metadata is not available', () => {
        // It's important to bypass TypeScript compiler that would add design-time
        // metadata and construct the class directly from JavaScript.
        const classFactory = new Function('propertyDecorator', `
        class MyModel {};
        propertyDecorator()(MyModel, 'id', void 0);
        return MyModel;
    `);
        const MyModel = classFactory(propertyDecorator);
        const meta = __1.MetadataInspector.getDesignTypeForProperty(MyModel, 'id');
        testlab_1.expect(meta).to.equal(undefined);
    });
    it('returns `undefined` design type for property type `null`', () => {
        class MyModel {
        }
        const meta = __1.MetadataInspector.getDesignTypeForProperty(MyModel, 'prop');
        testlab_1.expect(meta).to.equal(undefined);
    });
    it('returns `undefined` design type for property type `undefined`', () => {
        class MyModel {
        }
        const meta = __1.MetadataInspector.getDesignTypeForProperty(MyModel, 'prop');
        testlab_1.expect(meta).to.equal(undefined);
    });
    it('returns `undefined` design type for property type union', () => {
        class MyModel {
        }
        const meta = __1.MetadataInspector.getDesignTypeForProperty(MyModel, 'prop');
        testlab_1.expect(meta).to.equal(undefined);
    });
    it('returns `undefined` design type for property type array', () => {
        class MyModel {
        }
        const meta = __1.MetadataInspector.getDesignTypeForProperty(MyModel, 'prop');
        testlab_1.expect(meta).to.equal(undefined);
    });
    it('inspects design time type for the constructor', () => {
        const meta = __1.MetadataInspector.getDesignTypeForMethod(MyController, '');
        testlab_1.expect(meta).to.eql({
            type: undefined,
            returnType: undefined,
            parameterTypes: [String, Number],
        });
    });
    it('inspects design time type for instance methods', () => {
        const meta = __1.MetadataInspector.getDesignTypeForMethod(MyController.prototype, 'myMethod');
        testlab_1.expect(meta).to.eql({
            type: Function,
            returnType: Boolean,
            parameterTypes: [String, Number],
        });
    });
    it('inspects design time type for static methods', () => {
        const meta = __1.MetadataInspector.getDesignTypeForMethod(MyController, 'myStaticMethod');
        testlab_1.expect(meta).to.eql({
            type: Function,
            returnType: Boolean,
            parameterTypes: [String, Number],
        });
    });
    it('returns no method design type when decorator metadata is not available', () => {
        // It's important to bypass TypeScript compiler that would add design-time
        // metadata and construct the class directly from JavaScript.
        const classFactory = new Function('methodDecorator', `
        class TestController {
          static greet() {}
        };
        methodDecorator()(TestController, 'greet', null)
        return TestController;
    `);
        const TestController = classFactory(methodDecorator);
        const meta = __1.MetadataInspector.getDesignTypeForMethod(TestController, 'greet');
        testlab_1.expect(meta).to.equal(undefined);
    });
});
//# sourceMappingURL=inspector.unit.js.map