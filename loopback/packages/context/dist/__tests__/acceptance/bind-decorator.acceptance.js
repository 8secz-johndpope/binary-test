"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('@injectable - customize classes with binding attributes', () => {
    let MyService = class MyService {
    };
    MyService = tslib_1.__decorate([
        __1.injectable({
            scope: __1.BindingScope.SINGLETON,
            tags: ['service'],
        })
    ], MyService);
    let MyDateProvider = class MyDateProvider {
        value() {
            return new Date();
        }
    };
    MyDateProvider = tslib_1.__decorate([
        __1.injectable.provider({
            tags: {
                key: 'my-date-provider',
            },
        })
    ], MyDateProvider);
    let MyController = class MyController {
    };
    MyController = tslib_1.__decorate([
        __1.injectable({
            tags: ['controller', { name: 'my-controller', type: 'controller' }],
        })
    ], MyController);
    const discoveredClasses = [MyService, MyDateProvider, MyController];
    it('allows discovery of classes to be bound', () => {
        const ctx = new __1.Context();
        discoveredClasses.forEach(c => {
            const binding = __1.createBindingFromClass(c);
            if (binding.tagMap.controller) {
                ctx.add(binding);
            }
        });
        testlab_1.expect(ctx.findByTag('controller').map(b => b.key)).eql([
            'controllers.my-controller',
        ]);
        testlab_1.expect(ctx.find().map(b => b.key)).eql(['controllers.my-controller']);
    });
    it('allows binding attributes to be customized', () => {
        const ctx = new __1.Context();
        discoveredClasses.forEach(c => {
            const binding = __1.createBindingFromClass(c, {
                typeNamespaceMapping: {
                    controller: 'controllers',
                    service: 'service-proxies',
                },
            });
            ctx.add(binding);
        });
        testlab_1.expect(ctx.findByTag('provider').map(b => b.key)).eql(['my-date-provider']);
        testlab_1.expect(ctx.getBinding('service-proxies.MyService').scope).to.eql(__1.BindingScope.SINGLETON);
        testlab_1.expect(ctx.find().map(b => b.key)).eql([
            'service-proxies.MyService',
            'my-date-provider',
            'controllers.my-controller',
        ]);
    });
    it('supports default binding scope in options', () => {
        const binding = __1.createBindingFromClass(MyController, {
            defaultScope: __1.BindingScope.SINGLETON,
        });
        testlab_1.expect(binding.scope).to.equal(__1.BindingScope.SINGLETON);
    });
    describe('binding scope', () => {
        let MySingletonController = class MySingletonController {
        };
        MySingletonController = tslib_1.__decorate([
            __1.injectable({
                // Explicitly set the binding scope to be `SINGLETON` as the developer
                // choose to implement the controller as a singleton without depending
                // on request specific information
                scope: __1.BindingScope.SINGLETON,
            })
        ], MySingletonController);
        it('allows singleton controller with @injectable', () => {
            const binding = __1.createBindingFromClass(MySingletonController, {
                type: 'controller',
            });
            testlab_1.expect(binding.key).to.equal('controllers.MySingletonController');
            testlab_1.expect(binding.tagMap).to.containEql({ controller: 'controller' });
            testlab_1.expect(binding.scope).to.equal(__1.BindingScope.SINGLETON);
        });
        it('honors binding scope from @injectable over defaultScope', () => {
            const binding = __1.createBindingFromClass(MySingletonController, {
                defaultScope: __1.BindingScope.TRANSIENT,
            });
            testlab_1.expect(binding.scope).to.equal(__1.BindingScope.SINGLETON);
        });
        it('honors binding scope from @injectable', () => {
            const binding = __1.createBindingFromClass(MySingletonController);
            testlab_1.expect(binding.scope).to.equal(__1.BindingScope.SINGLETON);
        });
    });
});
//# sourceMappingURL=bind-decorator.acceptance.js.map