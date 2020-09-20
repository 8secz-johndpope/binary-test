"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const interceptor_1 = require("../../interceptor");
const unique_id_1 = require("../../unique-id");
describe('mergeInterceptors', () => {
    it('removes duplicate entries from the spec', () => {
        assertMergeAsExpected(['log'], ['cache', 'log'], ['cache', 'log']);
        assertMergeAsExpected(['log'], ['log', 'cache'], ['log', 'cache']);
    });
    it('allows empty array for interceptors', () => {
        assertMergeAsExpected([], ['cache', 'log'], ['cache', 'log']);
        assertMergeAsExpected(['cache', 'log'], [], ['cache', 'log']);
    });
    it('joins two arrays for interceptors', () => {
        assertMergeAsExpected(['cache'], ['log'], ['cache', 'log']);
    });
    function assertMergeAsExpected(interceptorsFromSpec, existingInterceptors, expectedResult) {
        testlab_1.expect(__1.mergeInterceptors(interceptorsFromSpec, existingInterceptors)).to.eql(expectedResult);
    }
});
describe('globalInterceptors', () => {
    let ctx;
    const logInterceptor = async (context, next) => {
        await next();
    };
    const authInterceptor = async (context, next) => {
        await next();
    };
    beforeEach(givenContext);
    it('sorts by group', () => {
        ctx
            .bind(__1.ContextBindings.GLOBAL_INTERCEPTOR_ORDERED_GROUPS)
            .to(['log', 'auth']);
        ctx
            .bind('globalInterceptors.authInterceptor')
            .to(authInterceptor)
            .apply(__1.asGlobalInterceptor('auth'));
        ctx
            .bind('globalInterceptors.logInterceptor')
            .to(logInterceptor)
            .apply(__1.asGlobalInterceptor('log'));
        const invocationCtx = givenInvocationContext();
        const keys = invocationCtx.getGlobalInterceptorBindingKeys();
        testlab_1.expect(keys).to.eql([
            'globalInterceptors.logInterceptor',
            'globalInterceptors.authInterceptor',
        ]);
    });
    it('sorts by group - unknown group comes before known ones', () => {
        ctx
            .bind(__1.ContextBindings.GLOBAL_INTERCEPTOR_ORDERED_GROUPS)
            .to(['log', 'auth']);
        ctx
            .bind('globalInterceptors.authInterceptor')
            .to(authInterceptor)
            .apply(__1.asGlobalInterceptor('auth'));
        ctx
            .bind('globalInterceptors.logInterceptor')
            .to(logInterceptor)
            .apply(__1.asGlobalInterceptor('unknown'));
        const invocationCtx = givenInvocationContext();
        const keys = invocationCtx.getGlobalInterceptorBindingKeys();
        testlab_1.expect(keys).to.eql([
            'globalInterceptors.logInterceptor',
            'globalInterceptors.authInterceptor',
        ]);
    });
    it('sorts by group alphabetically without ordered group', () => {
        interceptor_1.registerInterceptor(ctx, authInterceptor, {
            global: true,
            name: 'authInterceptor',
            group: 'auth',
        });
        interceptor_1.registerInterceptor(ctx, logInterceptor, {
            global: true,
            group: 'log',
            name: 'logInterceptor',
        });
        const invocationCtx = givenInvocationContext();
        const keys = invocationCtx.getGlobalInterceptorBindingKeys();
        testlab_1.expect(keys).to.eql([
            'globalInterceptors.authInterceptor',
            'globalInterceptors.logInterceptor',
        ]);
    });
    // See https://v8.dev/blog/array-sort
    function isSortStable() {
        // v8 7.0 or above
        return +process.versions.v8.split('.')[0] >= 7;
    }
    testlab_1.skipIf(!isSortStable(), it, 'sorts by binding order without group tags', async () => {
        interceptor_1.registerInterceptor(ctx, authInterceptor, {
            global: true,
            name: 'authInterceptor',
        });
        interceptor_1.registerInterceptor(ctx, logInterceptor, {
            global: true,
            name: 'logInterceptor',
        });
        const invocationCtx = givenInvocationContext();
        const keys = invocationCtx.getGlobalInterceptorBindingKeys();
        testlab_1.expect(keys).to.eql([
            'globalInterceptors.authInterceptor',
            'globalInterceptors.logInterceptor',
        ]);
    });
    it('applies asGlobalInterceptor', () => {
        const binding = ctx
            .bind('globalInterceptors.authInterceptor')
            .to(authInterceptor)
            .apply(__1.asGlobalInterceptor('auth'));
        testlab_1.expect(binding.tagMap).to.eql({
            [__1.ContextTags.NAMESPACE]: __1.GLOBAL_INTERCEPTOR_NAMESPACE,
            [__1.ContextTags.GLOBAL_INTERCEPTOR]: __1.ContextTags.GLOBAL_INTERCEPTOR,
            [__1.ContextTags.GLOBAL_INTERCEPTOR_GROUP]: 'auth',
        });
    });
    it('supports @globalInterceptor', () => {
        let MyAuthInterceptor = class MyAuthInterceptor {
            value() {
                return authInterceptor;
            }
        };
        MyAuthInterceptor = tslib_1.__decorate([
            __1.globalInterceptor('auth', {
                tags: { [__1.ContextTags.NAME]: 'my-auth-interceptor' },
            })
        ], MyAuthInterceptor);
        const binding = __1.createBindingFromClass(MyAuthInterceptor);
        testlab_1.expect(binding.tagMap).to.eql({
            [__1.ContextTags.TYPE]: 'provider',
            [__1.ContextTags.PROVIDER]: 'provider',
            [__1.ContextTags.NAMESPACE]: __1.GLOBAL_INTERCEPTOR_NAMESPACE,
            [__1.ContextTags.GLOBAL_INTERCEPTOR]: __1.ContextTags.GLOBAL_INTERCEPTOR,
            [__1.ContextTags.GLOBAL_INTERCEPTOR_GROUP]: 'auth',
            [__1.ContextTags.NAME]: 'my-auth-interceptor',
        });
    });
    it('includes interceptors that match the source type', () => {
        interceptor_1.registerInterceptor(ctx, authInterceptor, {
            global: true,
            group: 'auth',
            source: 'route',
            name: 'authInterceptor',
        });
        interceptor_1.registerInterceptor(ctx, logInterceptor, {
            global: true,
            group: 'log',
            name: 'logInterceptor',
        });
        const invocationCtx = givenInvocationContext('route');
        const keys = invocationCtx.getGlobalInterceptorBindingKeys();
        testlab_1.expect(keys).to.eql([
            'globalInterceptors.authInterceptor',
            'globalInterceptors.logInterceptor',
        ]);
    });
    it('excludes interceptors that do not match the source type', () => {
        interceptor_1.registerInterceptor(ctx, authInterceptor, {
            global: true,
            group: 'auth',
            source: 'route',
            name: 'authInterceptor',
        });
        interceptor_1.registerInterceptor(ctx, logInterceptor, {
            global: true,
            group: 'log',
            name: 'logInterceptor',
        });
        const invocationCtx = givenInvocationContext('proxy');
        const keys = invocationCtx.getGlobalInterceptorBindingKeys();
        testlab_1.expect(keys).to.eql(['globalInterceptors.logInterceptor']);
    });
    it('excludes interceptors that do not match the source type - with array', () => {
        interceptor_1.registerInterceptor(ctx, authInterceptor, {
            global: true,
            group: 'auth',
            source: 'route',
            name: 'authInterceptor',
        });
        interceptor_1.registerInterceptor(ctx, logInterceptor, {
            global: true,
            group: 'log',
            source: ['route', 'proxy'],
            name: 'logInterceptor',
        });
        const invocationCtx = givenInvocationContext('proxy');
        const keys = invocationCtx.getGlobalInterceptorBindingKeys();
        testlab_1.expect(keys).to.eql(['globalInterceptors.logInterceptor']);
    });
    it('infers binding key from the interceptor function', () => {
        const binding = interceptor_1.registerInterceptor(ctx, logInterceptor);
        testlab_1.expect(binding.key).to.eql('interceptors.logInterceptor');
    });
    it('generates binding key for the interceptor function', () => {
        const binding = interceptor_1.registerInterceptor(ctx, () => undefined);
        testlab_1.expect(binding.key).to.match(new RegExp(`interceptors.${unique_id_1.UNIQUE_ID_PATTERN.source}`, 'i'));
    });
    class MyController {
        greet(name) {
            return `Hello, ${name}`;
        }
    }
    function givenContext() {
        ctx = new __1.Context();
    }
    function givenInvocationContext(source) {
        let invocationSource = undefined;
        if (source != null) {
            invocationSource = {
                type: source,
                value: source,
            };
        }
        return new __1.InterceptedInvocationContext(ctx, new MyController(), 'greet', ['John'], invocationSource);
    }
});
//# sourceMappingURL=interceptor.unit.js.map