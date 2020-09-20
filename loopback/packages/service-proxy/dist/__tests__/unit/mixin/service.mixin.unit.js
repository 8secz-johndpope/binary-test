"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/service-proxy
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../../");
describe('ServiceMixin', () => {
    it('mixed class has .serviceProvider()', () => {
        const myApp = new AppWithServiceMixin();
        testlab_1.expect(typeof myApp.serviceProvider).to.be.eql('function');
    });
    it('binds service from app.serviceProvider()', async () => {
        const myApp = new AppWithServiceMixin();
        expectGeocoderToNotBeBound(myApp);
        myApp.serviceProvider(GeocoderServiceProvider);
        await expectGeocoderToBeBound(myApp);
    });
    it('binds service from app.serviceProvider() with options', async () => {
        const myApp = new AppWithServiceMixin();
        const binding = myApp.serviceProvider(GeocoderServiceProvider, {
            name: 'geo',
            namespace: 'my-services',
            defaultScope: core_1.BindingScope.SINGLETON,
        });
        testlab_1.expect(binding.key).to.eql('my-services.geo');
        testlab_1.expect(binding.scope).to.eql(core_1.BindingScope.SINGLETON);
    });
    it('binds singleton service from app.serviceProvider()', async () => {
        let SingletonGeocoderServiceProvider = class SingletonGeocoderServiceProvider extends GeocoderServiceProvider {
        };
        SingletonGeocoderServiceProvider = tslib_1.__decorate([
            core_1.injectable({ scope: core_1.BindingScope.SINGLETON })
        ], SingletonGeocoderServiceProvider);
        const myApp = new AppWithServiceMixin();
        const binding = myApp.serviceProvider(SingletonGeocoderServiceProvider);
        testlab_1.expect(binding.scope).to.equal(core_1.BindingScope.SINGLETON);
    });
    it('binds a component without services', () => {
        class EmptyTestComponent {
        }
        const myApp = new AppWithServiceMixin();
        myApp.component(EmptyTestComponent);
        expectComponentToBeBound(myApp, EmptyTestComponent);
    });
    it('binds a component with a service provider from .component()', async () => {
        const myApp = new AppWithServiceMixin();
        const boundComponentsBefore = myApp.find('components.*').map(b => b.key);
        testlab_1.expect(boundComponentsBefore).to.be.empty();
        expectGeocoderToNotBeBound(myApp);
        myApp.component(GeocoderComponent);
        expectComponentToBeBound(myApp, GeocoderComponent);
        await expectGeocoderToBeBound(myApp);
    });
    class AppWithServiceMixin extends __1.ServiceMixin(core_1.Application) {
    }
    class DummyGeocoder {
        geocode(address) {
            return Promise.resolve({ lat: 0, lng: 0 });
        }
    }
    class GeocoderServiceProvider {
        value() {
            // Returns different instances so that we can verify the TRANSIENT
            // binding scope, which is now the default for service proxies
            return Promise.resolve(new DummyGeocoder());
        }
    }
    class GeocoderComponent {
        constructor() {
            this.serviceProviders = [GeocoderServiceProvider];
        }
    }
    async function expectGeocoderToBeBound(myApp) {
        const boundServices = myApp.find('services.*').map(b => b.key);
        testlab_1.expect(boundServices).to.containEql('services.GeocoderService');
        const binding = myApp.getBinding('services.GeocoderService');
        testlab_1.expect(binding.scope).to.equal(core_1.BindingScope.TRANSIENT);
        const serviceInstance1 = await myApp.get('services.GeocoderService');
        testlab_1.expect(serviceInstance1).to.be.instanceOf(DummyGeocoder);
        const serviceInstance2 = await myApp.get('services.GeocoderService');
        testlab_1.expect(serviceInstance2).to.not.be.equal(serviceInstance1);
    }
    function expectGeocoderToNotBeBound(myApp) {
        const boundServices = myApp.find('services.*').map(b => b.key);
        testlab_1.expect(boundServices).to.be.empty();
    }
    function expectComponentToBeBound(myApp, component) {
        const boundComponents = myApp.find('components.*').map(b => b.key);
        testlab_1.expect(boundComponents).to.containEql(`components.${component.name}`);
        const componentInstance = myApp.getSync(`components.${component.name}`);
        testlab_1.expect(componentInstance).to.be.instanceOf(component);
    }
});
//# sourceMappingURL=service.mixin.unit.js.map