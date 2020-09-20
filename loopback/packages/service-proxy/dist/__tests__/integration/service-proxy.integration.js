"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/service-proxy
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const mock_service_connector_1 = require("../mock-service.connector");
describe('service-proxy', () => {
    let ds;
    before(function () {
        ds = new __1.juggler.DataSource({
            name: 'mock',
            connector: mock_service_connector_1.MockConnector,
        });
    });
    it('invokes geocode()', async () => {
        const loc = {
            street: '107 S B St',
            city: 'San Mateo',
            zipcode: '94401',
        };
        const geoService = await __1.getService(ds);
        const result = await geoService.geocode(loc.street, loc.city, loc.zipcode);
        // { lat: 37.5669986, lng: -122.3237495 }
        testlab_1.expect(result.lat).approximately(37.5669986, 0.5);
        testlab_1.expect(result.lng).approximately(-122.3237495, 0.5);
    });
    it('invokes geocode() as GenericService', async () => {
        const loc = {
            street: '107 S B St',
            city: 'San Mateo',
            zipcode: '94401',
        };
        const geoService = await __1.getService(ds);
        const result = await geoService.geocode(loc.street, loc.city, loc.zipcode);
        // { lat: 37.5669986, lng: -122.3237495 }
        testlab_1.expect(result.lat).approximately(37.5669986, 0.5);
        testlab_1.expect(result.lng).approximately(-122.3237495, 0.5);
    });
});
//# sourceMappingURL=service-proxy.integration.js.map