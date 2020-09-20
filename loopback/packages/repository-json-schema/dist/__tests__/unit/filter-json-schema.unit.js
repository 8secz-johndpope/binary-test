"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/repository-json-schema
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const ajv_1 = tslib_1.__importDefault(require("ajv"));
const filter_json_schema_1 = require("../../filter-json-schema");
describe('getFilterJsonSchemaFor', () => {
    let ajv;
    let customerFilterSchema;
    let customerFilterExcludingWhereSchema;
    let customerFilterExcludingIncludeSchema;
    let orderFilterSchema;
    beforeEach(() => {
        ajv = new ajv_1.default();
        customerFilterSchema = filter_json_schema_1.getFilterJsonSchemaFor(Customer);
        customerFilterExcludingWhereSchema = filter_json_schema_1.getFilterJsonSchemaFor(Customer, {
            exclude: ['where'],
        });
        customerFilterExcludingIncludeSchema = filter_json_schema_1.getFilterJsonSchemaFor(Customer, {
            exclude: ['include'],
        });
        orderFilterSchema = filter_json_schema_1.getFilterJsonSchemaFor(Order);
    });
    it('produces a valid schema', () => {
        const isValid = ajv.validateSchema(customerFilterSchema);
        const SUCCESS_MSG = 'Filter schema is a valid JSON Schema';
        const result = isValid ? SUCCESS_MSG : ajv.errorsText(ajv.errors);
        testlab_1.expect(result).to.equal(SUCCESS_MSG);
    });
    it('allows an empty filter', () => {
        expectSchemaToAllowFilter(customerFilterSchema, {});
    });
    it('allows a string-based order', () => {
        expectSchemaToAllowFilter(customerFilterSchema, { order: 'id DESC' });
    });
    it('allows a array-based order', () => {
        expectSchemaToAllowFilter(customerFilterSchema, { order: ['id DESC'] });
    });
    it('allows all top-level filter properties', () => {
        const filter = {
            where: { id: 1 },
            fields: { id: true, name: true },
            include: [{ relation: 'orders' }],
            offset: 0,
            limit: 10,
            order: ['id DESC'],
            skip: 0,
        };
        expectSchemaToAllowFilter(customerFilterSchema, filter);
    });
    it('disallows "where"', () => {
        var _a;
        const filter = { where: { name: 'John' } };
        ajv.validate(customerFilterExcludingWhereSchema, filter);
        testlab_1.expect((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'additionalProperties',
                dataPath: '',
                schemaPath: '#/additionalProperties',
                params: { additionalProperty: 'where' },
                message: 'should NOT have additional properties',
            },
        ]);
    });
    it('disallows "include"', () => {
        var _a;
        const filter = { include: 'orders' };
        ajv.validate(customerFilterExcludingIncludeSchema, filter);
        testlab_1.expect((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'additionalProperties',
                dataPath: '',
                schemaPath: '#/additionalProperties',
                params: { additionalProperty: 'include' },
                message: 'should NOT have additional properties',
            },
        ]);
    });
    it('describes "where" as an object', () => {
        var _a;
        const filter = { where: 'invalid-where' };
        ajv.validate(customerFilterSchema, filter);
        testlab_1.expect((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                dataPath: '.where',
                message: 'should be object',
            },
        ]);
    });
    it('describes "fields" as an object', () => {
        var _a;
        const filter = { fields: 'invalid-fields' };
        ajv.validate(customerFilterSchema, filter);
        testlab_1.expect((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                dataPath: '.fields',
                message: 'should be object',
            },
        ]);
    });
    it('describes "include" as an array for models with relations', () => {
        var _a;
        const filter = { include: 'invalid-include' };
        ajv.validate(customerFilterSchema, filter);
        testlab_1.expect((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                dataPath: '.include',
                message: 'should be array',
            },
        ]);
    });
    it('leaves out "include" for models with no relations', () => {
        var _a;
        const filterProperties = Object.keys((_a = orderFilterSchema.properties) !== null && _a !== void 0 ? _a : {});
        testlab_1.expect(filterProperties).to.not.containEql('include');
    });
    it('describes "offset" as an integer', () => {
        var _a;
        const filter = { offset: 'invalid-offset' };
        ajv.validate(customerFilterSchema, filter);
        testlab_1.expect((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                dataPath: '.offset',
                message: 'should be integer',
            },
        ]);
    });
    it('describes "limit" as an integer', () => {
        var _a;
        const filter = { limit: 'invalid-limit' };
        ajv.validate(customerFilterSchema, filter);
        testlab_1.expect((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                dataPath: '.limit',
                message: 'should be integer',
            },
        ]);
    });
    it('describes "skip" as an integer', () => {
        var _a;
        const filter = { skip: 'invalid-skip' };
        ajv.validate(customerFilterSchema, filter);
        testlab_1.expect((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                dataPath: '.skip',
                message: 'should be integer',
            },
        ]);
    });
    it('describes "order" as a string or array', () => {
        var _a;
        const filter = { order: { invalidOrder: '' } };
        ajv.validate(customerFilterSchema, filter);
        testlab_1.expect((_a = ajv.errors) !== null && _a !== void 0 ? _a : []).to.containDeep([
            {
                keyword: 'type',
                dataPath: '.order',
                message: 'should be string',
            },
            {
                keyword: 'type',
                dataPath: '.order',
                message: 'should be array',
            },
            {
                keyword: 'oneOf',
                dataPath: '.order',
                params: { passingSchemas: null },
                message: 'should match exactly one schema in oneOf',
            },
        ]);
    });
    it('returns "title" when no options were provided', () => {
        testlab_1.expect(orderFilterSchema.title).to.equal('Order.Filter');
    });
    it('returns "include.title" when no options were provided', () => {
        testlab_1.expect(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'title')
            .to.equal('Customer.IncludeFilter');
    });
    it('returns "include.items.title" when no options were provided', () => {
        testlab_1.expect(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'items', 'title')
            .to.equal('Customer.IncludeFilter.Items');
    });
    it('returns "scope.title" when no options were provided', () => {
        testlab_1.expect(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'items', 'properties', 'scope', 'title')
            .to.equal('Customer.ScopeFilter');
    });
    function expectSchemaToAllowFilter(schema, value) {
        const isValid = ajv.validate(schema, value);
        const SUCCESS_MSG = 'Filter instance is valid according to Filter schema';
        const result = isValid ? SUCCESS_MSG : ajv.errorsText(ajv.errors);
        testlab_1.expect(result).to.equal(SUCCESS_MSG);
    }
});
describe('getFilterJsonSchemaFor - excluding where', () => {
    let customerFilterSchema;
    it('excludes "where" using string[]', () => {
        customerFilterSchema = filter_json_schema_1.getFilterJsonSchemaFor(Customer, {
            exclude: ['where'],
        });
        testlab_1.expect(customerFilterSchema.properties).to.not.have.property('where');
    });
    it('excludes "where" using string', () => {
        customerFilterSchema = filter_json_schema_1.getFilterJsonSchemaFor(Customer, {
            exclude: 'where',
        });
        testlab_1.expect(customerFilterSchema.properties).to.not.have.property('where');
    });
});
describe('getFilterJsonSchemaFor - excluding include', () => {
    let customerFilterSchema;
    it('excludes "include" using string[]', () => {
        customerFilterSchema = filter_json_schema_1.getFilterJsonSchemaFor(Customer, {
            exclude: ['include'],
        });
        testlab_1.expect(customerFilterSchema.properties).to.not.have.property('include');
    });
    it('excludes "include" using string', () => {
        customerFilterSchema = filter_json_schema_1.getFilterJsonSchemaFor(Customer, {
            exclude: 'include',
        });
        testlab_1.expect(customerFilterSchema.properties).to.not.have.property('include');
    });
});
describe('getFilterJsonSchemaForOptionsSetTitle', () => {
    let customerFilterSchema;
    beforeEach(() => {
        customerFilterSchema = filter_json_schema_1.getFilterJsonSchemaFor(Customer, { setTitle: true });
    });
    it('returns "title" when a single option "setTitle" is set', () => {
        testlab_1.expect(customerFilterSchema.title).to.equal('Customer.Filter');
    });
    it('returns "include.title" when a single option "setTitle" is set', () => {
        testlab_1.expect(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'title')
            .to.equal('Customer.IncludeFilter');
    });
    it('returns "include.items.title" when a single option "setTitle" is set', () => {
        testlab_1.expect(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'items', 'title')
            .to.equal('Customer.IncludeFilter.Items');
    });
    it('returns "scope.title" when a single option "setTitle" is set', () => {
        testlab_1.expect(customerFilterSchema.properties)
            .to.have.propertyByPath('include', 'items', 'properties', 'scope', 'title')
            .to.equal('Customer.ScopeFilter');
    });
});
describe('getFilterJsonSchemaForOptionsUnsetTitle', () => {
    let customerFilterSchema;
    beforeEach(() => {
        customerFilterSchema = filter_json_schema_1.getFilterJsonSchemaFor(Customer, { setTitle: false });
    });
    it('no title when a single option "setTitle" is false', () => {
        testlab_1.expect(customerFilterSchema).to.not.have.property('title');
    });
    it('no title on include when single option "setTitle" is false', () => {
        testlab_1.expect(customerFilterSchema.properties)
            .property('include')
            .to.not.have.property('title');
    });
    it('no title on include.items when single option "setTitle" is false', () => {
        testlab_1.expect(customerFilterSchema.properties)
            .propertyByPath('include', 'items')
            .to.not.have.property('title');
    });
    it('no title on scope when single option "setTitle" is false', () => {
        testlab_1.expect(customerFilterSchema.properties)
            .propertyByPath('include', 'items', 'properties', 'scope')
            .to.not.have.property('title');
    });
});
describe('getScopeFilterJsonSchemaFor - nested inclusion', () => {
    let todoListScopeSchema;
    let Todo = class Todo extends repository_1.Entity {
    };
    tslib_1.__decorate([
        repository_1.property({
            type: 'number',
            id: true,
            generated: false,
        }),
        tslib_1.__metadata("design:type", Number)
    ], Todo.prototype, "id", void 0);
    tslib_1.__decorate([
        repository_1.belongsTo(() => TodoList),
        tslib_1.__metadata("design:type", Number)
    ], Todo.prototype, "todoListId", void 0);
    Todo = tslib_1.__decorate([
        repository_1.model()
    ], Todo);
    let TodoList = class TodoList extends repository_1.Entity {
    };
    tslib_1.__decorate([
        repository_1.property({
            type: 'number',
            id: true,
            generated: false,
        }),
        tslib_1.__metadata("design:type", Number)
    ], TodoList.prototype, "id", void 0);
    tslib_1.__decorate([
        repository_1.hasMany(() => Todo),
        tslib_1.__metadata("design:type", Array)
    ], TodoList.prototype, "todos", void 0);
    TodoList = tslib_1.__decorate([
        repository_1.model()
    ], TodoList);
    beforeEach(() => {
        todoListScopeSchema = filter_json_schema_1.getScopeFilterJsonSchemaFor(TodoList, {
            setTitle: false,
        });
    });
    it('does not have constraint for scope filter', () => {
        testlab_1.expect(todoListScopeSchema.properties)
            .propertyByPath('include')
            .to.containEql({
            ...filter_json_schema_1.AnyScopeFilterSchema,
        });
    });
});
describe('getWhereJsonSchemaFor', () => {
    let ajv;
    let customerWhereSchema;
    beforeEach(() => {
        ajv = new ajv_1.default();
        customerWhereSchema = filter_json_schema_1.getWhereJsonSchemaFor(Customer);
    });
    it('produces a valid schema', () => {
        const isValid = ajv.validateSchema(customerWhereSchema);
        const SUCCESS_MSG = 'Where schema is a valid JSON Schema';
        const result = isValid ? SUCCESS_MSG : ajv.errorsText(ajv.errors);
        testlab_1.expect(result).to.equal(SUCCESS_MSG);
    });
    it('returns "title" when no options were provided', () => {
        testlab_1.expect(customerWhereSchema.title).to.equal('Customer.WhereFilter');
    });
});
describe('getWhereJsonSchemaForOptions', () => {
    let customerWhereSchema;
    it('returns "title" when a single option "setTitle" is set', () => {
        customerWhereSchema = filter_json_schema_1.getWhereJsonSchemaFor(Customer, {
            setTitle: true,
        });
        testlab_1.expect(customerWhereSchema.title).to.equal('Customer.WhereFilter');
    });
    it('leaves out "title" when a single option "setTitle" is false', () => {
        customerWhereSchema = filter_json_schema_1.getWhereJsonSchemaFor(Customer, {
            setTitle: false,
        });
        testlab_1.expect(customerWhereSchema).to.not.have.property('title');
    });
});
describe('getFieldsJsonSchemaFor', () => {
    let customerFieldsSchema;
    it('returns "title" when no options were provided', () => {
        customerFieldsSchema = filter_json_schema_1.getFieldsJsonSchemaFor(Customer);
        testlab_1.expect(customerFieldsSchema.title).to.equal('Customer.Fields');
    });
    it('returns "title" when a single option "setTitle" is set', () => {
        customerFieldsSchema = filter_json_schema_1.getFieldsJsonSchemaFor(Customer, {
            setTitle: true,
        });
        testlab_1.expect(customerFieldsSchema.title).to.equal('Customer.Fields');
    });
    it('leaves out "title" when a single option "setTitle" is false', () => {
        customerFieldsSchema = filter_json_schema_1.getFieldsJsonSchemaFor(Customer, {
            setTitle: false,
        });
        testlab_1.expect(customerFieldsSchema).to.not.have.property('title');
    });
});
describe('single option setTitle override original value', () => {
    let customerFieldsSchema;
    it('returns builtin "title" when no options were provided', () => {
        customerFieldsSchema = {
            title: 'Test Title',
            ...filter_json_schema_1.getFieldsJsonSchemaFor(Customer),
        };
        testlab_1.expect(customerFieldsSchema.title).to.equal('Customer.Fields');
    });
    it('returns builtin "title" when a single option "setTitle" is set', () => {
        customerFieldsSchema = {
            title: 'Test Title',
            ...filter_json_schema_1.getFieldsJsonSchemaFor(Customer, {
                setTitle: true,
            }),
        };
        testlab_1.expect(customerFieldsSchema.title).to.equal('Customer.Fields');
    });
    it('returns original "title" when a single option "setTitle" is false', () => {
        customerFieldsSchema = {
            title: 'Test Title',
            ...filter_json_schema_1.getFieldsJsonSchemaFor(Customer, {
                setTitle: false,
            }),
        };
        testlab_1.expect(customerFieldsSchema.title).to.equal('Test Title');
    });
});
let Order = class Order extends repository_1.Entity {
};
tslib_1.__decorate([
    repository_1.property({ id: true }),
    tslib_1.__metadata("design:type", Number)
], Order.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property(),
    tslib_1.__metadata("design:type", Number)
], Order.prototype, "customerId", void 0);
Order = tslib_1.__decorate([
    repository_1.model()
], Order);
let Customer = class Customer extends repository_1.Entity {
};
tslib_1.__decorate([
    repository_1.property({ id: true }),
    tslib_1.__metadata("design:type", Number)
], Customer.prototype, "id", void 0);
tslib_1.__decorate([
    repository_1.property(),
    tslib_1.__metadata("design:type", String)
], Customer.prototype, "name", void 0);
tslib_1.__decorate([
    repository_1.hasMany(() => Order),
    tslib_1.__metadata("design:type", Array)
], Customer.prototype, "orders", void 0);
Customer = tslib_1.__decorate([
    repository_1.model()
], Customer);
//# sourceMappingURL=filter-json-schema.unit.js.map