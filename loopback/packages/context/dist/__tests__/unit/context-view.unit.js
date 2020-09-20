"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const p_event_1 = tslib_1.__importDefault(require("p-event"));
const __1 = require("../..");
describe('ContextView', () => {
    let app;
    let server;
    let bindings;
    let taggedAsFoo;
    beforeEach(givenContextView);
    it('tracks bindings', () => {
        testlab_1.expect(taggedAsFoo.bindings).to.eql(bindings);
    });
    it('leverages findByTag for binding tag filter', () => {
        testlab_1.expect(taggedAsFoo.bindings).to.eql(bindings);
        testlab_1.expect(server.findByTagInvoked).to.be.true();
    });
    it('sorts matched bindings', () => {
        const view = new __1.ContextView(server, __1.filterByTag('foo'), __1.compareBindingsByTag('phase', ['b', 'a']));
        testlab_1.expect(view.bindings).to.eql([bindings[1], bindings[0]]);
    });
    it('resolves bindings', async () => {
        testlab_1.expect(await taggedAsFoo.resolve()).to.eql(['BAR', 'FOO']);
        testlab_1.expect(await taggedAsFoo.values()).to.eql(['BAR', 'FOO']);
    });
    it('resolves bindings as a getter', async () => {
        testlab_1.expect(await taggedAsFoo.asGetter()()).to.eql(['BAR', 'FOO']);
    });
    it('reports error on singleValue() if multiple values exist', async () => {
        return testlab_1.expect(taggedAsFoo.singleValue()).to.be.rejectedWith(/The ContextView has more than one value\. Use values\(\) to access them\./);
    });
    it('supports singleValue() if only one value exist', async () => {
        server.unbind('bar');
        testlab_1.expect(await taggedAsFoo.singleValue()).to.eql('FOO');
    });
    it('reloads bindings after refresh', async () => {
        taggedAsFoo.refresh();
        const abcBinding = server.bind('abc').to('ABC').tag('abc');
        const xyzBinding = server.bind('xyz').to('XYZ').tag('foo');
        testlab_1.expect(taggedAsFoo.bindings).to.containEql(xyzBinding);
        // `abc` does not have the matching tag
        testlab_1.expect(taggedAsFoo.bindings).to.not.containEql(abcBinding);
        testlab_1.expect(await taggedAsFoo.values()).to.eql(['BAR', 'XYZ', 'FOO']);
    });
    it('reloads bindings if context bindings are added', async () => {
        const abcBinding = server.bind('abc').to('ABC').tag('abc');
        const xyzBinding = server.bind('xyz').to('XYZ').tag('foo');
        testlab_1.expect(taggedAsFoo.bindings).to.containEql(xyzBinding);
        // `abc` does not have the matching tag
        testlab_1.expect(taggedAsFoo.bindings).to.not.containEql(abcBinding);
        testlab_1.expect(await taggedAsFoo.values()).to.eql(['BAR', 'XYZ', 'FOO']);
    });
    it('reloads bindings if context bindings are removed', async () => {
        server.unbind('bar');
        testlab_1.expect(await taggedAsFoo.values()).to.eql(['FOO']);
    });
    it('reloads bindings if context bindings are rebound', async () => {
        server.bind('bar').to('BAR'); // No more tagged with `foo`
        testlab_1.expect(await taggedAsFoo.values()).to.eql(['FOO']);
    });
    it('reloads bindings if parent context bindings are added', async () => {
        const xyzBinding = app.bind('xyz').to('XYZ').tag('foo');
        testlab_1.expect(taggedAsFoo.bindings).to.containEql(xyzBinding);
        testlab_1.expect(await taggedAsFoo.values()).to.eql(['BAR', 'FOO', 'XYZ']);
    });
    it('reloads bindings if parent context bindings are removed', async () => {
        app.unbind('foo');
        testlab_1.expect(await taggedAsFoo.values()).to.eql(['BAR']);
    });
    it('stops watching', async () => {
        testlab_1.expect(await taggedAsFoo.values()).to.eql(['BAR', 'FOO']);
        taggedAsFoo.close();
        app.unbind('foo');
        testlab_1.expect(await taggedAsFoo.values()).to.eql(['BAR', 'FOO']);
    });
    it('returns a copy of cached values', async () => {
        const values = await taggedAsFoo.values();
        const valuesFromCache = await taggedAsFoo.values();
        testlab_1.expect(values).to.not.equal(valuesFromCache); // Not the same array
        testlab_1.expect(values).to.eql(valuesFromCache); // But with the same items
    });
    it('returns a copy of cached values for resolve()', async () => {
        const values = await taggedAsFoo.resolve();
        const valuesFromCache = await taggedAsFoo.resolve();
        testlab_1.expect(values).to.not.equal(valuesFromCache); // Not the same array
        testlab_1.expect(values).to.eql(valuesFromCache); // But with the same items
    });
    describe('EventEmitter', () => {
        let events = [];
        beforeEach(setupListeners);
        it('emits close', () => {
            taggedAsFoo.close();
            testlab_1.expect(events).to.eql(['close']);
            // 2nd close does not emit `close` as it's closed
            taggedAsFoo.close();
            testlab_1.expect(events).to.eql(['close']);
        });
        it('emits refresh', () => {
            taggedAsFoo.refresh();
            testlab_1.expect(events).to.eql(['refresh']);
        });
        it('emits resolve', async () => {
            await taggedAsFoo.values();
            testlab_1.expect(events).to.eql(['resolve']);
            // Second call does not resolve as values are cached
            await taggedAsFoo.values();
            testlab_1.expect(events).to.eql(['resolve']);
        });
        it('emits refresh & resolve when bindings are changed', async () => {
            server.bind('xyz').to('XYZ').tag('foo');
            await taggedAsFoo.values();
            testlab_1.expect(events).to.eql(['bind', 'refresh', 'resolve']);
        });
        it('emits bind/unbind when bindings are changed', async () => {
            const bindingEvents = [];
            taggedAsFoo.on('bind', evt => {
                bindingEvents.push(evt);
            });
            taggedAsFoo.on('unbind', evt => {
                bindingEvents.push(evt);
            });
            const binding = server.bind('xyz').to('XYZ').tag('foo');
            await p_event_1.default(taggedAsFoo, 'bind');
            let values = await taggedAsFoo.values();
            testlab_1.expect(values.sort()).to.eql(['BAR', 'FOO', 'XYZ']);
            const context = server;
            testlab_1.expect(bindingEvents).to.eql([{ type: 'bind', binding, context }]);
            server.unbind('xyz');
            await p_event_1.default(taggedAsFoo, 'unbind');
            values = await taggedAsFoo.values();
            testlab_1.expect(values.sort()).to.eql(['BAR', 'FOO']);
            testlab_1.expect(bindingEvents).to.eql([
                { type: 'bind', binding, context },
                { type: 'unbind', binding, context, cachedValue: 'XYZ' },
            ]);
        });
        it('does bot emit bind/unbind when a shadowed binding is changed', async () => {
            const bindingEvents = [];
            taggedAsFoo.on('bind', evt => {
                bindingEvents.push(evt);
            });
            taggedAsFoo.on('unbind', evt => {
                bindingEvents.push(evt);
            });
            // Add a `bar` binding to the parent context
            app.bind('bar').to('BAR from app').tag('foo');
            // The newly added binding is shadowed. No `bind` event will be emitted
            await testlab_1.expect(p_event_1.default(taggedAsFoo, 'bind', { timeout: 50 })).to.be.rejectedWith(/Promise timed out after 50 milliseconds/);
            let values = await taggedAsFoo.values();
            testlab_1.expect(values.sort()).to.eql(['BAR', 'FOO']);
            testlab_1.expect(bindingEvents).to.eql([]);
            app.unbind('bar');
            await testlab_1.expect(p_event_1.default(taggedAsFoo, 'unbind', { timeout: 50 })).to.be.rejectedWith(/Promise timed out after 50 milliseconds/);
            values = await taggedAsFoo.values();
            testlab_1.expect(values.sort()).to.eql(['BAR', 'FOO']);
            testlab_1.expect(bindingEvents).to.eql([]);
        });
        function setupListeners() {
            events = [];
            ['close', 'refresh', 'resolve', 'bind', 'unbind'].forEach(t => taggedAsFoo.on(t, () => events.push(t)));
        }
    });
    describe('createViewGetter', () => {
        it('creates a getter function for the binding filter', async () => {
            const getter = __1.createViewGetter(server, __1.filterByTag('foo'));
            testlab_1.expect(await getter()).to.eql(['BAR', 'FOO']);
            server.bind('abc').to('ABC').tag('abc');
            server.bind('xyz').to('XYZ').tag('foo');
            testlab_1.expect(await getter()).to.eql(['BAR', 'XYZ', 'FOO']);
        });
        it('creates a getter function for the binding filter and comparator', async () => {
            const getter = __1.createViewGetter(server, __1.filterByTag('foo'), (a, b) => {
                return a.key.localeCompare(b.key);
            });
            testlab_1.expect(await getter()).to.eql(['BAR', 'FOO']);
            server.bind('abc').to('ABC').tag('abc');
            server.bind('xyz').to('XYZ').tag('foo');
            testlab_1.expect(await getter()).to.eql(['BAR', 'FOO', 'XYZ']);
        });
    });
    function givenContextView() {
        bindings = [];
        givenContext();
        taggedAsFoo = server.createView(__1.filterByTag('foo'));
    }
    class ServerContext extends __1.Context {
        constructor(parent, name) {
            super(parent, name);
            this.findByTagInvoked = false;
        }
        _findByTagIndex(tag) {
            this.findByTagInvoked = true;
            return super._findByTagIndex(tag);
        }
    }
    function givenContext() {
        app = new __1.Context('app');
        server = new ServerContext(app, 'server');
        bindings.push(server
            .bind('bar')
            .toDynamicValue(() => Promise.resolve('BAR'))
            .tag('foo', 'bar', { phase: 'a' })
            .inScope(__1.BindingScope.SINGLETON));
        bindings.push(app.bind('foo').to('FOO').tag('foo', 'bar', { phase: 'b' }));
    }
});
//# sourceMappingURL=context-view.unit.js.map