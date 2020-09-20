"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const __1 = require("../../");
const spy_middleware_1 = tslib_1.__importDefault(require("../fixtures/spy.middleware"));
const test_helpers_1 = require("./test-helpers");
describe('Express middleware registry', () => {
    let helper;
    let server;
    beforeEach(givenTestApp);
    afterEach(() => helper === null || helper === void 0 ? void 0 : helper.stop());
    it('invokes Express middleware', async () => {
        server.middleware(async (ctx, next) => {
            const finished = await __1.invokeExpressMiddleware(ctx, test_helpers_1.spy({ action: 'log' }));
            if (finished)
                return;
            return next();
        }, { key: 'middleware.listOfExpressHandlers' });
        await helper.assertSpyLog();
    });
    it('invokes middleware', async () => {
        const logMiddleware = __1.toMiddleware(spy_middleware_1.default({ action: 'log' }));
        const mockMiddleware = __1.toMiddleware(spy_middleware_1.default({ action: 'mock' }));
        server.middleware(logMiddleware, { chain: 'log' });
        server.middleware(mockMiddleware, { chain: 'mock' });
        server.middleware(async (ctx, next) => {
            __1.invokeMiddleware(ctx, {
                chain: 'log',
                next: () => {
                    return __1.invokeMiddleware(ctx, { chain: 'mock', next });
                },
            });
        });
        await helper.client
            .post('/hello')
            .send('"World"')
            .set('content-type', 'application/json')
            .expect(200, 'Hello, Spy')
            .expect('x-spy-log', 'POST /hello')
            .expect('x-spy-mock', 'POST /hello');
    });
    it('invokes middleware using the provider', async () => {
        const logMiddleware = __1.toMiddleware(spy_middleware_1.default({ action: 'log' }));
        const mockMiddleware = __1.toMiddleware(spy_middleware_1.default({ action: 'mock' }));
        server.middleware(logMiddleware, { chain: 'log' });
        server.middleware(mockMiddleware, { chain: 'mock' });
        const binding = core_1.createBindingFromClass(__1.InvokeMiddlewareProvider);
        server.add(binding);
        const invoke = await server.get(binding.key);
        server.middleware(async (ctx, next) => {
            return invoke(ctx, {
                chain: 'log',
                next: () => {
                    return invoke(ctx, { chain: 'mock', next });
                },
            });
        });
        await helper.client
            .post('/hello')
            .send('"World"')
            .set('content-type', 'application/json')
            .expect(200, 'Hello, Spy')
            .expect('x-spy-log', 'POST /hello')
            .expect('x-spy-mock', 'POST /hello');
    });
    async function givenTestApp() {
        helper = new test_helpers_1.TestHelper();
        helper.bindController();
        await helper.start();
        server = helper.app.expressServer;
    }
});
//# sourceMappingURL=invoke-middleware.acceptance.js.map