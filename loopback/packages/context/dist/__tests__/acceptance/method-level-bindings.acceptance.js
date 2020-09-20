"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const debug_1 = tslib_1.__importDefault(require("debug"));
const __1 = require("../..");
const debug = debug_1.default('loopback:context:test');
class InfoController {
    static sayHello(user) {
        const msg = `Hello ${user}`;
        debug(msg);
        return msg;
    }
    hello(user = 'Mary') {
        const msg = `Hello ${user}`;
        debug(msg);
        return msg;
    }
    greet(prefix, user) {
        const msg = `[${prefix}] Hello ${user}`;
        debug(msg);
        return msg;
    }
    greetWithDefault(prefix = '***', user) {
        const msg = `[${prefix}] Hello ${user}`;
        debug(msg);
        return msg;
    }
}
tslib_1.__decorate([
    tslib_1.__param(0, __1.inject('user', { optional: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", String)
], InfoController.prototype, "hello", null);
tslib_1.__decorate([
    tslib_1.__param(1, __1.inject('user')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", String)
], InfoController.prototype, "greet", null);
tslib_1.__decorate([
    tslib_1.__param(1, __1.inject('user')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", String)
], InfoController.prototype, "greetWithDefault", null);
tslib_1.__decorate([
    tslib_1.__param(0, __1.inject('user')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", String)
], InfoController, "sayHello", null);
const INFO_CONTROLLER = __1.BindingKey.create('controllers.info');
describe('Context bindings - Injecting dependencies of method', () => {
    let ctx;
    beforeEach('given a context', createContext);
    it('injects prototype method args', async () => {
        const instance = await ctx.get(INFO_CONTROLLER);
        // Invoke the `hello` method => Hello John
        const msg = await __1.invokeMethod(instance, 'hello', ctx);
        testlab_1.expect(msg).to.eql('Hello John');
    });
    it('injects optional prototype method args', async () => {
        ctx = new __1.Context();
        ctx.bind(INFO_CONTROLLER).toClass(InfoController);
        const instance = await ctx.get(INFO_CONTROLLER);
        // Invoke the `hello` method => Hello Mary
        const msg = await __1.invokeMethod(instance, 'hello', ctx);
        testlab_1.expect(msg).to.eql('Hello Mary');
    });
    it('injects prototype method args with non-injected ones', async () => {
        const instance = await ctx.get(INFO_CONTROLLER);
        // Invoke the `hello` method => Hello John
        const msg = await __1.invokeMethod(instance, 'greet', ctx, ['INFO']);
        testlab_1.expect(msg).to.eql('[INFO] Hello John');
    });
    it('injects prototype method args with non-injected ones with default', async () => {
        const instance = await ctx.get(INFO_CONTROLLER);
        // Invoke the `hello` method => Hello John
        const msg = await __1.invokeMethod(instance, 'greetWithDefault', ctx, ['INFO']);
        testlab_1.expect(msg).to.eql('[INFO] Hello John');
    });
    it('injects static method args', async () => {
        // Invoke the `sayHello` method => Hello John
        const msg = await __1.invokeMethod(InfoController, 'sayHello', ctx);
        testlab_1.expect(msg).to.eql('Hello John');
    });
    it('throws error if not all args can be resolved', async () => {
        const instance = await ctx.get(INFO_CONTROLLER);
        testlab_1.expect(() => {
            __1.invokeMethod(instance, 'greet', ctx);
        }).to.throw(/The argument 'InfoController\.prototype\.greet\[0\]' is not decorated for dependency injection/);
        testlab_1.expect(() => {
            __1.invokeMethod(instance, 'greet', ctx);
        }).to.throw(/but no value was supplied by the caller\. Did you forget to apply @inject\(\) to the argument\?/);
    });
    function createContext() {
        ctx = new __1.Context();
        ctx.bind('user').toDynamicValue(() => Promise.resolve('John'));
        ctx.bind(INFO_CONTROLLER).toClass(InfoController);
    }
});
//# sourceMappingURL=method-level-bindings.acceptance.js.map