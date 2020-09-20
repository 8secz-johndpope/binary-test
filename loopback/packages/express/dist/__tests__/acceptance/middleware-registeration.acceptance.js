"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const express_1 = require("express");
const test_helpers_1 = require("./test-helpers");
describe('Express middleware registry', () => {
    let helper;
    let server;
    let client;
    beforeEach(givenTestApp);
    afterEach(() => helper === null || helper === void 0 ? void 0 : helper.stop());
    function runTests(action, testFn) {
        describe(`app.expressMiddleware - ${action}`, () => {
            const spyConfig = { action };
            it('registers a middleware interceptor provider class by factory', () => {
                const binding = server.expressMiddleware(test_helpers_1.spy, spyConfig);
                return testFn(binding);
            });
            it('registers a middleware interceptor as handler function', () => {
                const binding = server.expressMiddleware(test_helpers_1.spy, spyConfig, {
                    injectConfiguration: false,
                    key: 'interceptors.middleware.spy',
                });
                testlab_1.expect(binding.key).to.eql('interceptors.middleware.spy');
                return testFn(binding);
            });
            it('registers a middleware interceptor as handler function without a key', () => {
                const binding = server.expressMiddleware(test_helpers_1.spy, spyConfig, {
                    injectConfiguration: false,
                });
                testlab_1.expect(binding.key).to.match(/^middleware\./);
                return testFn(binding);
            });
            it('registers a middleware with router', async () => {
                const router = express_1.Router();
                router.post('/greet', test_helpers_1.spy(spyConfig));
                const binding = server.expressMiddleware('middleware.express.spy', router);
                await testFn(binding, '/greet');
                const res = await client
                    .post('/hello')
                    .send('"World"')
                    .set('content-type', 'application/json')
                    .expect(200, 'Hello, World');
                ['x-spy-log', 'x-spy-mock', 'x-spy-reject'].forEach(h => testlab_1.expect(res.get(h)).to.be.undefined());
            });
        });
    }
    runTests('log', (binding, path) => helper.testSpyLog(binding, path));
    runTests('mock', (binding, path) => helper.testSpyMock(binding, path));
    runTests('reject', (binding, path) => helper.testSpyReject(binding, path));
    describe('LoopBack middleware registry', () => {
        const spyMiddleware = async (middlewareCtx, next) => {
            const { request, response } = middlewareCtx;
            response.set('x-spy-log-req', `${request.method} ${request.path}`);
            await next();
            response.set('x-spy-log-res', `${request.method} ${request.path}`);
        };
        it('registers a LoopBack middleware handler', async () => {
            server.middleware(spyMiddleware, {
                key: 'middleware.spy',
            });
            await testSpyLog();
        });
        it('reports error for circular dependencies', async () => {
            server.middleware(spyMiddleware, {
                key: 'middleware.spy',
                downstreamGroups: ['x'],
                upstreamGroups: ['x'],
            });
            const res = await client
                .post('/hello')
                .send('"World"')
                .set('content-type', 'application/json')
                .expect(500);
            testlab_1.expect(res.text).to.match(/Error\: Cyclic dependency/);
        });
        it('registers a LoopBack middleware provider', async () => {
            class SpyMiddlewareProvider {
                value() {
                    return spyMiddleware;
                }
            }
            server.middleware(SpyMiddlewareProvider, {
                key: 'middleware.spy',
            });
            await testSpyLog();
        });
        it('registers a LoopBack middleware provider with config injection', async () => {
            class SpyMiddlewareProviderWithConfig {
                value() {
                    return async ({ request, response }, next) => {
                        response.set(`${this.options.headerName}-req`, `${request.method} ${request.path}`);
                        await next();
                        response.set(`${this.options.headerName}-res`, `${request.method} ${request.path}`);
                    };
                }
            }
            tslib_1.__decorate([
                core_1.config(),
                tslib_1.__metadata("design:type", Object)
            ], SpyMiddlewareProviderWithConfig.prototype, "options", void 0);
            const binding = server.middleware(SpyMiddlewareProviderWithConfig, {
                key: 'middleware.spy',
            });
            server.configure(binding.key).to({ headerName: 'x-spy' });
            await client
                .post('/hello')
                .send('"World"')
                .set('content-type', 'application/json')
                .expect(200, 'Hello, World')
                .expect('x-spy-req', 'POST /hello')
                .expect('x-spy-res', 'POST /hello');
        });
        async function testSpyLog() {
            await client
                .post('/hello')
                .send('"World"')
                .set('content-type', 'application/json')
                .expect(200, 'Hello, World')
                .expect('x-spy-log-req', 'POST /hello')
                .expect('x-spy-log-res', 'POST /hello');
        }
    });
    async function givenTestApp() {
        helper = new test_helpers_1.TestHelper();
        helper.bindController();
        await helper.start();
        server = helper.app.expressServer;
        client = helper.client;
    }
});
//# sourceMappingURL=middleware-registeration.acceptance.js.map