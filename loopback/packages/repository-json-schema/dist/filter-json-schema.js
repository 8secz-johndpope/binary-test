"use strict";
// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: @loopback/repository-json-schema
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldsJsonSchemaFor = exports.getWhereJsonSchemaFor = exports.getFilterJsonSchemaFor = exports.getScopeFilterJsonSchemaFor = exports.AnyScopeFilterSchema = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
exports.AnyScopeFilterSchema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {},
        additionalProperties: true,
    },
};
/**
 * Build a JSON schema describing the format of the "scope" object
 * used to query model instances.
 *
 * Note we don't take the model properties into account yet and return
 * a generic json schema allowing any "where" condition.
 *
 * @param modelCtor - The model constructor to build the filter schema for.
 */
function getScopeFilterJsonSchemaFor(modelCtor, options = {}) {
    let EmptyModel = class EmptyModel extends repository_1.Model {
    };
    EmptyModel = tslib_1.__decorate([
        repository_1.model({ settings: { strict: false } })
    ], EmptyModel);
    const schema = {
        ...getFilterJsonSchemaFor(EmptyModel, {
            setTitle: false,
        }),
        ...(options.setTitle !== false && {
            title: `${modelCtor.modelName}.ScopeFilter`,
        }),
    };
    // To include nested models, we need to hard-code the inclusion
    // filter schema for EmptyModel to allow any object query.
    schema.properties.include = { ...exports.AnyScopeFilterSchema };
    return schema;
}
exports.getScopeFilterJsonSchemaFor = getScopeFilterJsonSchemaFor;
/**
 * Build a JSON schema describing the format of the "filter" object
 * used to query model instances.
 *
 * Note we don't take the model properties into account yet and return
 * a generic json schema allowing any "where" condition.
 *
 * @param modelCtor - The model constructor to build the filter schema for.
 * @param options - Options to build the filter schema.
 */
function getFilterJsonSchemaFor(modelCtor, options = {}) {
    var _a;
    let excluded;
    if (typeof options.exclude === 'string') {
        excluded = [options.exclude];
    }
    else {
        excluded = (_a = options.exclude) !== null && _a !== void 0 ? _a : [];
    }
    const properties = {
        offset: {
            type: 'integer',
            minimum: 0,
        },
        limit: {
            type: 'integer',
            minimum: 1,
            examples: [100],
        },
        skip: {
            type: 'integer',
            minimum: 0,
        },
        order: {
            oneOf: [
                {
                    type: 'string',
                },
                {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
            ],
        },
    };
    if (!excluded.includes('where')) {
        properties.where = getWhereJsonSchemaFor(modelCtor, options);
    }
    if (!excluded.includes('fields')) {
        properties.fields = getFieldsJsonSchemaFor(modelCtor, options);
    }
    // Remove excluded properties
    for (const p of excluded) {
        delete properties[p];
    }
    const schema = {
        ...(options.setTitle !== false && {
            title: `${modelCtor.modelName}.Filter`,
        }),
        properties,
        additionalProperties: false,
    };
    const modelRelations = repository_1.getModelRelations(modelCtor);
    const hasRelations = Object.keys(modelRelations).length > 0;
    if (hasRelations && !excluded.includes('include')) {
        schema.properties.include = {
            ...(options.setTitle !== false && {
                title: `${modelCtor.modelName}.IncludeFilter`,
            }),
            type: 'array',
            items: {
                ...(options.setTitle !== false && {
                    title: `${modelCtor.modelName}.IncludeFilter.Items`,
                }),
                type: 'object',
                properties: {
                    // TODO(bajtos) restrict values to relations defined by "model"
                    relation: { type: 'string' },
                    // TODO(bajtos) describe the filter for the relation target model
                    scope: getScopeFilterJsonSchemaFor(modelCtor, options),
                },
            },
        };
    }
    return schema;
}
exports.getFilterJsonSchemaFor = getFilterJsonSchemaFor;
/**
 * Build a JSON schema describing the format of the "where" object
 * used to filter model instances to query, update or delete.
 *
 * Note we don't take the model properties into account yet and return
 * a generic json schema allowing any "where" condition.
 *
 * @param modelCtor - The model constructor to build the filter schema for.
 */
function getWhereJsonSchemaFor(modelCtor, options = {}) {
    const schema = {
        ...(options.setTitle !== false && {
            title: `${modelCtor.modelName}.WhereFilter`,
        }),
        type: 'object',
        // TODO(bajtos) enumerate "model" properties and operators like "and"
        // See https://github.com/strongloop/loopback-next/issues/1748
        additionalProperties: true,
    };
    return schema;
}
exports.getWhereJsonSchemaFor = getWhereJsonSchemaFor;
/**
 * Build a JSON schema describing the format of the "fields" object
 * used to include or exclude properties of model instances.
 *
 * @param modelCtor - The model constructor to build the filter schema for.
 */
function getFieldsJsonSchemaFor(modelCtor, options = {}) {
    const schema = {
        ...(options.setTitle !== false && {
            title: `${modelCtor.modelName}.Fields`,
        }),
        type: 'object',
        properties: Object.assign({}, ...Object.keys(modelCtor.definition.properties).map(k => ({
            [k]: { type: 'boolean' },
        }))),
        additionalProperties: modelCtor.definition.settings.strict === false,
    };
    return schema;
}
exports.getFieldsJsonSchemaFor = getFieldsJsonSchemaFor;
//# sourceMappingURL=filter-json-schema.js.map