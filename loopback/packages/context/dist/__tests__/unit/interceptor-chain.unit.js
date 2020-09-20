"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('GenericInterceptorChain', () => {
    let ctx;
    let interceptorChain;
    let events;
    beforeEach(givenContext);
    it('invokes interceptor functions', async () => {
        givenInterceptorChain(givenNamedInterceptor('interceptor1'), givenNamedInterceptor('interceptor2'));
        const result = await interceptorChain.invokeInterceptors();
        testlab_1.expect(events).to.eql([
            'before-interceptor1',
            'before-interceptor2',
            'after-interceptor2',
            'after-interceptor1',
        ]);
        testlab_1.expect(result).to.be.undefined();
    });
    it('invokes an empty chain', async () => {
        givenInterceptorChain();
        const result = await interceptorChain.invokeInterceptors();
        testlab_1.expect(events).to.eql([]);
        testlab_1.expect(result).to.be.undefined();
    });
    it('honors return value', async () => {
        givenInterceptorChain(givenNamedInterceptor('interceptor1'), async (context, next) => {
            await next();
            return 'ABC';
        });
        const result = await interceptorChain.invokeInterceptors();
        testlab_1.expect(result).to.eql('ABC');
    });
    it('honors final handler', async () => {
        givenInterceptorChain(givenNamedInterceptor('interceptor1'), async (context, next) => {
            return next();
        });
        const finalHandler = () => {
            return 'final';
        };
        const result = await interceptorChain.invokeInterceptors(finalHandler);
        testlab_1.expect(result).to.eql('final');
    });
    it('skips downstream interceptors if next is not invoked', async () => {
        givenInterceptorChain(async (context, next) => {
            return 'ABC';
        }, givenNamedInterceptor('interceptor2'));
        await interceptorChain.invokeInterceptors();
        testlab_1.expect(events).to.eql([]);
    });
    it('passes bindings via context', async () => {
        givenInterceptorChain(async (context, next) => {
            context.bind('foo').to('1-req');
            await next();
            const foo = await context.get('foo');
            testlab_1.expect(foo).to.eql('2-res');
            context.bind('foo').to('1-res');
        }, async (context, next) => {
            const foo = await context.get('foo');
            testlab_1.expect(foo).to.eql('1-req');
            await next();
            context.bind('foo').to('2-res');
        });
        await interceptorChain.invokeInterceptors();
        const fooVal = await ctx.get('foo');
        testlab_1.expect(fooVal).to.eql('1-res');
    });
    it('catches error from the second interceptor', async () => {
        givenInterceptorChain(givenNamedInterceptor('interceptor1'), async (context, next) => {
            events.push('before-interceptor2');
            throw new Error('error in interceptor2');
        });
        const resultPromise = interceptorChain.invokeInterceptors();
        await testlab_1.expect(resultPromise).to.be.rejectedWith('error in interceptor2');
        testlab_1.expect(events).to.eql(['before-interceptor1', 'before-interceptor2']);
    });
    it('catches error from the first interceptor', async () => {
        givenInterceptorChain(async (context, next) => {
            events.push('before-interceptor1');
            await next();
            throw new Error('error in interceptor1');
        }, givenNamedInterceptor('interceptor2'));
        const resultPromise = interceptorChain.invokeInterceptors();
        await testlab_1.expect(resultPromise).to.be.rejectedWith('error in interceptor1');
        testlab_1.expect(events).to.eql([
            'before-interceptor1',
            'before-interceptor2',
            'after-interceptor2',
        ]);
    });
    it('allows discovery of interceptors in context', async () => {
        const interceptor1 = givenNamedInterceptor('interceptor1');
        const interceptor2 = givenNamedInterceptor('interceptor2');
        ctx.bind('interceptor2').to(interceptor2).tag('my-interceptor-tag');
        ctx.bind('interceptor1').to(interceptor1).tag('my-interceptor-tag');
        interceptorChain = new __1.GenericInterceptorChain(ctx, __1.filterByTag('my-interceptor-tag'));
        await interceptorChain.invokeInterceptors();
        testlab_1.expect(events).to.eql([
            'before-interceptor2',
            'before-interceptor1',
            'after-interceptor1',
            'after-interceptor2',
        ]);
    });
    it('allows discovery and sorting of interceptors in context', async () => {
        const interceptor1 = givenNamedInterceptor('interceptor1');
        const interceptor2 = givenNamedInterceptor('interceptor2');
        ctx
            .bind('interceptor2')
            .to(interceptor2)
            .tag('interceptor')
            .tag({ phase: 'p2' });
        ctx
            .bind('interceptor1')
            .to(interceptor1)
            .tag('interceptor')
            .tag({ phase: 'p1' });
        interceptorChain = new __1.GenericInterceptorChain(ctx, __1.filterByTag('interceptor'), __1.compareBindingsByTag('phase', ['p1', 'p2']));
        await interceptorChain.invokeInterceptors();
        testlab_1.expect(events).to.eql([
            'before-interceptor1',
            'before-interceptor2',
            'after-interceptor2',
            'after-interceptor1',
        ]);
    });
    it('can be used as an interceptor', async () => {
        givenInterceptorChain(givenNamedInterceptor('interceptor1'), async (context, next) => {
            await next();
            return 'ABC';
        });
        const interceptor = interceptorChain.asInterceptor();
        let invoked = false;
        await interceptor(new __1.Context(), () => {
            invoked = true;
            return invoked;
        });
        testlab_1.expect(invoked).to.be.true();
    });
    it('composes multiple interceptors as a single interceptor', async () => {
        const interceptor = __1.composeInterceptors(givenNamedInterceptor('interceptor1'), async (context, next) => {
            await next();
            return 'ABC';
        });
        let invoked = false;
        const result = await interceptor(new __1.Context(), () => {
            invoked = true;
            return invoked;
        });
        testlab_1.expect(invoked).to.be.true();
        testlab_1.expect(result).to.eql('ABC');
    });
    it('composes multiple interceptors or keys as a single interceptor', async () => {
        const binding = ctx
            .bind('interceptors.abc')
            .to(async (context, next) => {
            await next();
            return 'ABC';
        });
        const childCtx = new __1.Context(ctx);
        const interceptor = __1.composeInterceptors(givenNamedInterceptor('interceptor1'), binding.key);
        let invoked = false;
        const result = await interceptor(childCtx, () => {
            invoked = true;
            return invoked;
        });
        testlab_1.expect(invoked).to.be.true();
        testlab_1.expect(result).to.eql('ABC');
    });
    function givenContext() {
        events = [];
        ctx = new __1.Context();
    }
    function givenInterceptorChain(...interceptors) {
        interceptorChain = new __1.GenericInterceptorChain(ctx, interceptors);
    }
    function givenNamedInterceptor(name) {
        async function interceptor(context, next) {
            events.push(`before-${name}`);
            const result = await next();
            events.push(`after-${name}`);
            return result;
        }
        return interceptor;
    }
});
//# sourceMappingURL=interceptor-chain.unit.js.map