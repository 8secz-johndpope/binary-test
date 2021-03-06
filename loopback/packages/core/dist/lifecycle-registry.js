"use strict";
// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeCycleObserverRegistry = exports.DEFAULT_ORDERED_GROUPS = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const keys_1 = require("./keys");
const lifecycle_1 = require("./lifecycle");
const debugFactory = require("debug");
const debug = debugFactory('loopback:core:lifecycle');
exports.DEFAULT_ORDERED_GROUPS = ['server'];
/**
 * A context-based registry for life cycle observers
 */
let LifeCycleObserverRegistry = class LifeCycleObserverRegistry {
    constructor(observersView, options = {
        parallel: true,
        orderedGroups: exports.DEFAULT_ORDERED_GROUPS,
    }) {
        this.observersView = observersView;
        this.options = options;
    }
    setOrderedGroups(groups) {
        this.options.orderedGroups = groups;
    }
    /**
     * Get observer groups ordered by the group
     */
    getObserverGroupsByOrder() {
        const bindings = this.observersView.bindings;
        const groups = this.sortObserverBindingsByGroup(bindings);
        if (debug.enabled) {
            debug('Observer groups: %j', groups.map(g => ({
                group: g.group,
                bindings: g.bindings.map(b => b.key),
            })));
        }
        return groups;
    }
    /**
     * Get the group for a given life cycle observer binding
     * @param binding - Life cycle observer binding
     */
    getObserverGroup(binding) {
        // First check if there is an explicit group name in the tag
        let group = binding.tagMap[keys_1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP];
        if (!group) {
            // Fall back to a tag that matches one of the groups
            group = this.options.orderedGroups.find(g => binding.tagMap[g] === g);
        }
        group = group || '';
        debug('Binding %s is configured with observer group %s', binding.key, group);
        return group;
    }
    /**
     * Sort the life cycle observer bindings so that we can start/stop them
     * in the right order. By default, we can start other observers before servers
     * and stop them in the reverse order
     * @param bindings - Life cycle observer bindings
     */
    sortObserverBindingsByGroup(bindings) {
        // Group bindings in a map
        const groupMap = new Map();
        context_1.sortBindingsByPhase(bindings, keys_1.CoreTags.LIFE_CYCLE_OBSERVER_GROUP, this.options.orderedGroups);
        for (const binding of bindings) {
            const group = this.getObserverGroup(binding);
            let bindingsInGroup = groupMap.get(group);
            if (bindingsInGroup == null) {
                bindingsInGroup = [];
                groupMap.set(group, bindingsInGroup);
            }
            bindingsInGroup.push(binding);
        }
        // Create an array for group entries
        const groups = [];
        for (const [group, bindingsInGroup] of groupMap) {
            groups.push({ group, bindings: bindingsInGroup });
        }
        return groups;
    }
    /**
     * Notify an observer group of the given event
     * @param group - A group of bindings for life cycle observers
     * @param event - Event name
     */
    async notifyObservers(observers, bindings, event) {
        if (!this.options.parallel) {
            let index = 0;
            for (const observer of observers) {
                debug('Invoking %s observer for binding %s', event, bindings[index].key);
                index++;
                await this.invokeObserver(observer, event);
            }
            return;
        }
        // Parallel invocation
        const notifiers = observers.map((observer, index) => {
            debug('Invoking %s observer for binding %s', event, bindings[index].key);
            return this.invokeObserver(observer, event);
        });
        await Promise.all(notifiers);
    }
    /**
     * Invoke an observer for the given event
     * @param observer - A life cycle observer
     * @param event - Event name
     */
    async invokeObserver(observer, event) {
        if (typeof observer[event] === 'function') {
            await observer[event]();
        }
    }
    /**
     * Emit events to the observer groups
     * @param events - Event names
     * @param groups - Observer groups
     */
    async notifyGroups(events, groups, reverse = false) {
        const observers = await this.observersView.values();
        const bindings = this.observersView.bindings;
        if (reverse) {
            // Do not reverse the original `groups` in place
            groups = [...groups].reverse();
        }
        for (const group of groups) {
            const observersForGroup = [];
            const bindingsInGroup = reverse
                ? group.bindings.reverse()
                : group.bindings;
            for (const binding of bindingsInGroup) {
                const index = bindings.indexOf(binding);
                observersForGroup.push(observers[index]);
            }
            for (const event of events) {
                debug('Beginning notification %s of %s...', event);
                await this.notifyObservers(observersForGroup, group.bindings, event);
                debug('Finished notification %s of %s', event);
            }
        }
    }
    /**
     * Notify all life cycle observers by group of `start`
     */
    async start() {
        debug('Starting the %s...');
        const groups = this.getObserverGroupsByOrder();
        await this.notifyGroups(['start'], groups);
    }
    /**
     * Notify all life cycle observers by group of `stop`
     */
    async stop() {
        debug('Stopping the %s...');
        const groups = this.getObserverGroupsByOrder();
        // Stop in the reverse order
        await this.notifyGroups(['stop'], groups, true);
    }
};
LifeCycleObserverRegistry = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject.view(lifecycle_1.lifeCycleObserverFilter)),
    tslib_1.__param(1, context_1.inject(keys_1.CoreBindings.LIFE_CYCLE_OBSERVER_OPTIONS, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [context_1.ContextView, Object])
], LifeCycleObserverRegistry);
exports.LifeCycleObserverRegistry = LifeCycleObserverRegistry;
//# sourceMappingURL=lifecycle-registry.js.map