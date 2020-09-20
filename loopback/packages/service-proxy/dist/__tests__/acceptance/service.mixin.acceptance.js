"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/service-proxy
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('ServiceMixin - service providers and proxies', () => {
    class AppWithServiceMixin extends __1.ServiceMixin(core_1.Application) {
    }
    class DummyGeocoder {
        constructor(apiKey) {
            this.apiKey = apiKey;
        }
        geocode(address) {
            return Promise.resolve({ lat: 0, lng: 0 });
        }
    }
    let GeocoderServiceProvider = class GeocoderServiceProvider {
        constructor(apiKey) {
            this.apiKey = apiKey;
        }
        value() {
            // Returns different instances so that we can verify the TRANSIENT
            // binding scope, which is now the default for service proxies
            return Promise.resolve(new DummyGeocoder(this.apiKey));
        }
    };
    GeocoderServiceProvider = tslib_1.__decorate([
        tslib_1.__param(0, core_1.inject('apiKey')),
        tslib_1.__metadata("design:paramtypes", [String])
    ], GeocoderServiceProvider);
    it('binds a service provider in TRANSIENT scope by default', async () => {
        const myApp = new AppWithServiceMixin();
        myApp.serviceProvider(GeocoderServiceProvider);
        const myReq1 = new core_1.Context(myApp, 'request1');
        myReq1.bind('apiKey').to('123');
        const service1 = await myReq1.get('services.GeocoderService');
        testlab_1.expect(service1.apiKey).to.eql('123');
        const myReq2 = new core_1.Context(myApp, 'request2');
        myReq2.bind('apiKey').to('456');
        const service2 = await myReq2.get('services.GeocoderService');
        testlab_1.expect(service2.apiKey).to.eql('456');
    });
});
//# sourceMappingURL=service.mixin.acceptance.js.map