"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Context binding configuration', () => {
    /**
     * Create a subclass of context so that we can access parents and registry
     * for assertions
     */
    class TestContext extends __1.Context {
    }
    let ctx;
    beforeEach(createContext);
    describe('configure()', () => {
        it('configures options for a binding before it is bound', () => {
            const bindingForConfig = ctx.configure('foo').to({ x: 1 });
            testlab_1.expect(bindingForConfig.key).to.equal(__1.BindingKey.buildKeyForConfig('foo'));
            testlab_1.expect(bindingForConfig.tagMap).to.eql({
                [__1.ContextTags.CONFIGURATION_FOR]: 'foo',
            });
        });
        it('configures options for a binding after it is bound', () => {
            ctx.bind('foo').to('bar');
            const bindingForConfig = ctx.configure('foo').to({ x: 1 });
            testlab_1.expect(bindingForConfig.key).to.equal(__1.BindingKey.buildKeyForConfig('foo'));
            testlab_1.expect(bindingForConfig.tagMap).to.eql({
                [__1.ContextTags.CONFIGURATION_FOR]: 'foo',
            });
        });
    });
    describe('getConfig()', () => {
        it('gets config for a binding', async () => {
            ctx.configure('foo').toDynamicValue(() => Promise.resolve({ x: 1 }));
            testlab_1.expect(await ctx.getConfig('foo')).to.eql({ x: 1 });
        });
        it('gets config for a binding with propertyPath', async () => {
            ctx
                .configure('foo')
                .toDynamicValue(() => Promise.resolve({ a: { x: 0, y: 0 } }));
            ctx.configure('foo.a').toDynamicValue(() => Promise.resolve({ x: 1 }));
            testlab_1.expect(await ctx.getConfig('foo.a', 'x')).to.eql(1);
            testlab_1.expect(await ctx.getConfig('foo.a', 'y')).to.be.undefined();
        });
        it('defaults optional to true for config resolution', async () => {
            // `servers.rest` does not exist yet
            let server1port = await ctx.getConfig('servers.rest', 'port');
            testlab_1.expect(server1port).to.be.undefined();
            // Now add `servers.rest`
            ctx.configure('servers.rest').to({ port: 3000 });
            server1port = await ctx.getConfig('servers.rest', 'port');
            testlab_1.expect(server1port).to.eql(3000);
        });
        it('throws error if a required config cannot be resolved', async () => {
            await testlab_1.expect(ctx.getConfig('servers.rest', 'host', {
                optional: false,
            })).to.be.rejectedWith(/The key 'servers\.rest\:\$config' is not bound/);
        });
    });
    describe('getConfigSync()', () => {
        it('gets config for a binding', () => {
            ctx.configure('foo').to({ x: 1 });
            testlab_1.expect(ctx.getConfigSync('foo')).to.eql({ x: 1 });
        });
        it('gets config for a binding with propertyPath', () => {
            ctx.configure('foo').to({ x: 1 });
            testlab_1.expect(ctx.getConfigSync('foo', 'x')).to.eql(1);
            testlab_1.expect(ctx.getConfigSync('foo', 'y')).to.be.undefined();
        });
        it('throws a helpful error when the config is async', () => {
            ctx.configure('foo').toDynamicValue(() => Promise.resolve('bar'));
            testlab_1.expect(() => ctx.getConfigSync('foo')).to.throw(/Cannot get config for foo synchronously: the value is a promise/);
        });
    });
    describe('configResolver', () => {
        class MyConfigResolver {
            getConfigAsValueOrPromise(key, propertyPath, resolutionOptions) {
                return `Dummy config for ${key}`;
            }
        }
        it('gets default resolver', () => {
            ctx.getConfigSync('xyz');
            testlab_1.expect(ctx.configResolver).to.be.instanceOf(__1.DefaultConfigurationResolver);
        });
        it('allows custom resolver', () => {
            ctx.configResolver = new MyConfigResolver();
            const config = ctx.getConfigSync('xyz');
            testlab_1.expect(config).to.equal('Dummy config for xyz');
        });
        it('allows custom resolver bound to the context', () => {
            ctx
                .bind(`${__1.BindingKey.CONFIG_NAMESPACE}.resolver`)
                .toClass(MyConfigResolver);
            const config = ctx.getConfigSync('xyz');
            testlab_1.expect(config).to.equal('Dummy config for xyz');
            testlab_1.expect(ctx.configResolver).to.be.instanceOf(MyConfigResolver);
        });
    });
    function createContext() {
        ctx = new TestContext();
    }
});
//# sourceMappingURL=context-config.unit.js.map