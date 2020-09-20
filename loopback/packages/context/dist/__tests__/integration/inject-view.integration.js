"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('@inject.view', () => {
    let ctx;
    beforeEach(() => {
        ctx = givenContext();
    });
    it('reports error if the target type (Getter<string[]>) is not ContextView', async () => {
        class MyControllerWithGetter {
        }
        tslib_1.__decorate([
            __1.inject.view(__1.filterByTag('foo')),
            tslib_1.__metadata("design:type", Function)
        ], MyControllerWithGetter.prototype, "getter", void 0);
        ctx.bind('my-controller').toClass(MyControllerWithGetter);
        await testlab_1.expect(ctx.get('my-controller')).to.be.rejectedWith('The type of MyControllerWithGetter.prototype.getter (Function) is not ContextView');
    });
    it('reports error if the target type (string[]) is not ContextView', async () => {
        let MyControllerWithValues = class MyControllerWithValues {
            constructor(values) {
                this.values = values;
            }
        };
        MyControllerWithValues = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject.view(__1.filterByTag('foo'))),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], MyControllerWithValues);
        ctx.bind('my-controller').toClass(MyControllerWithValues);
        await testlab_1.expect(ctx.get('my-controller')).to.be.rejectedWith('The type of MyControllerWithValues.constructor[0] (Array) is not ContextView');
    });
    it('injects as a view', async () => {
        class MyControllerWithTracker {
        }
        tslib_1.__decorate([
            __1.inject.view(__1.filterByTag('foo')),
            tslib_1.__metadata("design:type", __1.ContextView)
        ], MyControllerWithTracker.prototype, "view", void 0);
        ctx.bind('my-controller').toClass(MyControllerWithTracker);
        const inst = await ctx.get('my-controller');
        testlab_1.expect(inst.view).to.be.instanceOf(__1.ContextView);
        testlab_1.expect(await inst.view.values()).to.eql(['BAR', 'FOO']);
        // Add a new binding that matches the filter
        ctx.bind('xyz').to('XYZ').tag('foo');
        // The view picks up the new binding
        testlab_1.expect(await inst.view.values()).to.eql(['BAR', 'XYZ', 'FOO']);
    });
});
function givenContext(bindings = []) {
    const parent = new __1.Context('app');
    const ctx = new __1.Context(parent, 'server');
    bindings.push(ctx
        .bind('bar')
        .toDynamicValue(() => Promise.resolve('BAR'))
        .tag('foo', 'bar')
        .inScope(__1.BindingScope.SINGLETON));
    bindings.push(parent.bind('foo').to('FOO').tag('foo', 'bar'));
    return ctx;
}
//# sourceMappingURL=inject-view.integration.js.map