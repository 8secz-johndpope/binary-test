"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const test_helpers_1 = require("./test-helpers");
describe('Middleware interceptor', () => {
    let helper;
    context('helpers', () => {
        let spyConfig;
        before(() => {
            spyConfig = {
                action: 'log',
            };
            helper = new test_helpers_1.TestHelper();
        });
        before(givenTestApp);
        after(() => helper === null || helper === void 0 ? void 0 : helper.stop());
        it('wraps a middleware handler to interceptor', async () => {
            const fn = test_helpers_1.spy(spyConfig);
            const interceptor = __1.toInterceptor(fn);
            await testLocalSpyLog(interceptor);
        });
        it('wraps multiple middleware handlers to interceptor', async () => {
            const log = test_helpers_1.spy({ action: 'log' });
            const mock = test_helpers_1.spy({ action: 'mock' });
            // Chain two Express middleware into one interceptor
            const interceptor = __1.toInterceptor(log, mock);
            helper.bindController(interceptor);
            await helper.client
                .post('/hello')
                .send('"World"')
                .set('content-type', 'application/json')
                .expect(200, 'Hello, Spy')
                .expect('x-spy-log', 'POST /hello')
                .expect('x-spy-mock', 'POST /hello');
        });
        it('wraps a middleware factory to interceptor', async () => {
            const interceptor = __1.createInterceptor(test_helpers_1.spy, spyConfig);
            await testLocalSpyLog(interceptor);
        });
    });
    context('defineInterceptorProvider', () => {
        it('defines a middleware interceptor provider class by factory', () => {
            const cls = __1.defineInterceptorProvider(test_helpers_1.spy);
            testlab_1.expect(cls.name).to.eql('spyMiddlewareFactory');
            assertProviderClass(cls);
        });
        it('defines a middleware interceptor provider class with name', () => {
            const cls = __1.defineInterceptorProvider(test_helpers_1.spy, undefined, {
                providerClassName: 'SpyMiddlewareInterceptorProvider',
            });
            testlab_1.expect(cls.name).to.eql('SpyMiddlewareInterceptorProvider');
            assertProviderClass(cls);
        });
        function assertProviderClass(cls) {
            const ctx = new core_1.Context();
            const binding = core_1.createBindingFromClass(cls);
            ctx.add(binding);
            const corsFn = ctx.getSync(binding.key);
            testlab_1.expect(corsFn).to.be.a.Function();
        }
    });
    context('defineInterceptorProvider with watch', () => {
        let spyConfig;
        before(() => {
            spyConfig = {
                action: 'log',
            };
            helper = new test_helpers_1.TestHelper();
        });
        before(givenTestApp);
        after(() => helper === null || helper === void 0 ? void 0 : helper.stop());
        it('reloads config changes', async () => {
            const providerClass = __1.defineInterceptorProvider(test_helpers_1.spy, spyConfig, {
                injectConfiguration: 'watch',
            });
            const binding = __1.createMiddlewareInterceptorBinding(providerClass);
            helper.app.add(binding);
            await testLocalSpyLog(binding.key);
            helper.app.configure(binding.key).to({ action: 'mock' });
            await testLocalSpyMock(binding.key);
        });
    });
    function runTests(action, testFn) {
        describe(`registerMiddleware - ${action}`, () => {
            const spyConfig = { action };
            beforeEach(givenTestApp);
            beforeEach(() => helper.bindController());
            afterEach(() => helper === null || helper === void 0 ? void 0 : helper.stop());
            it('registers a middleware interceptor provider class by factory', () => {
                const binding = __1.registerExpressMiddlewareInterceptor(helper.app, test_helpers_1.spy, spyConfig, {
                    global: true,
                });
                return testFn(binding);
            });
            it('registers a middleware interceptor as handler function', () => {
                const binding = __1.registerExpressMiddlewareInterceptor(helper.app, test_helpers_1.spy, spyConfig, {
                    global: true,
                    injectConfiguration: false,
                    key: 'globalInterceptors.middleware.spy',
                });
                testlab_1.expect(binding.key).to.eql('globalInterceptors.middleware.spy');
                return testFn(binding);
            });
            it('registers a middleware interceptor as handler function with name', () => {
                const namedSpyFactory = cfg => test_helpers_1.spy(cfg);
                const binding = __1.registerExpressMiddlewareInterceptor(helper.app, namedSpyFactory, spyConfig, {
                    global: true,
                    injectConfiguration: false,
                });
                testlab_1.expect(binding.key).to.eql('globalInterceptors.middleware.namedSpyFactory');
                return testFn(binding);
            });
            it('registers a middleware interceptor as handler function without key', () => {
                const binding = __1.registerExpressMiddlewareInterceptor(helper.app, test_helpers_1.spy, spyConfig, {
                    global: true,
                    injectConfiguration: false,
                });
                testlab_1.expect(binding.key).to.match(/^globalInterceptors\.middleware\./);
                return testFn(binding);
            });
            it('registers a middleware interceptor provider class', () => {
                let SpyInterceptorProvider = class SpyInterceptorProvider extends __1.ExpressMiddlewareInterceptorProvider {
                    constructor(configView) {
                        super(test_helpers_1.spy, configView);
                    }
                };
                SpyInterceptorProvider = tslib_1.__decorate([
                    tslib_1.__param(0, core_1.config.view()),
                    tslib_1.__metadata("design:paramtypes", [core_1.ContextView])
                ], SpyInterceptorProvider);
                const binding = __1.createMiddlewareInterceptorBinding(SpyInterceptorProvider);
                testlab_1.expect(binding.key).to.eql('globalInterceptors.middleware.SpyInterceptorProvider');
                helper.app.add(binding);
                return testFn(binding);
            });
        });
    }
    runTests('log', binding => helper.testSpyLog(binding));
    runTests('mock', binding => helper.testSpyMock(binding));
    runTests('reject', binding => helper.testSpyReject(binding));
    function givenTestApp() {
        helper = new test_helpers_1.TestHelper();
        return helper.start();
    }
    async function testLocalSpyLog(interceptor) {
        helper.bindController(interceptor);
        await helper.assertSpyLog();
    }
    async function testLocalSpyMock(interceptor) {
        helper.bindController(interceptor);
        await helper.assertSpyMock();
    }
});
//# sourceMappingURL=middleware-interceptor.acceptance.js.map