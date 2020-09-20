"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/express
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../../");
const test_helpers_1 = require("./test-helpers");
describe('Middleware request interceptor', () => {
    let helper;
    function runTests(action, testFn) {
        describe(`registerMiddleware - ${action}`, () => {
            const spyConfig = { action };
            beforeEach(givenTestApp);
            afterEach(() => helper === null || helper === void 0 ? void 0 : helper.stop());
            it('registers a middleware interceptor provider class by factory', () => {
                const binding = __1.registerExpressMiddleware(helper.app, test_helpers_1.spy, spyConfig);
                return testFn(binding);
            });
            it('registers a middleware interceptor as handler function', () => {
                const binding = __1.registerExpressMiddleware(helper.app, test_helpers_1.spy, spyConfig, {
                    injectConfiguration: false,
                    key: 'interceptors.middleware.spy',
                });
                testlab_1.expect(binding.key).to.eql('interceptors.middleware.spy');
                return testFn(binding);
            });
        });
    }
    runTests('log', binding => helper.testSpyLog(binding));
    runTests('mock', binding => helper.testSpyMock(binding));
    runTests('reject', binding => helper.testSpyReject(binding));
    function givenTestApp() {
        helper = new test_helpers_1.TestHelper();
        helper.bindController();
        return helper.start();
    }
});
//# sourceMappingURL=middleware-action.acceptance.js.map