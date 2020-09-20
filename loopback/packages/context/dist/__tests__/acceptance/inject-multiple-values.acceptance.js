"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
let app;
let server;
describe('@inject.* to receive multiple values matching a filter', () => {
    const workloadMonitorFilter = __1.filterByTag('workloadMonitor');
    beforeEach(givenWorkloadMonitors);
    it('injects as getter', async () => {
        class MyControllerWithGetter {
        }
        tslib_1.__decorate([
            __1.inject.getter(workloadMonitorFilter),
            tslib_1.__metadata("design:type", Function)
        ], MyControllerWithGetter.prototype, "getter", void 0);
        server.bind('my-controller').toClass(MyControllerWithGetter);
        const inst = await server.get('my-controller');
        const getter = inst.getter;
        testlab_1.expect(await getter()).to.eql([3, 5]);
        // Add a new binding that matches the filter
        givenWorkloadMonitor(server, 'server-reporter-2', 7);
        // The getter picks up the new binding
        testlab_1.expect(await getter()).to.eql([3, 7, 5]);
    });
    it('injects as getter with bindingComparator', async () => {
        class MyControllerWithGetter {
        }
        tslib_1.__decorate([
            __1.inject.getter(workloadMonitorFilter, {
                bindingComparator: __1.compareBindingsByTag('name'),
            }),
            tslib_1.__metadata("design:type", Function)
        ], MyControllerWithGetter.prototype, "getter", void 0);
        server.bind('my-controller').toClass(MyControllerWithGetter);
        const inst = await server.get('my-controller');
        const getter = inst.getter;
        // app-reporter, server-reporter
        testlab_1.expect(await getter()).to.eql([5, 3]);
        // Add a new binding that matches the filter
        givenWorkloadMonitor(server, 'server-reporter-2', 7);
        // The getter picks up the new binding by order
        // // app-reporter, server-reporter, server-reporter-2
        testlab_1.expect(await getter()).to.eql([5, 3, 7]);
    });
    describe('@inject', () => {
        let MyControllerWithValues = class MyControllerWithValues {
            constructor(values) {
                this.values = values;
            }
        };
        MyControllerWithValues = tslib_1.__decorate([
            tslib_1.__param(0, __1.inject(workloadMonitorFilter)),
            tslib_1.__metadata("design:paramtypes", [Array])
        ], MyControllerWithValues);
        it('injects as values', async () => {
            server.bind('my-controller').toClass(MyControllerWithValues);
            const inst = await server.get('my-controller');
            testlab_1.expect(inst.values).to.eql([3, 5]);
        });
        it('injects as values that can be resolved synchronously', () => {
            server.bind('my-controller').toClass(MyControllerWithValues);
            const inst = server.getSync('my-controller');
            testlab_1.expect(inst.values).to.eql([3, 5]);
        });
        it('injects as values with bindingComparator', async () => {
            let MyControllerWithBindingSorter = class MyControllerWithBindingSorter {
                constructor(values) {
                    this.values = values;
                }
            };
            MyControllerWithBindingSorter = tslib_1.__decorate([
                tslib_1.__param(0, __1.inject(workloadMonitorFilter, {
                    bindingComparator: __1.compareBindingsByTag('name'),
                })),
                tslib_1.__metadata("design:paramtypes", [Array])
            ], MyControllerWithBindingSorter);
            server.bind('my-controller').toClass(MyControllerWithBindingSorter);
            const inst = await server.get('my-controller');
            // app-reporter, server-reporter
            testlab_1.expect(inst.values).to.eql([5, 3]);
        });
        it('throws error if bindingComparator is provided without a filter', () => {
            testlab_1.expect(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                let ControllerWithInvalidInject = class ControllerWithInvalidInject {
                    constructor(values) {
                        this.values = values;
                    }
                };
                ControllerWithInvalidInject = tslib_1.__decorate([
                    tslib_1.__param(0, __1.inject('my-key', {
                        bindingComparator: __1.compareBindingsByTag('name'),
                    })),
                    tslib_1.__metadata("design:paramtypes", [Array])
                ], ControllerWithInvalidInject);
            }).to.throw('Binding comparator is only allowed with a binding filter');
        });
    });
    it('injects as a view', async () => {
        class MyControllerWithView {
        }
        tslib_1.__decorate([
            __1.inject.view(workloadMonitorFilter),
            tslib_1.__metadata("design:type", __1.ContextView)
        ], MyControllerWithView.prototype, "view", void 0);
        server.bind('my-controller').toClass(MyControllerWithView);
        const inst = await server.get('my-controller');
        const view = inst.view;
        testlab_1.expect(await view.values()).to.eql([3, 5]);
        // Add a new binding that matches the filter
        const binding = givenWorkloadMonitor(server, 'server-reporter-2', 7);
        // The view picks up the new binding
        testlab_1.expect(await view.values()).to.eql([3, 7, 5]);
        server.unbind(binding.key);
        testlab_1.expect(await view.values()).to.eql([3, 5]);
    });
    it('injects as a view with bindingComparator', async () => {
        class MyControllerWithView {
        }
        tslib_1.__decorate([
            __1.inject.view(workloadMonitorFilter, {
                bindingComparator: __1.compareBindingsByTag('name'),
            }),
            tslib_1.__metadata("design:type", __1.ContextView)
        ], MyControllerWithView.prototype, "view", void 0);
        server.bind('my-controller').toClass(MyControllerWithView);
        const inst = await server.get('my-controller');
        const view = inst.view;
        testlab_1.expect(view.bindings.map(b => b.tagMap.name)).to.eql([
            'app-reporter',
            'server-reporter',
        ]);
        testlab_1.expect(await view.values()).to.eql([5, 3]);
    });
    function givenWorkloadMonitors() {
        givenServerWithinAnApp();
        givenWorkloadMonitor(server, 'server-reporter', 3);
        givenWorkloadMonitor(app, 'app-reporter', 5);
    }
    /**
     * Add a workload monitor to the given context
     * @param ctx - Context object
     * @param name - Name of the monitor
     * @param workload - Current workload
     */
    function givenWorkloadMonitor(ctx, name, workload) {
        return ctx
            .bind(`workloadMonitors.${name}`)
            .to(workload)
            .tag('workloadMonitor')
            .tag({ name });
    }
});
function givenServerWithinAnApp() {
    app = new __1.Context('app');
    server = new __1.Context(app, 'server');
}
//# sourceMappingURL=inject-multiple-values.acceptance.js.map