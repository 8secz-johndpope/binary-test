"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const expect_1 = require("../../expect");
const http_server_config_1 = require("../../http-server-config");
describe('givenHttpServerConfig', () => {
    it('sets port to 0 by default', () => {
        const config = http_server_config_1.givenHttpServerConfig();
        expect_1.expect(config.port).to.equal(0);
    });
    it('sets host to "127.0.0.1" by default', () => {
        const config = http_server_config_1.givenHttpServerConfig();
        expect_1.expect(config.host).to.equal('127.0.0.1');
    });
    it('honors custom port', () => {
        const config = http_server_config_1.givenHttpServerConfig({ port: 3000 });
        expect_1.expect(config.port).to.equal(3000);
    });
    it('honors custom host', () => {
        const config = http_server_config_1.givenHttpServerConfig({ host: '::1' });
        expect_1.expect(config.host).to.equal('::1');
    });
    it('ignores custom port set to undefined', () => {
        // The type parameter <HttpOptions> is needed to avoid
        // `error TS2339: Property 'port' does not exist on type 'never'.` reported
        // by TypeScript 3.9.x. Otherwise, the inferred type of first argument
        // is `{port: undefined}`.
        const config = http_server_config_1.givenHttpServerConfig({ port: undefined });
        expect_1.expect(config.port).to.equal(0);
    });
    it('ignores custom host set to undefined', () => {
        // The type parameter <HttpOptions> is needed to avoid
        // `error TS2339: Property 'host' does not exist on type 'never'.` reported
        // by TypeScript 3.9.x. Otherwise, the inferred type of first argument
        // is `{host: undefined}`.
        const config = http_server_config_1.givenHttpServerConfig({ host: undefined });
        expect_1.expect(config.host).to.equal('127.0.0.1');
    });
});
//# sourceMappingURL=http-server-config.test.js.map