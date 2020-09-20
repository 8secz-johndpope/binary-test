"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/service-proxy
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const core_1 = require("@loopback/core");
const __1 = require("../../../");
const __2 = require("../../../");
const mock_service_connector_1 = require("../../mock-service.connector");
let MyController = class MyController {
    constructor(geoService) {
        this.geoService = geoService;
    }
};
MyController = tslib_1.__decorate([
    tslib_1.__param(0, __1.serviceProxy('googleMap')),
    tslib_1.__metadata("design:paramtypes", [Object])
], MyController);
describe('serviceProxy decorator', () => {
    let ctx;
    let ds;
    before(function () {
        ds = new __2.juggler.DataSource({
            name: 'db',
            connector: mock_service_connector_1.MockConnector,
        });
        ctx = new core_1.Context();
        ctx.bind('datasources.googleMap').to(ds);
        ctx.bind('controllers.MyController').toClass(MyController);
    });
    it('supports @serviceProxy(dataSourceName)', async () => {
        const myController = await ctx.get('controllers.MyController');
        testlab_1.expect(myController.geoService).to.be.a.Function();
    });
    it('supports @serviceProxy(dataSource)', async () => {
        let MyControllerWithService = class MyControllerWithService {
            constructor(geoService) {
                this.geoService = geoService;
            }
        };
        MyControllerWithService = tslib_1.__decorate([
            tslib_1.__param(0, __1.serviceProxy(ds)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], MyControllerWithService);
        ctx
            .bind('controllers.MyControllerWithService')
            .toClass(MyControllerWithService);
        const myController = await ctx.get('controllers.MyControllerWithService');
        testlab_1.expect(myController.geoService).to.be.a.Function();
    });
    it('throws an error if dataSource is not present in @serviceProxy', () => {
        let MyControllerWithService = class MyControllerWithService {
            constructor(geoService) {
                this.geoService = geoService;
            }
        };
        MyControllerWithService = tslib_1.__decorate([
            tslib_1.__param(0, __1.serviceProxy('')),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], MyControllerWithService);
        ctx
            .bind('controllers.MyControllerWithService')
            .toClass(MyControllerWithService);
        const controller = ctx.get('controllers.MyControllerWithService');
        return testlab_1.expect(controller).to.be.rejectedWith('@serviceProxy must provide a name or an instance of DataSource');
    });
});
//# sourceMappingURL=service-proxy.decorator.unit.js.map