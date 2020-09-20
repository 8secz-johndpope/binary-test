"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('InvocationContext', () => {
    let ctx;
    let invocationCtxForGreet;
    let invocationCtxForHello;
    let invocationCtxForCheckName;
    let invalidInvocationCtx;
    let invalidInvocationCtxForStaticMethod;
    before(givenContext);
    before(givenInvocationContext);
    it('has a getter for targetClass', () => {
        testlab_1.expect(invocationCtxForGreet.targetClass).to.equal(MyController);
        testlab_1.expect(invocationCtxForCheckName.targetClass).to.equal(MyController);
    });
    it('has a getter for targetName', () => {
        testlab_1.expect(invocationCtxForGreet.targetName).to.equal('MyController.prototype.greet');
        testlab_1.expect(invocationCtxForCheckName.targetName).to.equal('MyController.checkName');
    });
    it('has a getter for description', () => {
        testlab_1.expect(invocationCtxForGreet.description).to.equal(`InvocationContext(${invocationCtxForGreet.name}): MyController.prototype.greet`);
        testlab_1.expect(invocationCtxForCheckName.description).to.equal(`InvocationContext(${invocationCtxForCheckName.name}): MyController.checkName`);
    });
    it('has public access to parent context', () => {
        testlab_1.expect(invocationCtxForGreet.parent).to.equal(ctx);
    });
    it('throws error if method does not exist', () => {
        testlab_1.expect(() => invalidInvocationCtx.assertMethodExists()).to.throw('Method MyController.prototype.invalid-method not found');
        testlab_1.expect(() => invalidInvocationCtxForStaticMethod.assertMethodExists()).to.throw('Method MyController.invalid-static-method not found');
    });
    it('invokes target method', async () => {
        testlab_1.expect(await invocationCtxForGreet.invokeTargetMethod()).to.eql('Hello, John');
        testlab_1.expect(invocationCtxForCheckName.invokeTargetMethod()).to.eql(true);
    });
    it('invokes target method with injection', async () => {
        testlab_1.expect(await invocationCtxForHello.invokeTargetMethod({
            skipParameterInjection: false,
        })).to.eql('Hello, Jane');
    });
    it('does not close when an interceptor is in processing', () => {
        const result = invocationCtxForGreet.invokeTargetMethod();
        testlab_1.expect(invocationCtxForGreet.isBound('abc'));
        return result;
    });
    class MyController {
        static checkName(name) {
            const firstLetter = name.substring(0, 1);
            return firstLetter === firstLetter.toUpperCase();
        }
        async greet(name) {
            return `Hello, ${name}`;
        }
        async hello(name) {
            return `Hello, ${name}`;
        }
    }
    tslib_1.__decorate([
        tslib_1.__param(0, __1.inject('name')),
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", [String]),
        tslib_1.__metadata("design:returntype", Promise)
    ], MyController.prototype, "hello", null);
    function givenContext() {
        ctx = new __1.Context();
        ctx.bind('abc').to('xyz');
    }
    function givenInvocationContext() {
        invocationCtxForGreet = new __1.InvocationContext(ctx, new MyController(), 'greet', ['John']);
        invocationCtxForHello = new __1.InvocationContext(ctx, new MyController(), 'hello', []);
        invocationCtxForHello.bind('name').to('Jane');
        invocationCtxForCheckName = new __1.InvocationContext(ctx, MyController, 'checkName', ['John']);
        invalidInvocationCtx = new __1.InvocationContext(ctx, new MyController(), 'invalid-method', ['John']);
        invalidInvocationCtxForStaticMethod = new __1.InvocationContext(ctx, MyController, 'invalid-static-method', ['John']);
    }
});
//# sourceMappingURL=invocation-context.unit.js.map