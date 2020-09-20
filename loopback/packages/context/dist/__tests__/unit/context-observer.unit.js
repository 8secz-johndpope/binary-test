"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const events_1 = require("events");
const util_1 = require("util");
const __1 = require("../..");
const setImmediateAsync = util_1.promisify(setImmediate);
/**
 * Create a subclass of context so that we can access parents and registry
 * for assertions
 */
class TestContext extends __1.Context {
    get parentEventListener() {
        return this.subscriptionManager.parentContextEventListener;
    }
    /**
     * Wait until the context event queue is empty or an error is thrown
     */
    waitUntilObserversNotified() {
        return this.subscriptionManager.waitUntilPendingNotificationsDone(100);
    }
}
describe('Context', () => {
    let ctx;
    beforeEach('given a context', createContext);
    describe('observer subscription', () => {
        let nonMatchingObserver;
        beforeEach(givenNonMatchingObserver);
        it('subscribes observers', () => {
            ctx.subscribe(nonMatchingObserver);
            testlab_1.expect(ctx.isSubscribed(nonMatchingObserver)).to.true();
        });
        it('unsubscribes observers', () => {
            ctx.subscribe(nonMatchingObserver);
            testlab_1.expect(ctx.isSubscribed(nonMatchingObserver)).to.true();
            ctx.unsubscribe(nonMatchingObserver);
            testlab_1.expect(ctx.isSubscribed(nonMatchingObserver)).to.false();
        });
        it('allows subscription.unsubscribe()', () => {
            const subscription = ctx.subscribe(nonMatchingObserver);
            testlab_1.expect(ctx.isSubscribed(nonMatchingObserver)).to.true();
            subscription.unsubscribe();
            testlab_1.expect(ctx.isSubscribed(nonMatchingObserver)).to.false();
            testlab_1.expect(subscription.closed).to.be.true();
        });
        it('registers observers on context with parent', () => {
            const childCtx = new TestContext(ctx, 'child');
            testlab_1.expect(childCtx.parentEventListener).to.be.undefined();
            childCtx.subscribe(nonMatchingObserver);
            testlab_1.expect(childCtx.parentEventListener).to.be.a.Function();
            testlab_1.expect(childCtx.isSubscribed(nonMatchingObserver)).to.true();
            testlab_1.expect(ctx.isSubscribed(nonMatchingObserver)).to.false();
        });
        it('un-registers observers on context chain', () => {
            const childCtx = new __1.Context(ctx, 'child');
            childCtx.subscribe(nonMatchingObserver);
            testlab_1.expect(childCtx.isSubscribed(nonMatchingObserver)).to.true();
            testlab_1.expect(ctx.isSubscribed(nonMatchingObserver)).to.false();
            childCtx.unsubscribe(nonMatchingObserver);
            testlab_1.expect(childCtx.isSubscribed(nonMatchingObserver)).to.false();
            testlab_1.expect(ctx.isSubscribed(nonMatchingObserver)).to.false();
        });
        it('un-registers observers on context chain during close', () => {
            const childCtx = new TestContext(ctx, 'child');
            childCtx.subscribe(nonMatchingObserver);
            childCtx.close();
            testlab_1.expect(childCtx.parentEventListener).to.be.undefined();
            testlab_1.expect(childCtx.isSubscribed(nonMatchingObserver)).to.false();
        });
        function givenNonMatchingObserver() {
            nonMatchingObserver = {
                filter: binding => false,
                observe: () => { },
            };
        }
    });
    describe('event notification', () => {
        const events = [];
        let nonMatchingObserverCalled = false;
        beforeEach(givenObservers);
        it('emits one bind event to matching observers', async () => {
            ctx.bind('foo').to('foo-value');
            await ctx.waitUntilObserversNotified();
            testlab_1.expect(events).to.eql([
                'SYNC:foo:foo-value:bind',
                'ASYNC:foo:foo-value:bind',
            ]);
            testlab_1.expect(nonMatchingObserverCalled).to.be.false();
        });
        it('emits multiple bind events to matching observers', async () => {
            ctx.bind('foo').to('foo-value');
            ctx.bind('xyz').to('xyz-value');
            await ctx.waitUntilObserversNotified();
            testlab_1.expect(events).to.eql([
                'SYNC:foo:foo-value:bind',
                'ASYNC:foo:foo-value:bind',
                'SYNC:xyz:xyz-value:bind',
                'ASYNC:xyz:xyz-value:bind',
            ]);
        });
        it('emits unbind event to matching observers', async () => {
            ctx.bind('foo').to('foo-value');
            await ctx.waitUntilObserversNotified();
            ctx.unbind('foo');
            await ctx.waitUntilObserversNotified();
            testlab_1.expect(events).to.eql([
                'SYNC:foo:foo-value:bind',
                'ASYNC:foo:foo-value:bind',
                'SYNC:foo:foo-value:unbind',
                'ASYNC:foo:foo-value:unbind',
            ]);
            testlab_1.expect(nonMatchingObserverCalled).to.be.false();
        });
        it('emits bind/unbind events for rebind to matching observers', async () => {
            ctx.bind('foo').to('foo-value');
            await ctx.waitUntilObserversNotified();
            ctx.bind('foo').to('new-foo-value');
            await ctx.waitUntilObserversNotified();
            testlab_1.expect(events).to.eql([
                'SYNC:foo:foo-value:bind',
                'ASYNC:foo:foo-value:bind',
                'SYNC:foo:foo-value:unbind',
                'ASYNC:foo:foo-value:unbind',
                'SYNC:foo:new-foo-value:bind',
                'ASYNC:foo:new-foo-value:bind',
            ]);
            testlab_1.expect(nonMatchingObserverCalled).to.be.false();
        });
        it('does not trigger observers if affected binding is the same', async () => {
            const binding = ctx.bind('foo').to('foo-value');
            await ctx.waitUntilObserversNotified();
            testlab_1.expect(events).to.eql([
                'SYNC:foo:foo-value:bind',
                'ASYNC:foo:foo-value:bind',
            ]);
            ctx.add(binding);
            await ctx.waitUntilObserversNotified();
            testlab_1.expect(events).to.eql([
                'SYNC:foo:foo-value:bind',
                'ASYNC:foo:foo-value:bind',
            ]);
        });
        it('reports error if an observer fails', () => {
            ctx.bind('bar').to('bar-value');
            return testlab_1.expect(ctx.waitUntilObserversNotified()).to.be.rejectedWith('something wrong - async');
        });
        it('does not trigger observers registered after an event', async () => {
            ctx.bind('foo').to('foo-value');
            process.nextTick(() => {
                // Register a new observer after 1st event
                ctx.subscribe((event, binding, context) => {
                    const val = binding.getValue(context);
                    events.push(`LATE:${binding.key}:${val}:${event}`);
                });
            });
            await ctx.waitUntilObserversNotified();
            // The late observer is not triggered
            testlab_1.expect(events).to.eql([
                'SYNC:foo:foo-value:bind',
                'ASYNC:foo:foo-value:bind',
            ]);
            // Emit another event
            ctx.bind('xyz').to('xyz-value');
            await ctx.waitUntilObserversNotified();
            // Now the late observer is triggered
            testlab_1.expect(events).to.eql([
                'SYNC:foo:foo-value:bind',
                'ASYNC:foo:foo-value:bind',
                'SYNC:xyz:xyz-value:bind',
                'ASYNC:xyz:xyz-value:bind',
                'LATE:xyz:xyz-value:bind',
            ]);
        });
        function givenObservers() {
            nonMatchingObserverCalled = false;
            events.splice(0, events.length);
            // An observer does not match the criteria
            const nonMatchingObserver = {
                filter: binding => false,
                observe: () => {
                    nonMatchingObserverCalled = true;
                },
            };
            // A sync observer matches the criteria
            const matchingObserver = {
                observe: (event, binding, context) => {
                    // Make sure the binding is configured with value
                    // when the observer is notified
                    const val = binding.getValue(context);
                    events.push(`SYNC:${binding.key}:${val}:${event}`);
                },
            };
            // An async observer matches the criteria
            const matchingAsyncObserver = {
                filter: binding => true,
                observe: async (event, binding, context) => {
                    await setImmediateAsync();
                    const val = binding.getValue(context);
                    events.push(`ASYNC:${binding.key}:${val}:${event}`);
                },
            };
            // An async observer matches the criteria that throws an error
            const matchingAsyncObserverWithError = {
                filter: binding => binding.key === 'bar',
                observe: async () => {
                    await setImmediateAsync();
                    throw new Error('something wrong - async');
                },
            };
            ctx.subscribe(nonMatchingObserver);
            ctx.subscribe(matchingObserver);
            ctx.subscribe(matchingAsyncObserver);
            ctx.subscribe(matchingAsyncObserverWithError);
        }
    });
    describe('event notification for context chain', () => {
        let app;
        let server;
        let contextObserver;
        beforeEach(givenControllerObserver);
        it('receives notifications of matching binding events', async () => {
            const controllers = await getControllers();
            // We have server: 1, app: 2
            // NOTE: The controllers are not guaranteed to be ['1', '2'] as the events
            // are emitted by two context objects and they are processed asynchronously
            testlab_1.expect(controllers).to.containEql('1@server');
            testlab_1.expect(controllers).to.containEql('2@app');
            server.unbind('controllers.1');
            // Now we have app: 2
            testlab_1.expect(await getControllers()).to.eql(['2@app']);
            app.unbind('controllers.2');
            // All controllers are gone from the context chain
            testlab_1.expect(await getControllers()).to.eql([]);
            // Add a new controller - server: 3
            givenController(server, '3');
            testlab_1.expect(await getControllers()).to.eql(['3@server']);
        });
        it('does not emit matching binding events from parent if shadowed', async () => {
            // We have server: 1, app: 2
            givenController(app, '1');
            // All controllers are gone from the context chain
            testlab_1.expect(await getControllers()).to.not.containEql('1@app');
        });
        it('reports error on current context if an observer fails', async () => {
            const err = new Error('something wrong - 1');
            server.subscribe((event, binding) => {
                if (binding.key === 'bar') {
                    return Promise.reject(err);
                }
            });
            server.bind('bar').to('bar-value');
            // Please note the following code registers an `error` listener on `server`
            // so that error events are caught before it is reported as unhandled.
            const [obj] = await events_1.once(server, 'error');
            testlab_1.expect(obj).to.equal(err);
        });
        it('reports error on the first context with error listeners on the chain', async () => {
            const err = new Error('something wrong - 2');
            server.subscribe((event, binding) => {
                if (binding.key === 'bar') {
                    return Promise.reject(err);
                }
            });
            server.bind('bar').to('bar-value');
            // No error listener is registered on `server`
            const [obj] = await events_1.once(app, 'error');
            testlab_1.expect(obj).to.equal(err);
        });
        class MyObserverForControllers {
            constructor() {
                this.controllers = new Set();
                this.filter = __1.filterByTag('controller');
            }
            observe(event, binding, context) {
                const name = `${binding.tagMap.name}@${context.name}`;
                if (event === 'bind') {
                    this.controllers.add(name);
                }
                else if (event === 'unbind') {
                    this.controllers.delete(name);
                }
            }
        }
        function givenControllerObserver() {
            givenServerWithinAnApp();
            contextObserver = new MyObserverForControllers();
            server.subscribe(contextObserver);
            givenController(server, '1');
            givenController(app, '2');
        }
        function givenController(context, controllerName) {
            class MyController {
                constructor() {
                    this.name = controllerName;
                }
            }
            context
                .bind(`controllers.${controllerName}`)
                .toClass(MyController)
                .tag('controller', { name: controllerName });
        }
        async function getControllers() {
            return new Promise(resolve => {
                // Wrap it inside `setImmediate` to make the events are triggered
                setImmediate(() => resolve(Array.from(contextObserver.controllers)));
            });
        }
        function givenServerWithinAnApp() {
            app = new __1.Context('app');
            server = new __1.Context(app, 'server');
        }
    });
    function createContext() {
        ctx = new TestContext();
    }
});
//# sourceMappingURL=context-observer.unit.js.map