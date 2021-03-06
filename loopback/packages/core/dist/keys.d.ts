import { BindingKey } from '@loopback/context';
import { Application, ApplicationConfig, ApplicationMetadata, ControllerClass } from './application';
import { LifeCycleObserverOptions, LifeCycleObserverRegistry } from './lifecycle-registry';
/**
 * Namespace for core binding keys
 */
export declare namespace CoreBindings {
    /**
     * Binding key for application instance itself
     */
    const APPLICATION_INSTANCE: BindingKey<Application>;
    /**
     * Binding key for application configuration
     */
    const APPLICATION_CONFIG: BindingKey<ApplicationConfig>;
    /**
     * Binding key for the content of `package.json`
     */
    const APPLICATION_METADATA: BindingKey<ApplicationMetadata>;
    /**
     * Binding key for servers
     */
    const SERVERS = "servers";
    /**
     * Binding key for components
     */
    const COMPONENTS = "components";
    const CONTROLLERS = "controllers";
    /**
     * Binding key for the controller class resolved in the current request
     * context
     */
    const CONTROLLER_CLASS: BindingKey<ControllerClass>;
    /**
     * Binding key for the controller method resolved in the current request
     * context
     */
    const CONTROLLER_METHOD_NAME: BindingKey<string>;
    /**
     * Binding key for the controller method metadata resolved in the current
     * request context
     */
    const CONTROLLER_METHOD_META = "controller.method.meta";
    /**
     * Binding key for the controller instance resolved in the current request
     * context
     */
    const CONTROLLER_CURRENT: BindingKey<unknown>;
    const LIFE_CYCLE_OBSERVERS = "lifeCycleObservers";
    /**
     * Binding key for life cycle observer options
     */
    const LIFE_CYCLE_OBSERVER_REGISTRY: BindingKey<LifeCycleObserverRegistry>;
    /**
     * Binding key for life cycle observer options
     */
    const LIFE_CYCLE_OBSERVER_OPTIONS: BindingKey<LifeCycleObserverOptions>;
}
export declare namespace CoreTags {
    /**
     * Binding tag for components
     */
    const COMPONENT = "component";
    /**
     * Binding tag for servers
     */
    const SERVER = "server";
    /**
     * Binding tag for controllers
     */
    const CONTROLLER = "controller";
    /**
     * Binding tag for services
     */
    const SERVICE = "service";
    /**
     * Binding tag for the service interface
     */
    const SERVICE_INTERFACE = "serviceInterface";
    /**
     * Binding tag for life cycle observers
     */
    const LIFE_CYCLE_OBSERVER = "lifeCycleObserver";
    /**
     * Binding tag for group name of life cycle observers
     */
    const LIFE_CYCLE_OBSERVER_GROUP = "lifeCycleObserverGroup";
    /**
     * Binding tag for extensions to specify name of the extension point that an
     * extension contributes to.
     */
    const EXTENSION_FOR = "extensionFor";
    /**
     * Binding tag for an extension point to specify name of the extension point
     */
    const EXTENSION_POINT = "extensionPoint";
}
