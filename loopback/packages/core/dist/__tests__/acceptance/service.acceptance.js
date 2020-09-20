"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const service_1 = require("../../service");
describe('@service', () => {
    let ctx;
    let myServiceBinding;
    beforeEach(givenContextWithMyService);
    it('injects a service instance using constructor with serviceInterface argument', async () => {
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service(MyService)),
            tslib_1.__metadata("design:paramtypes", [MyService])
        ], MyController);
        ctx.bind('controllers.MyController').toClass(MyController);
        const controller = await ctx.get('controllers.MyController');
        testlab_1.expect(controller.myService).to.be.instanceOf(MyService);
    });
    it('injects a service instance using property', async () => {
        class MyController {
        }
        tslib_1.__decorate([
            __1.service(MyService),
            tslib_1.__metadata("design:type", MyService)
        ], MyController.prototype, "myService", void 0);
        ctx.bind('controllers.MyController').toClass(MyController);
        const controller = await ctx.get('controllers.MyController');
        testlab_1.expect(controller.myService).to.be.instanceOf(MyService);
    });
    it('injects a service instance without serviceInterface argument', async () => {
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service()),
            tslib_1.__metadata("design:paramtypes", [MyService])
        ], MyController);
        ctx.bind('controllers.MyController').toClass(MyController);
        const controller = await ctx.get('controllers.MyController');
        testlab_1.expect(controller.myService).to.be.instanceOf(MyService);
    });
    it('injects a service instance matching a sub class', async () => {
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service(MyService)),
            tslib_1.__metadata("design:paramtypes", [MyService])
        ], MyController);
        ctx.unbind('services.MyService');
        ctx
            .bind('services.MySubService')
            .toClass(MySubService)
            .apply(service_1.asService(MyService));
        ctx.bind('controllers.MyController').toClass(MyController);
        const controller = await ctx.get('controllers.MyController');
        testlab_1.expect(controller.myService).to.be.instanceOf(MySubService);
    });
    it('allows optional flag', async () => {
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service(MyService, { optional: true })),
            tslib_1.__metadata("design:paramtypes", [MyService])
        ], MyController);
        ctx.unbind('services.MyService');
        ctx.bind('controllers.MyController').toClass(MyController);
        const controller = await ctx.get('controllers.MyController');
        testlab_1.expect(controller.myService).to.be.undefined();
    });
    it('allows serviceInterface as a string', async () => {
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service('MyService')),
            tslib_1.__metadata("design:paramtypes", [MyService])
        ], MyController);
        myServiceBinding.tag({ [__1.CoreTags.SERVICE_INTERFACE]: 'MyService' });
        ctx.bind('controllers.MyController').toClass(MyController);
        const controller = await ctx.get('controllers.MyController');
        testlab_1.expect(controller.myService).to.be.instanceOf(MyService);
    });
    it('reports error if serviceInterface not found - string', async () => {
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service('MyService')),
            tslib_1.__metadata("design:paramtypes", [MyService])
        ], MyController);
        ctx.bind('controllers.MyController').toClass(MyController);
        return testlab_1.expect(ctx.get('controllers.MyController')).to.be.rejectedWith(/No binding found for MyService/);
    });
    it('allows serviceInterface as a symbol', async () => {
        const MyServiceInterface = Symbol('MyService');
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service(MyServiceInterface)),
            tslib_1.__metadata("design:paramtypes", [MyService])
        ], MyController);
        myServiceBinding.tag({ [__1.CoreTags.SERVICE_INTERFACE]: MyServiceInterface });
        ctx.bind('controllers.MyController').toClass(MyController);
        const controller = await ctx.get('controllers.MyController');
        testlab_1.expect(controller.myService).to.be.instanceOf(MyService);
    });
    it('reports error if serviceInterface not found - symbol', async () => {
        const MyServiceInterface = Symbol('MyService');
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service(MyServiceInterface)),
            tslib_1.__metadata("design:paramtypes", [MyService])
        ], MyController);
        ctx.bind('controllers.MyController').toClass(MyController);
        return testlab_1.expect(ctx.get('controllers.MyController')).to.be.rejectedWith(/No binding found for Symbol\(MyService\)/);
    });
    it('throws error if no binding is found', async () => {
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service(MyService)),
            tslib_1.__metadata("design:paramtypes", [MyService])
        ], MyController);
        ctx.unbind('services.MyService');
        ctx.bind('controllers.MyController').toClass(MyController);
        await testlab_1.expect(ctx.get('controllers.MyController')).to.be.rejectedWith(/No binding found for MyService. Make sure a service binding is created in context .+ with serviceInterface \(MyService\)\./);
    });
    it('throws error when more than one services are bound', async () => {
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service()),
            tslib_1.__metadata("design:paramtypes", [MyService])
        ], MyController);
        ctx.bind('services.MyService2').toClass(MyService);
        ctx.bind('controllers.MyController').toClass(MyController);
        await testlab_1.expect(ctx.get('controllers.MyController')).to.be.rejectedWith(/More than one bindings found for MyService/);
    });
    it('throws error if the parameter type cannot be inferred', async () => {
        let MyController = class MyController {
            constructor(myService) {
                this.myService = myService;
            }
        };
        MyController = tslib_1.__decorate([
            tslib_1.__param(0, __1.service()),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], MyController);
        ctx.bind('controllers.MyController').toClass(MyController);
        await testlab_1.expect(ctx.get('controllers.MyController')).to.be.rejectedWith(/Service class cannot be inferred from design type. Use @service\(ServiceClass\)/);
    });
    it('throws error if the property type cannot be inferred', async () => {
        class MyController {
        }
        tslib_1.__decorate([
            __1.service(),
            tslib_1.__metadata("design:type", Array)
        ], MyController.prototype, "myService", void 0);
        ctx.bind('controllers.MyController').toClass(MyController);
        await testlab_1.expect(ctx.get('controllers.MyController')).to.be.rejectedWith(/Service class cannot be inferred from design type/);
    });
    class MyService {
    }
    class MySubService extends MyService {
    }
    function givenContextWithMyService() {
        ctx = new context_1.Context();
        myServiceBinding = ctx.bind('services.MyService').toClass(MyService);
    }
});
//# sourceMappingURL=service.acceptance.js.map