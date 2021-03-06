import { ConfigurationResolver } from './binding-config';
import { BindingKey } from './binding-key';
/**
 * Namespace for context tags
 */
export declare namespace ContextTags {
    const CLASS = "class";
    const PROVIDER = "provider";
    const DYNAMIC_VALUE_PROVIDER = "dynamicValueProvider";
    /**
     * Type of the artifact
     */
    const TYPE = "type";
    /**
     * Namespace of the artifact
     */
    const NAMESPACE = "namespace";
    /**
     * Name of the artifact
     */
    const NAME = "name";
    /**
     * Binding key for the artifact
     */
    const KEY = "key";
    /**
     * Binding tag to associate a configuration binding with the target binding key
     */
    const CONFIGURATION_FOR = "configurationFor";
    /**
     * Binding tag for global interceptors
     */
    const GLOBAL_INTERCEPTOR = "globalInterceptor";
    /**
     * Binding tag for global interceptors to specify sources of invocations that
     * the interceptor should apply. The tag value can be a string or string[], such
     * as `'route'` or `['route', 'proxy']`.
     */
    const GLOBAL_INTERCEPTOR_SOURCE = "globalInterceptorSource";
    /**
     * Binding tag for group name of global interceptors
     */
    const GLOBAL_INTERCEPTOR_GROUP = "globalInterceptorGroup";
}
/**
 * Default namespace for global interceptors
 */
export declare const GLOBAL_INTERCEPTOR_NAMESPACE = "globalInterceptors";
/**
 * Default namespace for local interceptors
 */
export declare const LOCAL_INTERCEPTOR_NAMESPACE = "interceptors";
/**
 * Namespace for context bindings
 */
export declare namespace ContextBindings {
    /**
     * Binding key for ConfigurationResolver
     */
    const CONFIGURATION_RESOLVER: BindingKey<ConfigurationResolver>;
    /**
     * Binding key for ordered groups of global interceptors
     */
    const GLOBAL_INTERCEPTOR_ORDERED_GROUPS: BindingKey<string[]>;
}
