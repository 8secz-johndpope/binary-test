import { Binding, BindingAddress, Constructor, Context, Provider } from '@loopback/core';
import { ExpressMiddlewareFactory, ExpressRequestHandler, Middleware, MiddlewareBindingOptions } from './types';
import * as loopbackContext from '@loopback/core';
/**
 * A context that allows middleware registration
 */
export interface MiddlewareRegistry {
    /**
     * Bind an Express middleware to this server context
     *
     * @example
     * ```ts
     * import myExpressMiddlewareFactory from 'my-express-middleware';
     * const myExpressMiddlewareConfig= {};
     * const myExpressMiddleware = myExpressMiddlewareFactory(myExpressMiddlewareConfig);
     * server.expressMiddleware('middleware.express.my', myExpressMiddleware);
     * // Or
     * server.expressMiddleware('middleware.express.my', [myExpressMiddleware]);
     * ```
     * @param key - Middleware binding key
     * @param middleware - Express middleware handler function(s)
     *
     */
    expressMiddleware(key: BindingAddress, middleware: ExpressRequestHandler | ExpressRequestHandler[], options?: MiddlewareBindingOptions): Binding<Middleware>;
    /**
     * Bind an Express middleware to this server context
     *
     * @example
     * ```ts
     * import myExpressMiddlewareFactory from 'my-express-middleware';
     * const myExpressMiddlewareConfig= {};
     * server.expressMiddleware(myExpressMiddlewareFactory, myExpressMiddlewareConfig);
     * ```
     * @param middlewareFactory - Middleware module name or factory function
     * @param middlewareConfig - Middleware config
     * @param options - Options for registration
     *
     * @typeParam CFG - Configuration type
     */
    expressMiddleware<CFG>(middlewareFactory: ExpressMiddlewareFactory<CFG>, middlewareConfig?: CFG, options?: MiddlewareBindingOptions): Binding<Middleware>;
    /**
     * Register a middleware function or provider class
     *
     * @example
     * ```ts
     * const log: Middleware = async (requestCtx, next) {
     *   // ...
     * }
     * server.middleware(log);
     * ```
     *
     * @param middleware - Middleware function or provider class
     * @param options - Middleware binding options
     */
    middleware(middleware: Middleware | Constructor<Provider<Middleware>>, options?: MiddlewareBindingOptions): Binding<Middleware>;
}
declare const BaseMiddlewareRegistry_base: {
    new (...args: any[]): {
        expressMiddleware(key: BindingAddress<unknown>, middleware: ExpressRequestHandler | ExpressRequestHandler[], options?: MiddlewareBindingOptions | undefined): Binding<Middleware>;
        expressMiddleware<CFG>(middlewareFactory: ExpressMiddlewareFactory<CFG>, middlewareConfig?: CFG | undefined, options?: MiddlewareBindingOptions | undefined): Binding<Middleware>;
        expressMiddleware<CFG_1>(factoryOrKey: string | loopbackContext.BindingKey<Middleware> | ExpressMiddlewareFactory<CFG_1>, configOrHandler: ExpressRequestHandler | ExpressRequestHandler[] | CFG_1, options?: MiddlewareBindingOptions | undefined): Binding<Middleware>;
        middleware(middleware: Middleware | Constructor<Provider<Middleware>>, options?: MiddlewareBindingOptions): Binding<Middleware>;
        readonly name: string;
        readonly subscriptionManager: loopbackContext.ContextSubscriptionManager;
        readonly parent: Context | undefined;
        emitEvent: <T extends loopbackContext.ContextEvent>(type: string, event: T) => void;
        emitError: (err: unknown) => void;
        bind: <ValueType = any>(key: BindingAddress<ValueType>) => Binding<ValueType>;
        add: (binding: Binding<unknown>) => Context;
        configure: <ConfigValueType = any>(key?: string | loopbackContext.BindingKey<unknown> | undefined) => Binding<ConfigValueType>;
        getConfigAsValueOrPromise: <ConfigValueType_1>(key: BindingAddress<unknown>, propertyPath?: string | undefined, resolutionOptions?: loopbackContext.ResolutionOptions | undefined) => loopbackContext.ValueOrPromise<ConfigValueType_1 | undefined>;
        getConfig: <ConfigValueType_2>(key: BindingAddress<unknown>, propertyPath?: string | undefined, resolutionOptions?: loopbackContext.ResolutionOptions | undefined) => Promise<ConfigValueType_2 | undefined>;
        getConfigSync: <ConfigValueType_3>(key: BindingAddress<unknown>, propertyPath?: string | undefined, resolutionOptions?: loopbackContext.ResolutionOptions | undefined) => ConfigValueType_3 | undefined;
        unbind: (key: BindingAddress<unknown>) => boolean;
        subscribe: (observer: loopbackContext.ContextEventObserver) => loopbackContext.Subscription;
        unsubscribe: (observer: loopbackContext.ContextEventObserver) => boolean;
        close: () => void;
        isSubscribed: (observer: loopbackContext.ContextObserver) => boolean;
        createView: <T_1 = unknown>(filter: loopbackContext.BindingFilter, comparator?: loopbackContext.BindingComparator | undefined) => loopbackContext.ContextView<T_1>;
        contains: (key: BindingAddress<unknown>) => boolean;
        isBound: (key: BindingAddress<unknown>) => boolean;
        getOwnerContext: (key: BindingAddress<unknown>) => Context | undefined;
        find: <ValueType_1 = any>(pattern?: string | RegExp | loopbackContext.BindingFilter | undefined) => Readonly<Binding<ValueType_1>>[];
        findByTag: <ValueType_2 = any>(tagFilter: string | RegExp | Record<string, any>) => Readonly<Binding<ValueType_2>>[];
        get: {
            <ValueType_3>(keyWithPath: BindingAddress<ValueType_3>, session?: loopbackContext.ResolutionSession | undefined): Promise<ValueType_3>;
            <ValueType_4>(keyWithPath: BindingAddress<ValueType_4>, options: loopbackContext.ResolutionOptions): Promise<ValueType_4 | undefined>;
        };
        getSync: {
            <ValueType_5>(keyWithPath: BindingAddress<ValueType_5>, session?: loopbackContext.ResolutionSession | undefined): ValueType_5;
            <ValueType_6>(keyWithPath: BindingAddress<ValueType_6>, options?: loopbackContext.ResolutionOptions | undefined): ValueType_6 | undefined;
        };
        getBinding: {
            <ValueType_7 = any>(key: BindingAddress<ValueType_7>): Binding<ValueType_7>;
            <ValueType_8>(key: BindingAddress<ValueType_8>, options?: {
                optional?: boolean | undefined;
            } | undefined): Binding<ValueType_8> | undefined;
        };
        findOrCreateBinding: <T_2>(key: BindingAddress<T_2>, policy?: loopbackContext.BindingCreationPolicy | undefined) => Binding<T_2>;
        getValueOrPromise: <ValueType_9>(keyWithPath: BindingAddress<ValueType_9>, optionsOrSession?: loopbackContext.ResolutionSession | loopbackContext.ResolutionOptions | undefined) => loopbackContext.ValueOrPromise<ValueType_9 | undefined>;
        toJSON: () => loopbackContext.JSONObject;
        inspect: (options?: loopbackContext.ContextInspectOptions | undefined) => loopbackContext.JSONObject;
        on: {
            (eventName: "bind" | "unbind", listener: loopbackContext.ContextEventListener): Context;
            (event: string | symbol, listener: (...args: any[]) => void): Context;
        };
        once: {
            (eventName: "bind" | "unbind", listener: loopbackContext.ContextEventListener): Context;
            (event: string | symbol, listener: (...args: any[]) => void): Context;
        };
        addListener: (event: string | symbol, listener: (...args: any[]) => void) => Context;
        prependListener: (event: string | symbol, listener: (...args: any[]) => void) => Context;
        prependOnceListener: (event: string | symbol, listener: (...args: any[]) => void) => Context;
        removeListener: (event: string | symbol, listener: (...args: any[]) => void) => Context;
        off: (event: string | symbol, listener: (...args: any[]) => void) => Context;
        removeAllListeners: (event?: string | symbol | undefined) => Context;
        setMaxListeners: (n: number) => Context;
        getMaxListeners: () => number;
        listeners: (event: string | symbol) => Function[];
        rawListeners: (event: string | symbol) => Function[];
        emit: (event: string | symbol, ...args: any[]) => boolean;
        eventNames: () => (string | symbol)[];
        listenerCount: (type: string | symbol) => number;
    };
} & typeof Context;
/**
 * Base Context that provides APIs to register middleware
 */
export declare abstract class BaseMiddlewareRegistry extends BaseMiddlewareRegistry_base {
}
export {};
