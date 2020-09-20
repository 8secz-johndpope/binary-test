"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('@inject.* to receive multiple values matching a filter', () => {
    let ctx;
    beforeEach(() => {
        ctx = givenContext();
    });
    it('injects as getter', async () => {
        class MyControllerWithGetter {
        }
        tslib_1.__decorate([
            __1.inject.getter(__1.filterByTag('foo')),
            tslib_1.__metadata("design:type", Function)
        ], MyControllerWithGetter.prototype, "getter", void 0);
        ctx.bind('my-controller').toClass(MyControllerWithGetter);
        const inst = await ctx.get('my-controller');
        const getter = inst.getter;
        testlab_1.expect(getter).to.be.a.Function();
        testlab_1.expect(await getter()).to.eql(['BAR', 'FOO']);
        // Add a new binding that matches the filter
        ctx.bind('xyz').to('XYZ').tag('foo');
        // The getter picks up the new binding
        testlab_1.expect(await getter()).to.eql(['BAR', 'XYZ', 'FOO']);
    });
    it('injects as values', async () => {
        let MyControllerWithValues = class MyControllerWithValues {
            constructor(values) {
                this.values = values;
            }
        };
        MyControllerWithValues = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject(__1.filterByTag('foo'))),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], MyControllerWithValues);
        ctx.bind('my-controller').toClass(MyControllerWithValues);
        const inst = await ctx.get('my-controller');
        testlab_1.expect(inst.values).to.eql(['BAR', 'FOO']);
    });
    it('refuses to inject as a view', async () => {
        class MyControllerWithView {
        }
        tslib_1.__decorate([
            __1.inject(__1.filterByTag('foo')),
            tslib_1.__metadata("design:type", __1.ContextView)
        ], MyControllerWithView.prototype, "view", void 0);
        ctx.bind('my-controller').toClass(MyControllerWithView);
        await testlab_1.expect(ctx.get('my-controller')).to.be.rejectedWith('The type of MyControllerWithView.prototype.view' +
            ' (ContextView) is not Array');
    });
    it('refuses to inject as a getter', async () => {
        class MyControllerWithGetter2 {
        }
        tslib_1.__decorate([
            __1.inject(__1.filterByTag('foo')),
            tslib_1.__metadata("design:type", Function)
        ], MyControllerWithGetter2.prototype, "getter", void 0);
        ctx.bind('my-controller').toClass(MyControllerWithGetter2);
        await testlab_1.expect(ctx.get('my-controller')).to.be.rejectedWith('The type of MyControllerWithGetter2.prototype.getter' +
            ' (Function) is not Array');
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
//# sourceMappingURL=inject.integration.js.map