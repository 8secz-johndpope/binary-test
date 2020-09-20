"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/service-proxy
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockConnector = void 0;
/**
 * A mockup service connector
 */
class MockConnector {
    static initialize(dataSource, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb) {
        const connector = new MockConnector();
        connector.dataSource = dataSource;
        dataSource.connector = connector;
        connector.connect(cb);
    }
    connect(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cb) {
        this.connected = true;
        this.dataSource.connected = true;
        process.nextTick(() => {
            cb(null, true);
        });
    }
    disconnect(cb) {
        this.connected = false;
        this.dataSource.connected = false;
        process.nextTick(() => {
            cb(null);
        });
    }
    ping(cb) {
        process.nextTick(() => {
            cb(null, true);
        });
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get DataAccessObject() {
        if (!this.connected) {
            // this simulates call to the connector.DataAccessObject when the
            // connector has not been connected and its DAO methods has not been
            // fully built
            return {};
        }
        return {
            geocode: async function (street, city, zipcode) {
                return {
                    lat: 37.5669986,
                    lng: -122.3237495,
                };
            },
            // loopback-datasource-juggler expects a prototype
            // https://github.com/strongloop/loopback-datasource-juggler/blob/v3.18.1/lib/datasource.js#L168
            prototype: {},
        };
    }
}
exports.MockConnector = MockConnector;
//# sourceMappingURL=mock-service.connector.js.map