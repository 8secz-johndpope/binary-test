"use strict";
// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Application life cycle', () => {
    describe('state', () => {
        it('updates application state', async () => {
            const app = new __1.Application();
            testlab_1.expect(app.state).to.equal('created');
            const start = app.start();
            testlab_1.expect(app.state).to.equal('starting');
            await start;
            testlab_1.expect(app.state).to.equal('started');
            const stop = app.stop();
            testlab_1.expect(app.state).to.equal('stopping');
            await stop;
            testlab_1.expect(app.state).to.equal('stopped');
        });
        it('emits state change events', async () => {
            const app = new __1.Application();
            const events = [];
            app.on('stateChanged', event => {
                events.push(`${event.from} -> ${event.to}`);
            });
            const start = app.start();
            testlab_1.expect(events).to.eql(['created -> starting']);
            await start;
            testlab_1.expect(events).to.eql(['created -> starting', 'starting -> started']);
            const stop = app.stop();
            testlab_1.expect(events).to.eql([
                'created -> starting',
                'starting -> started',
                'started -> stopping',
            ]);
            await stop;
            testlab_1.expect(events).to.eql([
                'created -> starting',
                'starting -> started',
                'started -> stopping',
                'stopping -> stopped',
            ]);
        });
        it('emits state events', async () => {
            const app = new __1.Application();
            const events = [];
            for (const e of ['starting', 'started', 'stopping', 'stopped']) {
                app.on(e, event => {
                    events.push(e);
                });
            }
            const start = app.start();
            testlab_1.expect(events).to.eql(['starting']);
            await start;
            testlab_1.expect(events).to.eql(['starting', 'started']);
            const stop = app.stop();
            testlab_1.expect(events).to.eql(['starting', 'started', 'stopping']);
            await stop;
            testlab_1.expect(events).to.eql(['starting', 'started', 'stopping', 'stopped']);
        });
        it('allows application.stop when it is created', async () => {
            const app = new __1.Application();
            await app.stop(); // no-op
            testlab_1.expect(app.state).to.equal('created');
        });
        it('await application.stop when it is stopping', async () => {
            const app = new __1.Application();
            await app.start();
            const stop = app.stop();
            const stopAgain = app.stop();
            await stop;
            await stopAgain;
            testlab_1.expect(app.state).to.equal('stopped');
        });
        it('await application.start when it is starting', async () => {
            const app = new __1.Application();
            const start = app.start();
            const startAgain = app.start();
            await start;
            await startAgain;
            testlab_1.expect(app.state).to.equal('started');
        });
    });
    describe('start', () => {
        it('starts all injected servers', async () => {
            const app = new __1.Application();
            app.component(ObservingComponentWithServers);
            const component = await app.get(`${__1.CoreBindings.COMPONENTS}.ObservingComponentWithServers`);
            testlab_1.expect(component.status).to.equal('not-initialized');
            await app.start();
            const server = await app.getServer(ObservingServer);
            testlab_1.expect(server).to.not.be.null();
            testlab_1.expect(server.listening).to.equal(true);
            testlab_1.expect(component.status).to.equal('started');
            await app.stop();
        });
        it('starts servers bound with `LIFE_CYCLE_OBSERVER` tag', async () => {
            const app = new __1.Application();
            app
                .bind('fake-server')
                .toClass(ObservingServer)
                .tag(__1.CoreTags.LIFE_CYCLE_OBSERVER, __1.CoreTags.SERVER)
                .inScope(context_1.BindingScope.SINGLETON);
            await app.start();
            const server = await app.get('fake-server');
            testlab_1.expect(server).to.not.be.null();
            testlab_1.expect(server.listening).to.equal(true);
            await app.stop();
        });
        it('starts/stops all registered components', async () => {
            const app = new __1.Application();
            app.component(ObservingComponentWithServers);
            const component = await app.get(`${__1.CoreBindings.COMPONENTS}.ObservingComponentWithServers`);
            testlab_1.expect(component.status).to.equal('not-initialized');
            await app.start();
            testlab_1.expect(component.status).to.equal('started');
            await app.stop();
            testlab_1.expect(component.status).to.equal('stopped');
        });
        it('starts/stops all observers from the component', async () => {
            const app = new __1.Application();
            app.component(ComponentWithObservers);
            const observer = await app.get('lifeCycleObservers.MyObserver');
            const observerWithDecorator = await app.get('lifeCycleObservers.MyObserverWithDecorator');
            testlab_1.expect(observer.status).to.equal('not-initialized');
            testlab_1.expect(observerWithDecorator.status).to.equal('not-initialized');
            await app.start();
            testlab_1.expect(observer.status).to.equal('started');
            testlab_1.expect(observerWithDecorator.status).to.equal('started');
            await app.stop();
            testlab_1.expect(observer.status).to.equal('stopped');
            testlab_1.expect(observerWithDecorator.status).to.equal('stopped');
        });
        it('starts/stops all registered life cycle observers', async () => {
            const app = new __1.Application();
            app.lifeCycleObserver(MyObserver, 'my-observer');
            const observer = await app.get('lifeCycleObservers.my-observer');
            testlab_1.expect(observer.status).to.equal('not-initialized');
            await app.start();
            testlab_1.expect(observer.status).to.equal('started');
            await app.stop();
            testlab_1.expect(observer.status).to.equal('stopped');
        });
        it('registers life cycle observers with options', async () => {
            const app = new __1.Application();
            const binding = app.lifeCycleObserver(MyObserver, {
                name: 'my-observer',
                namespace: 'my-observers',
            });
            testlab_1.expect(binding.key).to.eql('my-observers.my-observer');
        });
        it('honors @injectable', async () => {
            let MyObserverWithBind = class MyObserverWithBind {
                constructor() {
                    this.status = 'not-initialized';
                }
                start() {
                    this.status = 'started';
                }
                stop() {
                    this.status = 'stopped';
                }
            };
            MyObserverWithBind = tslib_1.__decorate([
                context_1.injectable({
                    tags: {
                        [__1.CoreTags.LIFE_CYCLE_OBSERVER]: __1.CoreTags.LIFE_CYCLE_OBSERVER,
                        [__1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP]: 'my-group',
                        namespace: __1.CoreBindings.LIFE_CYCLE_OBSERVERS,
                    },
                    scope: context_1.BindingScope.SINGLETON,
                })
            ], MyObserverWithBind);
            const app = new __1.Application();
            const binding = context_1.createBindingFromClass(MyObserverWithBind);
            app.add(binding);
            testlab_1.expect(binding.tagMap[__1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP]).to.eql('my-group');
            const observer = await app.get(binding.key);
            testlab_1.expect(observer.status).to.equal('not-initialized');
            await app.start();
            testlab_1.expect(observer.status).to.equal('started');
            await app.stop();
            testlab_1.expect(observer.status).to.equal('stopped');
        });
        it('honors @lifeCycleObserver', async () => {
            const app = new __1.Application();
            const binding = context_1.createBindingFromClass(MyObserverWithDecorator);
            app.add(binding);
            testlab_1.expect(binding.tagMap[__1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP]).to.eql('my-group');
            testlab_1.expect(binding.scope).to.eql(context_1.BindingScope.SINGLETON);
            const observer = await app.get(binding.key);
            testlab_1.expect(observer.status).to.equal('not-initialized');
            await app.start();
            testlab_1.expect(observer.status).to.equal('started');
            await app.stop();
            testlab_1.expect(observer.status).to.equal('stopped');
        });
        it('does not attempt to start poorly named bindings', async () => {
            const app = new __1.Application();
            let startInvoked = false;
            let stopInvoked = false;
            // The app.start should not attempt to start this binding.
            app.bind('controllers.servers').to({
                start: () => {
                    startInvoked = true;
                },
                stop: () => {
                    stopInvoked = true;
                },
            });
            await app.start();
            testlab_1.expect(startInvoked).to.be.false(); // not invoked
            await app.stop();
            testlab_1.expect(stopInvoked).to.be.false(); // not invoked
        });
    });
    describe('app.onStart()', () => {
        it('registers the handler as "start" lifecycle observer', async () => {
            const app = new __1.Application();
            let invoked = false;
            const binding = app.onStart(async function doSomething() {
                // delay the actual observer code to the next tick to
                // verify that the promise returned by an async observer
                // is correctly forwarded by LifeCycle wrapper
                await Promise.resolve();
                invoked = true;
            });
            testlab_1.expect(binding.key).to.match(/^lifeCycleObservers.doSomething/);
            await app.start();
            testlab_1.expect(invoked).to.be.true();
        });
        it('registers multiple handlers with the same name', async () => {
            const app = new __1.Application();
            const invoked = [];
            app.onStart(() => {
                invoked.push('first');
            });
            app.onStart(() => {
                invoked.push('second');
            });
            await app.start();
            testlab_1.expect(invoked).to.deepEqual(['first', 'second']);
        });
    });
    describe('app.onStop()', () => {
        it('registers the handler as "stop" lifecycle observer', async () => {
            const app = new __1.Application();
            let invoked = false;
            const binding = app.onStop(async function doSomething() {
                // delay the actual observer code to the next tick to
                // verify that the promise returned by an async observer
                // is correctly forwarded by LifeCycle wrapper
                await Promise.resolve();
                invoked = true;
            });
            testlab_1.expect(binding.key).to.match(/^lifeCycleObservers.doSomething/);
            await app.start();
            testlab_1.expect(invoked).to.be.false();
            await app.stop();
            testlab_1.expect(invoked).to.be.true();
        });
        it('registers multiple handlers with the same name', async () => {
            const app = new __1.Application();
            const invoked = [];
            app.onStop(() => {
                invoked.push('first');
            });
            app.onStop(() => {
                invoked.push('second');
            });
            await app.start();
            testlab_1.expect(invoked).to.be.empty();
            await app.stop();
            // `stop` observers are invoked in reverse order
            testlab_1.expect(invoked).to.deepEqual(['second', 'first']);
        });
    });
});
class ObservingComponentWithServers {
    constructor() {
        this.status = 'not-initialized';
        this.servers = {
            ObservingServer: ObservingServer,
            ObservingServer2: ObservingServer,
        };
    }
    start() {
        this.status = 'started';
    }
    stop() {
        this.status = 'stopped';
    }
}
class ObservingServer extends context_1.Context {
    constructor() {
        super();
        this.listening = false;
    }
    async start() {
        this.listening = true;
    }
    async stop() {
        this.listening = false;
    }
}
class MyObserver {
    constructor() {
        this.status = 'not-initialized';
    }
    start() {
        this.status = 'started';
    }
    stop() {
        this.status = 'stopped';
    }
}
let MyObserverWithDecorator = class MyObserverWithDecorator {
    constructor() {
        this.status = 'not-initialized';
    }
    start() {
        this.status = 'started';
    }
    stop() {
        this.status = 'stopped';
    }
};
MyObserverWithDecorator = tslib_1.__decorate([
    __1.lifeCycleObserver('my-group', { scope: context_1.BindingScope.SINGLETON })
], MyObserverWithDecorator);
class ComponentWithObservers {
    constructor() {
        this.lifeCycleObservers = [MyObserver, MyObserverWithDecorator];
    }
}
//# sourceMappingURL=application-lifecycle.unit.js.map