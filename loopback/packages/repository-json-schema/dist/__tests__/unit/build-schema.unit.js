"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/repository-json-schema
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('build-schema', () => {
    class CustomType {
    }
    describe('stringTypeToWrapper', () => {
        context('when given primitive types in string', () => {
            it('returns String for "string"', () => {
                testlab_1.expect(__1.stringTypeToWrapper('string')).to.eql(String);
            });
            it('returns Number for "number"', () => {
                testlab_1.expect(__1.stringTypeToWrapper('number')).to.eql(Number);
            });
            it('returns Boolean for "boolean"', () => {
                testlab_1.expect(__1.stringTypeToWrapper('boolean')).to.eql(Boolean);
            });
            it('returns Array for "array"', () => {
                testlab_1.expect(__1.stringTypeToWrapper('array')).to.eql(Array);
            });
            it('returns Buffer for "buffer"', () => {
                testlab_1.expect(__1.stringTypeToWrapper('buffer')).to.eql(Buffer);
            });
            it('returns Date for "date"', () => {
                testlab_1.expect(__1.stringTypeToWrapper('date')).to.eql(Date);
            });
            it('returns  for "object"', () => {
                testlab_1.expect(__1.stringTypeToWrapper('object')).to.eql(Object);
            });
            it('returns AnyType for "any"', () => {
                testlab_1.expect(__1.stringTypeToWrapper('any')).to.eql(Object);
            });
        });
        it('errors out if other types are given', () => {
            testlab_1.expect(() => {
                __1.stringTypeToWrapper('arbitraryType');
            }).to.throw(/Unsupported type/);
            testlab_1.expect(() => {
                __1.stringTypeToWrapper('function');
            }).to.throw(/Unsupported type/);
        });
    });
    describe('metaToJsonSchema', () => {
        it('converts Boolean', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: Boolean })).to.eql({
                type: 'boolean',
            });
        });
        it('converts String', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: String })).to.eql({
                type: 'string',
            });
        });
        it('converts Number', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: Number })).to.eql({
                type: 'number',
            });
        });
        it('converts Date', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: Date })).to.eql({
                type: 'string',
                format: 'date-time',
            });
        });
        it('converts Object', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: Object })).to.eql({
                type: 'object',
            });
        });
        it('converts Array', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: Array })).to.eql({
                type: 'array',
            });
        });
        it('converts "boolean" in strings', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: 'boolean' })).to.eql({
                type: 'boolean',
            });
        });
        it('converts "string" in strings', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: 'string' })).to.eql({
                type: 'string',
            });
        });
        it('converts "date" in strings', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: 'date' })).to.eql({
                type: 'string',
                format: 'date-time',
            });
        });
        it('converts "object" in strings', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: 'object' })).to.eql({
                type: 'object',
            });
        });
        it('converts "array" in strings', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: 'array' })).to.eql({
                type: 'array',
            });
        });
        it('converts complex types', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: CustomType })).to.eql({
                $ref: '#/definitions/CustomType',
            });
        });
        it('converts complex types with resolver', () => {
            const propDef = { type: () => CustomType };
            testlab_1.expect(__1.metaToJsonProperty(propDef)).to.eql({
                $ref: '#/definitions/CustomType',
            });
        });
        it('converts primitive arrays', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: Array, itemType: Number })).to.eql({
                type: 'array',
                items: { type: 'number' },
            });
        });
        it('converts arrays of custom types', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: Array, itemType: CustomType })).to.eql({
                type: 'array',
                items: { $ref: '#/definitions/CustomType' },
            });
        });
        it('converts arrays of resolved types', () => {
            const propDef = {
                type: Array,
                itemType: () => CustomType,
            };
            testlab_1.expect(__1.metaToJsonProperty(propDef)).to.eql({
                type: 'array',
                items: { $ref: '#/definitions/CustomType' },
            });
        });
        it('converts type any', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: 'any' })).to.eql({});
        });
        it('keeps description on property', () => {
            testlab_1.expect(__1.metaToJsonProperty({ type: String, description: 'test' })).to.eql({
                type: 'string',
                description: 'test',
            });
        });
        it('keeps AJV keywords', () => {
            const schema = __1.metaToJsonProperty({
                type: String,
                jsonSchema: {
                    pattern: '(a|b|c)',
                    format: 'email',
                    maxLength: 50,
                    minLength: 5,
                },
            });
            testlab_1.expect(schema).to.eql({
                type: 'string',
                pattern: '(a|b|c)',
                format: 'email',
                maxLength: 50,
                minLength: 5,
            });
        });
    });
    describe('modelToJsonSchema', () => {
        it('allows jsonSchema in model definition', () => {
            let ReportState = class ReportState extends repository_1.Model {
                constructor(data) {
                    super(data);
                }
            };
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], ReportState.prototype, "benchmarkId", void 0);
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], ReportState.prototype, "color", void 0);
            ReportState = tslib_1.__decorate([
                repository_1.model({
                    jsonSchema: {
                        title: 'report-state',
                        required: ['color'],
                    },
                }),
                tslib_1.__metadata("design:paramtypes", [Object])
            ], ReportState);
            const schema = __1.modelToJsonSchema(ReportState, {});
            testlab_1.expect(schema.properties).to.containEql({
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            });
            testlab_1.expect(schema.required).to.eql(['color']);
            testlab_1.expect(schema.title).to.eql('report-state');
            // No circular references in definitions
            testlab_1.expect(schema.definitions).to.be.undefined();
        });
        it('allows recursive model definition', () => {
            var ReportState_1;
            let ReportState = ReportState_1 = class ReportState extends repository_1.Model {
                constructor(data) {
                    super(data);
                }
            };
            tslib_1.__decorate([
                repository_1.property.array(ReportState_1, {}),
                tslib_1.__metadata("design:type", Array)
            ], ReportState.prototype, "states", void 0);
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], ReportState.prototype, "benchmarkId", void 0);
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], ReportState.prototype, "color", void 0);
            ReportState = ReportState_1 = tslib_1.__decorate([
                repository_1.model(),
                tslib_1.__metadata("design:paramtypes", [Object])
            ], ReportState);
            const schema = __1.modelToJsonSchema(ReportState, {});
            testlab_1.expect(schema.properties).to.containEql({
                states: {
                    type: 'array',
                    items: { $ref: '#/definitions/ReportState' },
                },
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            });
            // No circular references in definitions
            testlab_1.expect(schema.definitions).to.be.undefined();
        });
        it('relation model definition does not inherit title from source model', () => {
            let Child = class Child extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], Child.prototype, "name", void 0);
            Child = tslib_1.__decorate([
                repository_1.model()
            ], Child);
            let Parent = class Parent extends repository_1.Entity {
                constructor(data) {
                    super(data);
                }
            };
            tslib_1.__decorate([
                repository_1.hasMany(() => Child),
                tslib_1.__metadata("design:type", Array)
            ], Parent.prototype, "children", void 0);
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], Parent.prototype, "benchmarkId", void 0);
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], Parent.prototype, "color", void 0);
            Parent = tslib_1.__decorate([
                repository_1.model(),
                tslib_1.__metadata("design:paramtypes", [Object])
            ], Parent);
            const schema = __1.modelToJsonSchema(Parent, {
                title: 'ParentWithItsChildren',
                includeRelations: true,
            });
            testlab_1.expect(schema.properties).to.containEql({
                children: {
                    type: 'array',
                    // The reference here should be `ChildWithRelations`,
                    // instead of `ParentWithItsChildren`
                    items: { $ref: '#/definitions/ChildWithRelations' },
                },
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            });
            // The recursive calls should NOT inherit
            // `title` from the previous call's `options`.
            // So the `title` here is `ChildWithRelations`
            // instead of `ParentWithItsChildren`.
            testlab_1.expect(schema.definitions).to.containEql({
                ChildWithRelations: {
                    title: 'ChildWithRelations',
                    type: 'object',
                    description: '(tsType: ChildWithRelations, schemaOptions: { includeRelations: true })',
                    properties: { name: { type: 'string' } },
                    additionalProperties: false,
                },
            });
        });
        it('property definition does not inherit title from model', () => {
            let Child = class Child extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], Child.prototype, "name", void 0);
            Child = tslib_1.__decorate([
                repository_1.model()
            ], Child);
            let Parent = class Parent extends repository_1.Entity {
                constructor(data) {
                    super(data);
                }
            };
            tslib_1.__decorate([
                repository_1.property.array(Child),
                tslib_1.__metadata("design:type", Array)
            ], Parent.prototype, "children", void 0);
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], Parent.prototype, "benchmarkId", void 0);
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                }),
                tslib_1.__metadata("design:type", String)
            ], Parent.prototype, "color", void 0);
            Parent = tslib_1.__decorate([
                repository_1.model(),
                tslib_1.__metadata("design:paramtypes", [Object])
            ], Parent);
            const schema = __1.modelToJsonSchema(Parent, {
                title: 'ParentWithPropertyChildren',
            });
            testlab_1.expect(schema.properties).to.containEql({
                children: {
                    type: 'array',
                    // The reference here should be `Child`,
                    // instead of `ParentWithPropertyChildren`
                    items: { $ref: '#/definitions/Child' },
                },
                benchmarkId: { type: 'string' },
                color: { type: 'string' },
            });
            // The recursive calls should NOT inherit
            // `title` from the previous call's `options`.
            // So the `title` here is `Child`
            // instead of `ParentWithPropertyChildren`.
            testlab_1.expect(schema.definitions).to.containEql({
                Child: {
                    title: 'Child',
                    type: 'object',
                    properties: { name: { type: 'string' } },
                    additionalProperties: false,
                },
            });
        });
        it('allows model inheritance', () => {
            let User = class User {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true }),
                tslib_1.__metadata("design:type", String)
            ], User.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                    required: true,
                }),
                tslib_1.__metadata("design:type", String)
            ], User.prototype, "name", void 0);
            User = tslib_1.__decorate([
                repository_1.model()
            ], User);
            let NewUser = class NewUser extends User {
            };
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                    required: true,
                }),
                tslib_1.__metadata("design:type", String)
            ], NewUser.prototype, "password", void 0);
            NewUser = tslib_1.__decorate([
                repository_1.model()
            ], NewUser);
            const userSchema = __1.modelToJsonSchema(User, {});
            testlab_1.expect(userSchema).to.eql({
                title: 'User',
                type: 'object',
                properties: { id: { type: 'string' }, name: { type: 'string' } },
                required: ['name'],
                additionalProperties: false,
            });
            const newUserSchema = __1.modelToJsonSchema(NewUser, {});
            testlab_1.expect(newUserSchema).to.eql({
                title: 'NewUser',
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    password: { type: 'string' },
                },
                required: ['name', 'password'],
                additionalProperties: false,
            });
        });
        it('allows nesting models', () => {
            let Address = class Address {
            };
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], Address.prototype, "street", void 0);
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], Address.prototype, "city", void 0);
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], Address.prototype, "state", void 0);
            Address = tslib_1.__decorate([
                repository_1.model()
            ], Address);
            let Email = class Email {
            };
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], Email.prototype, "label", void 0);
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], Email.prototype, "id", void 0);
            Email = tslib_1.__decorate([
                repository_1.model()
            ], Email);
            let User = class User {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true }),
                tslib_1.__metadata("design:type", String)
            ], User.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.property({
                    type: 'string',
                    required: true,
                }),
                tslib_1.__metadata("design:type", String)
            ], User.prototype, "name", void 0);
            tslib_1.__decorate([
                repository_1.property({
                    type: Address,
                }),
                tslib_1.__metadata("design:type", Address)
            ], User.prototype, "address", void 0);
            tslib_1.__decorate([
                repository_1.property.array(Email),
                tslib_1.__metadata("design:type", Array)
            ], User.prototype, "emails", void 0);
            User = tslib_1.__decorate([
                repository_1.model()
            ], User);
            const userSchema = __1.modelToJsonSchema(User, {});
            testlab_1.expect(userSchema).to.eql({
                title: 'User',
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    address: { $ref: '#/definitions/Address' },
                    emails: { type: 'array', items: { $ref: '#/definitions/Email' } },
                },
                required: ['name'],
                definitions: {
                    Address: {
                        title: 'Address',
                        type: 'object',
                        properties: {
                            street: { type: 'string' },
                            city: { type: 'string' },
                            state: { type: 'string' },
                        },
                        additionalProperties: false,
                    },
                    Email: {
                        title: 'Email',
                        type: 'object',
                        properties: {
                            label: { type: 'string' },
                            id: { type: 'string' },
                        },
                        additionalProperties: false,
                    },
                },
                additionalProperties: false,
            });
        });
    });
    describe('getNavigationalPropertyForRelation', () => {
        it('errors out if targetsMany is undefined', () => {
            testlab_1.expect(() => __1.getNavigationalPropertyForRelation({
                type: repository_1.RelationType.hasMany,
                name: 'Test',
            }, {
                $ref: `#/definitions/Test`,
            })).to.throw(/targetsMany attribute missing for Test/);
        });
    });
    describe('buildModelCacheKey', () => {
        it('returns "modelOnly" when no options were provided', () => {
            const key = __1.buildModelCacheKey();
            testlab_1.expect(key).to.equal('modelOnly');
        });
        it('returns "modelWithRelations" when a single option "includeRelations" is set', () => {
            const key = __1.buildModelCacheKey({ includeRelations: true });
            testlab_1.expect(key).to.equal('modelWithRelations');
        });
        it('returns "partial" when a single option "partial" is set', () => {
            const key = __1.buildModelCacheKey({ partial: true });
            testlab_1.expect(key).to.equal('modelPartial');
        });
        it('returns "excluding_id-_rev_" when a single option "exclude" is set', () => {
            const key = __1.buildModelCacheKey({ exclude: ['id', '_rev'] });
            testlab_1.expect(key).to.equal('modelExcluding_id-_rev_');
        });
        it('does not include "exclude" in concatenated option names if it is empty', () => {
            const key = __1.buildModelCacheKey({
                partial: true,
                exclude: [],
                includeRelations: true,
            });
            testlab_1.expect(key).to.equal('modelPartialWithRelations');
        });
        it('returns "optional_id-_rev_" when "optional" is set with two items', () => {
            const key = __1.buildModelCacheKey({ optional: ['id', '_rev'] });
            testlab_1.expect(key).to.equal('modelOptional_id-_rev_');
        });
        it('does not include "optional" in concatenated option names if it is empty', () => {
            const key = __1.buildModelCacheKey({
                partial: true,
                optional: [],
                includeRelations: true,
            });
            testlab_1.expect(key).to.equal('modelPartialWithRelations');
        });
        it('does not include "partial" in option names if "optional" is not empty', () => {
            const key = __1.buildModelCacheKey({
                partial: true,
                optional: ['name'],
            });
            testlab_1.expect(key).to.equal('modelOptional_name_');
        });
        it('includes "partial" in option names if "optional" is empty', () => {
            const key = __1.buildModelCacheKey({
                partial: true,
                optional: [],
            });
            testlab_1.expect(key).to.equal('modelPartial');
        });
        it('returns concatenated option names except "partial" otherwise', () => {
            const key = __1.buildModelCacheKey({
                // important: object keys are defined in reverse order
                partial: true,
                exclude: ['id', '_rev'],
                optional: ['name'],
                includeRelations: true,
            });
            testlab_1.expect(key).to.equal('modelOptional_name_Excluding_id-_rev_WithRelations');
        });
        it('includes custom title', () => {
            const key = __1.buildModelCacheKey({ title: 'NewProduct', partial: true });
            testlab_1.expect(key).to.equal('modelNewProductPartial');
        });
    });
});
//# sourceMappingURL=build-schema.unit.js.map