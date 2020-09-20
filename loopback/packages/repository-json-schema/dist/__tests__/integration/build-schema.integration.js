"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/repository-json-schema
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const expect_valid_json_schema_1 = require("../helpers/expect-valid-json-schema");
describe('build-schema', () => {
    describe('modelToJsonSchema', () => {
        context('properties conversion', () => {
            it('reports error for property without type (`null`)', () => {
                // We cannot use `@model()` and `@property()` decorators because
                // they no longer allow missing property type. Fortunately,
                // it's possible to reproduce the problematic edge case by
                // creating the model definition object directly.
                class TestModel {
                }
                const definition = {
                    name: 'TestModel',
                    properties: {
                        nul: { type: null },
                    },
                };
                core_1.Reflector.defineMetadata(repository_1.MODEL_KEY.key, definition, TestModel);
                testlab_1.expect(() => __1.modelToJsonSchema(TestModel)).to.throw(/Property TestModel.nul does not have "type" in its definition/);
            });
            it('reports error for property without type (`undefined`)', () => {
                // We cannot use `@model()` and `@property()` decorators because
                // they no longer allow missing property type. Fortunately,
                // it's possible to reproduce the problematic edge case by
                // creating the model definition object directly.
                class TestModel {
                }
                const definition = {
                    name: 'TestModel',
                    properties: {
                        undef: { type: undefined },
                    },
                };
                core_1.Reflector.defineMetadata(repository_1.MODEL_KEY.key, definition, TestModel);
                testlab_1.expect(() => __1.modelToJsonSchema(TestModel)).to.throw(/Property TestModel.undef does not have "type" in its definition/);
            });
            it('allows property of null type', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property({ type: 'null' }),
                    tslib_1.__metadata("design:type", void 0)
                ], TestModel.prototype, "nul", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema).to.eql({
                    title: 'TestModel',
                    type: 'object',
                    properties: { nul: { type: 'null' } },
                    additionalProperties: false,
                });
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('does not convert properties that have not been decorated', () => {
                let NoPropertyMeta = class NoPropertyMeta {
                };
                NoPropertyMeta = tslib_1.__decorate([
                    repository_1.model()
                ], NoPropertyMeta);
                let OnePropertyDecorated = class OnePropertyDecorated {
                };
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", String)
                ], OnePropertyDecorated.prototype, "foo", void 0);
                OnePropertyDecorated = tslib_1.__decorate([
                    repository_1.model()
                ], OnePropertyDecorated);
                const noPropJson = __1.modelToJsonSchema(NoPropertyMeta);
                const onePropJson = __1.modelToJsonSchema(OnePropertyDecorated);
                testlab_1.expect(noPropJson).to.not.have.key('properties');
                expect_valid_json_schema_1.expectValidJsonSchema(noPropJson);
                testlab_1.expect(onePropJson.properties).to.deepEqual({
                    foo: {
                        type: 'string',
                    },
                });
                expect_valid_json_schema_1.expectValidJsonSchema(onePropJson);
            });
            it('does not convert models that have not been decorated with @model()', () => {
                class Empty {
                }
                class NoModelMeta {
                }
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", String)
                ], NoModelMeta.prototype, "foo", void 0);
                const emptyJson = __1.modelToJsonSchema(Empty);
                const noModelMetaJson = __1.modelToJsonSchema(NoModelMeta);
                testlab_1.expect(emptyJson).to.eql({});
                expect_valid_json_schema_1.expectValidJsonSchema(emptyJson);
                testlab_1.expect(noModelMetaJson).to.eql({});
                expect_valid_json_schema_1.expectValidJsonSchema(noModelMetaJson);
            });
            it('infers "title" property from constructor name', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", String)
                ], TestModel.prototype, "foo", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.title).to.eql('TestModel');
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('overrides "title" property if explicitly given', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", String)
                ], TestModel.prototype, "foo", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model({ title: 'NewName' })
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.title).to.eql('NewName');
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('retains "description" properties from top-level metadata', () => {
                const topMeta = {
                    description: 'Test description',
                };
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", String)
                ], TestModel.prototype, "foo", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model(topMeta)
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.description).to.eql(topMeta.description);
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('properly converts string, number, and boolean properties', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", String)
                ], TestModel.prototype, "str", void 0);
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", Number)
                ], TestModel.prototype, "num", void 0);
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", Boolean)
                ], TestModel.prototype, "bool", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.deepEqual({
                    str: {
                        type: 'string',
                    },
                    num: {
                        type: 'number',
                    },
                    bool: {
                        type: 'boolean',
                    },
                });
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('properly converts date property', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", Date)
                ], TestModel.prototype, "date", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.deepEqual({
                    date: {
                        type: 'string',
                        format: 'date-time',
                    },
                });
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('properly converts object properties', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", Object)
                ], TestModel.prototype, "obj", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.deepEqual({
                    obj: {
                        type: 'object',
                    },
                });
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('properly converts any properties', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property({
                        type: 'any',
                    }),
                    tslib_1.__metadata("design:type", Object)
                ], TestModel.prototype, "anyProp", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.deepEqual({
                    anyProp: {},
                });
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('properly converts primitive array properties', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property.array(Number),
                    tslib_1.__metadata("design:type", Array)
                ], TestModel.prototype, "numArr", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.deepEqual({
                    numArr: {
                        type: 'array',
                        items: {
                            type: 'number',
                        },
                    },
                });
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('properly converts optional primitive array properties', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property.array('number'),
                    tslib_1.__metadata("design:type", Array)
                ], TestModel.prototype, "numArr", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.deepEqual({
                    numArr: {
                        type: 'array',
                        items: {
                            type: 'number',
                        },
                    },
                });
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('properly converts nested array property when json schema provided', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property.array(Array, {
                        jsonSchema: {
                            type: 'array',
                            items: { type: 'string' },
                        },
                    }),
                    tslib_1.__metadata("design:type", Array)
                ], TestModel.prototype, "nestedArr", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.deepEqual({
                    nestedArr: {
                        type: 'array',
                        items: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                        },
                    },
                });
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('properly converts properties with enum in json schema', () => {
                let QueryLanguage;
                (function (QueryLanguage) {
                    QueryLanguage["JSON"] = "json";
                    QueryLanguage["SQL"] = "sql";
                    QueryLanguage["MONGO"] = "mongo";
                })(QueryLanguage || (QueryLanguage = {}));
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property({
                        type: 'string',
                        required: true,
                        jsonSchema: {
                            enum: Object.values(QueryLanguage),
                        },
                    }),
                    tslib_1.__metadata("design:type", String)
                ], TestModel.prototype, "queryLanguage", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.eql({
                    queryLanguage: {
                        type: 'string',
                        enum: ['json', 'sql', 'mongo'],
                    },
                });
            });
            it('properly converts properties with array and json schema', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property.array(String, {
                        jsonSchema: {
                            format: 'email',
                            minLength: 5,
                            maxLength: 50,
                            transform: ['toLowerCase'],
                        },
                    }),
                    tslib_1.__metadata("design:type", Array)
                ], TestModel.prototype, "emails", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.eql({
                    emails: {
                        type: 'array',
                        items: {
                            type: 'string',
                            format: 'email',
                            minLength: 5,
                            maxLength: 50,
                            transform: ['toLowerCase'],
                        },
                    },
                });
            });
            it('throws for nested array property when json schema is missing', () => {
                let RecursiveArray = class RecursiveArray {
                };
                tslib_1.__decorate([
                    repository_1.property.array(Array),
                    tslib_1.__metadata("design:type", Array)
                ], RecursiveArray.prototype, "recArr", void 0);
                RecursiveArray = tslib_1.__decorate([
                    repository_1.model()
                ], RecursiveArray);
                testlab_1.expect.throws(() => {
                    __1.modelToJsonSchema(RecursiveArray);
                }, Error, 'You must provide the "jsonSchema" field when define a nested array property');
            });
            it('supports explicit primitive type decoration via strings', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property({ type: 'string' }),
                    tslib_1.__metadata("design:type", Number)
                ], TestModel.prototype, "hardStr", void 0);
                tslib_1.__decorate([
                    repository_1.property({ type: 'boolean' }),
                    tslib_1.__metadata("design:type", String)
                ], TestModel.prototype, "hardBool", void 0);
                tslib_1.__decorate([
                    repository_1.property({ type: 'number' }),
                    tslib_1.__metadata("design:type", Boolean)
                ], TestModel.prototype, "hardNum", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.deepEqual({
                    hardStr: {
                        type: 'string',
                    },
                    hardBool: {
                        type: 'boolean',
                    },
                    hardNum: {
                        type: 'number',
                    },
                });
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('maps "required" keyword to the schema appropriately', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property({ required: false }),
                    tslib_1.__metadata("design:type", String)
                ], TestModel.prototype, "propOne", void 0);
                tslib_1.__decorate([
                    repository_1.property({ required: true }),
                    tslib_1.__metadata("design:type", String)
                ], TestModel.prototype, "propTwo", void 0);
                tslib_1.__decorate([
                    repository_1.property(),
                    tslib_1.__metadata("design:type", Number)
                ], TestModel.prototype, "propThree", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.required).to.deepEqual(['propTwo']);
                expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
            });
            it('errors out when explicit type decoration is not primitive', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property({ type: 'NotPrimitive' }),
                    tslib_1.__metadata("design:type", String)
                ], TestModel.prototype, "bad", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                testlab_1.expect(() => __1.modelToJsonSchema(TestModel)).to.throw(/Unsupported type/);
            });
            it('properly converts array of types defined by strings', () => {
                let TestModel = class TestModel {
                };
                tslib_1.__decorate([
                    repository_1.property({ type: 'array', itemType: 'number' }),
                    tslib_1.__metadata("design:type", Array)
                ], TestModel.prototype, "num", void 0);
                TestModel = tslib_1.__decorate([
                    repository_1.model()
                ], TestModel);
                const jsonSchema = __1.modelToJsonSchema(TestModel);
                testlab_1.expect(jsonSchema.properties).to.eql({
                    num: {
                        type: 'array',
                        items: {
                            type: 'number',
                        },
                    },
                });
            });
            context('with custom type properties', () => {
                it('properly converts undecorated custom type properties', () => {
                    class CustomType {
                    }
                    let TestModel = class TestModel {
                    };
                    tslib_1.__decorate([
                        repository_1.property(),
                        tslib_1.__metadata("design:type", CustomType)
                    ], TestModel.prototype, "cusType", void 0);
                    TestModel = tslib_1.__decorate([
                        repository_1.model()
                    ], TestModel);
                    const jsonSchema = __1.modelToJsonSchema(TestModel);
                    testlab_1.expect(jsonSchema.properties).to.deepEqual({
                        cusType: {
                            $ref: '#/definitions/CustomType',
                        },
                    });
                    testlab_1.expect(jsonSchema).to.not.have.key('definitions');
                    expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
                });
                it('properly converts decorated custom type properties', () => {
                    let CustomType = class CustomType {
                    };
                    tslib_1.__decorate([
                        repository_1.property(),
                        tslib_1.__metadata("design:type", String)
                    ], CustomType.prototype, "prop", void 0);
                    CustomType = tslib_1.__decorate([
                        repository_1.model()
                    ], CustomType);
                    let TestModel = class TestModel {
                    };
                    tslib_1.__decorate([
                        repository_1.property(),
                        tslib_1.__metadata("design:type", CustomType)
                    ], TestModel.prototype, "cusType", void 0);
                    TestModel = tslib_1.__decorate([
                        repository_1.model()
                    ], TestModel);
                    const jsonSchema = __1.modelToJsonSchema(TestModel);
                    testlab_1.expect(jsonSchema.properties).to.deepEqual({
                        cusType: {
                            $ref: '#/definitions/CustomType',
                        },
                    });
                    testlab_1.expect(jsonSchema.definitions).to.deepEqual({
                        CustomType: {
                            title: 'CustomType',
                            type: 'object',
                            properties: {
                                prop: {
                                    type: 'string',
                                },
                            },
                            additionalProperties: false,
                        },
                    });
                    expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
                });
                it('properly converts decorated properties with {partial: true}', () => {
                    let CustomType = class CustomType {
                    };
                    tslib_1.__decorate([
                        repository_1.property(),
                        tslib_1.__metadata("design:type", String)
                    ], CustomType.prototype, "prop", void 0);
                    tslib_1.__decorate([
                        repository_1.property({ required: true }),
                        tslib_1.__metadata("design:type", String)
                    ], CustomType.prototype, "requiredProp", void 0);
                    CustomType = tslib_1.__decorate([
                        repository_1.model()
                    ], CustomType);
                    let TestModel = class TestModel {
                    };
                    tslib_1.__decorate([
                        repository_1.property(CustomType),
                        tslib_1.__metadata("design:type", CustomType)
                    ], TestModel.prototype, "cusType", void 0);
                    TestModel = tslib_1.__decorate([
                        repository_1.model()
                    ], TestModel);
                    const jsonSchema = __1.modelToJsonSchema(TestModel, { partial: true });
                    testlab_1.expect(jsonSchema.properties).to.deepEqual({
                        cusType: { $ref: '#/definitions/CustomType' },
                    });
                    testlab_1.expect(jsonSchema.definitions).to.deepEqual({
                        CustomType: {
                            title: 'CustomType',
                            type: 'object',
                            properties: {
                                prop: {
                                    type: 'string',
                                },
                                requiredProp: {
                                    type: 'string',
                                },
                            },
                            required: ['requiredProp'],
                            additionalProperties: false,
                        },
                    });
                    expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
                });
                it("properly converts decorated properties with {partial: 'deep'}", () => {
                    let CustomType = class CustomType {
                    };
                    tslib_1.__decorate([
                        repository_1.property(),
                        tslib_1.__metadata("design:type", String)
                    ], CustomType.prototype, "prop", void 0);
                    tslib_1.__decorate([
                        repository_1.property({ required: true }),
                        tslib_1.__metadata("design:type", String)
                    ], CustomType.prototype, "requiredProp", void 0);
                    CustomType = tslib_1.__decorate([
                        repository_1.model()
                    ], CustomType);
                    let TestModel = class TestModel {
                    };
                    tslib_1.__decorate([
                        repository_1.property(CustomType),
                        tslib_1.__metadata("design:type", CustomType)
                    ], TestModel.prototype, "cusType", void 0);
                    TestModel = tslib_1.__decorate([
                        repository_1.model()
                    ], TestModel);
                    const jsonSchema = __1.modelToJsonSchema(TestModel, { partial: 'deep' });
                    testlab_1.expect(jsonSchema.properties).to.deepEqual({
                        cusType: { $ref: '#/definitions/CustomTypePartial' },
                    });
                    testlab_1.expect(jsonSchema.definitions).to.deepEqual({
                        CustomTypePartial: {
                            title: 'CustomTypePartial',
                            type: 'object',
                            description: "(tsType: Partial<CustomType>, schemaOptions: { partial: 'deep' })",
                            properties: {
                                prop: {
                                    type: 'string',
                                },
                                requiredProp: {
                                    type: 'string',
                                },
                            },
                            additionalProperties: false,
                        },
                    });
                    expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
                });
                it('properly converts undecorated custom array type properties', () => {
                    class CustomType {
                    }
                    let TestModel = class TestModel {
                    };
                    tslib_1.__decorate([
                        repository_1.property.array(CustomType),
                        tslib_1.__metadata("design:type", Array)
                    ], TestModel.prototype, "cusArr", void 0);
                    TestModel = tslib_1.__decorate([
                        repository_1.model()
                    ], TestModel);
                    const jsonSchema = __1.modelToJsonSchema(TestModel);
                    testlab_1.expect(jsonSchema.properties).to.deepEqual({
                        cusArr: {
                            type: 'array',
                            items: {
                                $ref: '#/definitions/CustomType',
                            },
                        },
                    });
                    expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
                });
                it('properly converts decorated custom array type properties', () => {
                    let CustomType = class CustomType {
                    };
                    tslib_1.__decorate([
                        repository_1.property(),
                        tslib_1.__metadata("design:type", String)
                    ], CustomType.prototype, "prop", void 0);
                    CustomType = tslib_1.__decorate([
                        repository_1.model()
                    ], CustomType);
                    let TestModel = class TestModel {
                    };
                    tslib_1.__decorate([
                        repository_1.property.array(CustomType),
                        tslib_1.__metadata("design:type", Array)
                    ], TestModel.prototype, "cusType", void 0);
                    TestModel = tslib_1.__decorate([
                        repository_1.model()
                    ], TestModel);
                    const jsonSchema = __1.modelToJsonSchema(TestModel);
                    testlab_1.expect(jsonSchema.properties).to.deepEqual({
                        cusType: {
                            type: 'array',
                            items: { $ref: '#/definitions/CustomType' },
                        },
                    });
                    testlab_1.expect(jsonSchema.definitions).to.deepEqual({
                        CustomType: {
                            title: 'CustomType',
                            type: 'object',
                            properties: {
                                prop: {
                                    type: 'string',
                                },
                            },
                            additionalProperties: false,
                        },
                    });
                    expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
                });
                it('properly converts decorated custom array type properties with partial', () => {
                    let CustomType = class CustomType {
                    };
                    tslib_1.__decorate([
                        repository_1.property(),
                        tslib_1.__metadata("design:type", String)
                    ], CustomType.prototype, "prop", void 0);
                    tslib_1.__decorate([
                        repository_1.property({ required: true }),
                        tslib_1.__metadata("design:type", String)
                    ], CustomType.prototype, "requiredProp", void 0);
                    CustomType = tslib_1.__decorate([
                        repository_1.model()
                    ], CustomType);
                    let TestModel = class TestModel {
                    };
                    tslib_1.__decorate([
                        repository_1.property.array(CustomType),
                        tslib_1.__metadata("design:type", Array)
                    ], TestModel.prototype, "cusType", void 0);
                    TestModel = tslib_1.__decorate([
                        repository_1.model()
                    ], TestModel);
                    const jsonSchema = __1.modelToJsonSchema(TestModel, { partial: 'deep' });
                    testlab_1.expect(jsonSchema.properties).to.deepEqual({
                        cusType: {
                            type: 'array',
                            items: { $ref: '#/definitions/CustomTypePartial' },
                        },
                    });
                    testlab_1.expect(jsonSchema.definitions).to.deepEqual({
                        CustomTypePartial: {
                            title: 'CustomTypePartial',
                            type: 'object',
                            description: "(tsType: Partial<CustomType>, schemaOptions: { partial: 'deep' })",
                            properties: {
                                prop: {
                                    type: 'string',
                                },
                                requiredProp: {
                                    type: 'string',
                                },
                            },
                            additionalProperties: false,
                        },
                    });
                    expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
                });
                it('properly handles AJV keywords in property decorator', () => {
                    let TestModel = class TestModel {
                    };
                    tslib_1.__decorate([
                        repository_1.property({
                            type: 'string',
                            required: true,
                            jsonSchema: {
                                format: 'email',
                                maxLength: 50,
                                minLength: 5,
                            },
                        }),
                        tslib_1.__metadata("design:type", String)
                    ], TestModel.prototype, "email", void 0);
                    tslib_1.__decorate([
                        repository_1.property({
                            type: 'string',
                            required: true,
                            jsonSchema: {
                                pattern: '(a|b|c)',
                            },
                        }),
                        tslib_1.__metadata("design:type", String)
                    ], TestModel.prototype, "type", void 0);
                    TestModel = tslib_1.__decorate([
                        repository_1.model()
                    ], TestModel);
                    const jsonSchema = __1.modelToJsonSchema(TestModel);
                    testlab_1.expect(jsonSchema.properties).to.eql({
                        email: {
                            type: 'string',
                            format: 'email',
                            maxLength: 50,
                            minLength: 5,
                        },
                        type: {
                            type: 'string',
                            pattern: '(a|b|c)',
                        },
                    });
                });
                it('properly converts decorated custom array type with a resolver', () => {
                    let Address = class Address {
                    };
                    tslib_1.__decorate([
                        repository_1.property(),
                        tslib_1.__metadata("design:type", String)
                    ], Address.prototype, "city", void 0);
                    Address = tslib_1.__decorate([
                        repository_1.model()
                    ], Address);
                    let TestModel = class TestModel {
                    };
                    tslib_1.__decorate([
                        repository_1.property.array(() => Address),
                        tslib_1.__metadata("design:type", Array)
                    ], TestModel.prototype, "addresses", void 0);
                    TestModel = tslib_1.__decorate([
                        repository_1.model()
                    ], TestModel);
                    const jsonSchema = __1.modelToJsonSchema(TestModel);
                    testlab_1.expect(jsonSchema.properties).to.deepEqual({
                        addresses: {
                            type: 'array',
                            items: { $ref: '#/definitions/Address' },
                        },
                    });
                    testlab_1.expect(jsonSchema.definitions).to.deepEqual({
                        Address: {
                            title: 'Address',
                            type: 'object',
                            properties: {
                                city: {
                                    type: 'string',
                                },
                            },
                            additionalProperties: false,
                        },
                    });
                    expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
                });
                it('properly converts models with hasMany/belongsTo relation', () => {
                    let Order = class Order extends repository_1.Entity {
                    };
                    tslib_1.__decorate([
                        repository_1.property({ id: true }),
                        tslib_1.__metadata("design:type", Number)
                    ], Order.prototype, "id", void 0);
                    tslib_1.__decorate([
                        repository_1.belongsTo(() => Customer),
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
                        repository_1.hasMany(() => Order),
                        tslib_1.__metadata("design:type", Array)
                    ], Customer.prototype, "orders", void 0);
                    Customer = tslib_1.__decorate([
                        repository_1.model()
                    ], Customer);
                    const orderSchema = __1.modelToJsonSchema(Order);
                    const customerSchema = __1.modelToJsonSchema(Customer);
                    expect_valid_json_schema_1.expectValidJsonSchema(customerSchema);
                    expect_valid_json_schema_1.expectValidJsonSchema(orderSchema);
                    testlab_1.expect(orderSchema.properties).to.deepEqual({
                        id: { type: 'number' },
                        customerId: { type: 'number' },
                    });
                    testlab_1.expect(customerSchema.properties).to.deepEqual({
                        id: { type: 'number' },
                    });
                    testlab_1.expect(customerSchema.properties).to.not.containDeep({
                        orders: {
                            type: 'array',
                            items: { $ref: '#/definitions/Order' },
                        },
                    });
                    testlab_1.expect(customerSchema.definitions).to.not.containEql({
                        Order: {
                            title: 'Order',
                            properties: {
                                id: {
                                    type: 'number',
                                },
                                customerId: { type: 'number' },
                            },
                            additionalProperties: false,
                        },
                    });
                });
                it('creates definitions only at the root level of the schema', () => {
                    let CustomTypeFoo = class CustomTypeFoo {
                    };
                    tslib_1.__decorate([
                        repository_1.property(),
                        tslib_1.__metadata("design:type", String)
                    ], CustomTypeFoo.prototype, "prop", void 0);
                    CustomTypeFoo = tslib_1.__decorate([
                        repository_1.model()
                    ], CustomTypeFoo);
                    let CustomTypeBar = class CustomTypeBar {
                    };
                    tslib_1.__decorate([
                        repository_1.property.array(CustomTypeFoo),
                        tslib_1.__metadata("design:type", Array)
                    ], CustomTypeBar.prototype, "prop", void 0);
                    CustomTypeBar = tslib_1.__decorate([
                        repository_1.model()
                    ], CustomTypeBar);
                    let TestModel = class TestModel {
                    };
                    tslib_1.__decorate([
                        repository_1.property(),
                        tslib_1.__metadata("design:type", CustomTypeBar)
                    ], TestModel.prototype, "cusBar", void 0);
                    TestModel = tslib_1.__decorate([
                        repository_1.model()
                    ], TestModel);
                    const jsonSchema = __1.modelToJsonSchema(TestModel);
                    const schemaProps = jsonSchema.properties;
                    const schemaDefs = jsonSchema.definitions;
                    testlab_1.expect(schemaProps).to.deepEqual({
                        cusBar: {
                            $ref: '#/definitions/CustomTypeBar',
                        },
                    });
                    testlab_1.expect(schemaDefs).to.deepEqual({
                        CustomTypeFoo: {
                            title: 'CustomTypeFoo',
                            type: 'object',
                            properties: {
                                prop: {
                                    type: 'string',
                                },
                            },
                            additionalProperties: false,
                        },
                        CustomTypeBar: {
                            title: 'CustomTypeBar',
                            type: 'object',
                            properties: {
                                prop: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/definitions/CustomTypeFoo',
                                    },
                                },
                            },
                            additionalProperties: false,
                        },
                    });
                    expect_valid_json_schema_1.expectValidJsonSchema(jsonSchema);
                });
            });
        });
        context('model conversion', () => {
            let Category = class Category {
            };
            tslib_1.__decorate([
                repository_1.property.array(() => Product),
                tslib_1.__metadata("design:type", Array)
            ], Category.prototype, "products", void 0);
            Category = tslib_1.__decorate([
                repository_1.model()
            ], Category);
            let Product = class Product {
            };
            tslib_1.__decorate([
                repository_1.property(() => Category),
                tslib_1.__metadata("design:type", Category)
            ], Product.prototype, "category", void 0);
            Product = tslib_1.__decorate([
                repository_1.model()
            ], Product);
            const expectedSchema = {
                title: 'Category',
                type: 'object',
                properties: {
                    products: {
                        type: 'array',
                        items: { $ref: '#/definitions/Product' },
                    },
                },
                additionalProperties: false,
                definitions: {
                    Product: {
                        title: 'Product',
                        type: 'object',
                        properties: {
                            category: {
                                $ref: '#/definitions/Category',
                            },
                        },
                        additionalProperties: false,
                    },
                },
            };
            it('handles circular references', () => {
                const schema = __1.modelToJsonSchema(Category);
                testlab_1.expect(schema).to.deepEqual(expectedSchema);
            });
        });
        context('additionalProperties', () => {
            it('assumes "strict: true" when not set', () => {
                let DefaultModel = class DefaultModel {
                };
                DefaultModel = tslib_1.__decorate([
                    repository_1.model()
                ], DefaultModel);
                const schema = __1.modelToJsonSchema(DefaultModel);
                testlab_1.expect(schema).to.containDeep({
                    additionalProperties: false,
                });
            });
            it('respects model setting "strict: true"', () => {
                let StrictModel = class StrictModel {
                };
                StrictModel = tslib_1.__decorate([
                    repository_1.model({ settings: { strict: true } })
                ], StrictModel);
                const schema = __1.modelToJsonSchema(StrictModel);
                testlab_1.expect(schema).to.containDeep({
                    additionalProperties: false,
                });
            });
            it('respects model setting "strict: false"', () => {
                let FreeFormModel = class FreeFormModel {
                };
                FreeFormModel = tslib_1.__decorate([
                    repository_1.model({ settings: { strict: false } })
                ], FreeFormModel);
                const schema = __1.modelToJsonSchema(FreeFormModel);
                testlab_1.expect(schema).to.containDeep({
                    additionalProperties: true,
                });
            });
        });
        it('uses title from model metadata instead of model name', () => {
            let Customer = class Customer {
            };
            Customer = tslib_1.__decorate([
                repository_1.model({ title: 'MyCustomer' })
            ], Customer);
            const schema = __1.modelToJsonSchema(Customer, {
                // trigger build of a custom title
                partial: true,
            });
            testlab_1.expect(schema.title).to.equal('MyCustomerPartial');
        });
        it('uses title from options instead of model name and computed suffix', () => {
            let TestModel = class TestModel {
            };
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], TestModel.prototype, "id", void 0);
            TestModel = tslib_1.__decorate([
                repository_1.model({ title: 'ShouldBeIgnored' })
            ], TestModel);
            const schema = __1.modelToJsonSchema(TestModel, {
                title: 'NewTestModel',
                partial: true,
                exclude: ['id'],
            });
            testlab_1.expect(schema.title).to.equal('NewTestModel');
        });
    });
    describe('getJsonSchema', () => {
        it('gets cached JSON schema if one exists', () => {
            let TestModel = class TestModel {
            };
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", Number)
            ], TestModel.prototype, "foo", void 0);
            TestModel = tslib_1.__decorate([
                repository_1.model()
            ], TestModel);
            const cachedSchema = {
                properties: {
                    cachedProperty: {
                        type: 'string',
                    },
                },
            };
            core_1.MetadataInspector.defineMetadata(__1.JSON_SCHEMA_KEY, { modelOnly: cachedSchema }, TestModel);
            const jsonSchema = __1.getJsonSchema(TestModel);
            testlab_1.expect(jsonSchema).to.eql(cachedSchema);
        });
        it('creates JSON schema if one does not already exist', () => {
            let NewModel = class NewModel {
            };
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], NewModel.prototype, "newProperty", void 0);
            NewModel = tslib_1.__decorate([
                repository_1.model()
            ], NewModel);
            const jsonSchema = __1.getJsonSchema(NewModel);
            testlab_1.expect(jsonSchema.properties).to.deepEqual({
                newProperty: {
                    type: 'string',
                },
            });
        });
        it('does not pollute the JSON schema options', () => {
            let Category = class Category {
            };
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], Category.prototype, "name", void 0);
            Category = tslib_1.__decorate([
                repository_1.model()
            ], Category);
            const JSON_SCHEMA_OPTIONS = {};
            __1.getJsonSchema(Category, JSON_SCHEMA_OPTIONS);
            testlab_1.expect(JSON_SCHEMA_OPTIONS).to.be.empty();
        });
        context('circular reference', () => {
            let Category = class Category {
            };
            tslib_1.__decorate([
                repository_1.property.array(() => Product),
                tslib_1.__metadata("design:type", Array)
            ], Category.prototype, "products", void 0);
            Category = tslib_1.__decorate([
                repository_1.model()
            ], Category);
            let Product = class Product {
            };
            tslib_1.__decorate([
                repository_1.property(() => Category),
                tslib_1.__metadata("design:type", Category)
            ], Product.prototype, "category", void 0);
            Product = tslib_1.__decorate([
                repository_1.model()
            ], Product);
            const expectedSchemaForCategory = {
                title: 'Category',
                type: 'object',
                properties: {
                    products: {
                        type: 'array',
                        items: { $ref: '#/definitions/Product' },
                    },
                },
                additionalProperties: false,
                definitions: {
                    Product: {
                        title: 'Product',
                        type: 'object',
                        properties: {
                            category: {
                                $ref: '#/definitions/Category',
                            },
                        },
                        additionalProperties: false,
                    },
                },
            };
            it('generates the schema without running into infinite loop', () => {
                const schema = __1.getJsonSchema(Category);
                testlab_1.expect(schema).to.deepEqual(expectedSchemaForCategory);
            });
        });
        it('converts HasMany and BelongsTo relation links', () => {
            let Product = class Product extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true }),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.belongsTo(() => Category),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "categoryId", void 0);
            Product = tslib_1.__decorate([
                repository_1.model()
            ], Product);
            let Category = class Category extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true }),
                tslib_1.__metadata("design:type", Number)
            ], Category.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.hasMany(() => Product),
                tslib_1.__metadata("design:type", Array)
            ], Category.prototype, "products", void 0);
            Category = tslib_1.__decorate([
                repository_1.model()
            ], Category);
            const expectedSchema = {
                definitions: {
                    ProductWithRelations: {
                        title: 'ProductWithRelations',
                        type: 'object',
                        description: `(tsType: ProductWithRelations, ` +
                            `schemaOptions: { includeRelations: true })`,
                        properties: {
                            id: { type: 'number' },
                            categoryId: { type: 'number' },
                            category: { $ref: '#/definitions/CategoryWithRelations' },
                        },
                        additionalProperties: false,
                    },
                },
                properties: {
                    id: { type: 'number' },
                    products: {
                        type: 'array',
                        items: { $ref: '#/definitions/ProductWithRelations' },
                    },
                },
                additionalProperties: false,
                title: 'CategoryWithRelations',
                type: 'object',
                description: `(tsType: CategoryWithRelations, ` +
                    `schemaOptions: { includeRelations: true })`,
            };
            const jsonSchema = __1.getJsonSchema(Category, { includeRelations: true });
            testlab_1.expect(jsonSchema).to.deepEqual(expectedSchema);
        });
        it('converts relation links when no other properties there', () => {
            let Product = class Product extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true }),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.belongsTo(() => CategoryWithoutProp),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "categoryId", void 0);
            Product = tslib_1.__decorate([
                repository_1.model()
            ], Product);
            let CategoryWithoutProp = class CategoryWithoutProp extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.hasMany(() => Product),
                tslib_1.__metadata("design:type", Array)
            ], CategoryWithoutProp.prototype, "products", void 0);
            CategoryWithoutProp = tslib_1.__decorate([
                repository_1.model()
            ], CategoryWithoutProp);
            const expectedSchema = {
                definitions: {
                    ProductWithRelations: {
                        title: 'ProductWithRelations',
                        type: 'object',
                        description: `(tsType: ProductWithRelations, ` +
                            `schemaOptions: { includeRelations: true })`,
                        properties: {
                            id: { type: 'number' },
                            categoryId: { type: 'number' },
                            category: {
                                $ref: '#/definitions/CategoryWithoutPropWithRelations',
                            },
                        },
                        additionalProperties: false,
                    },
                },
                properties: {
                    products: {
                        type: 'array',
                        items: { $ref: '#/definitions/ProductWithRelations' },
                    },
                },
                additionalProperties: false,
                title: 'CategoryWithoutPropWithRelations',
                type: 'object',
                description: `(tsType: CategoryWithoutPropWithRelations, ` +
                    `schemaOptions: { includeRelations: true })`,
            };
            // To check for case when there are no other properties than relational
            const jsonSchemaWithoutProp = __1.getJsonSchema(CategoryWithoutProp, {
                includeRelations: true,
            });
            testlab_1.expect(jsonSchemaWithoutProp).to.deepEqual(expectedSchema);
        });
        it('gets cached JSON schema with relation links if one exists', () => {
            let Product = class Product extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true }),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.belongsTo(() => Category),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "categoryId", void 0);
            Product = tslib_1.__decorate([
                repository_1.model()
            ], Product);
            let Category = class Category extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true }),
                tslib_1.__metadata("design:type", Number)
            ], Category.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.hasMany(() => Product),
                tslib_1.__metadata("design:type", Array)
            ], Category.prototype, "products", void 0);
            Category = tslib_1.__decorate([
                repository_1.model()
            ], Category);
            const cachedSchema = {
                definitions: {
                    ProductWithRelations: {
                        title: 'ProductWithRelations',
                        properties: {
                            id: { type: 'number' },
                            categoryId: { type: 'number' },
                            category: { $ref: '#/definitions/CategoryWithRelations' },
                        },
                        additionalProperties: false,
                    },
                },
                properties: {
                    id: { type: 'number' },
                    cachedProp: { type: 'string' },
                    products: {
                        type: 'array',
                        items: { $ref: '#/definitions/ProductWithRelations' },
                    },
                },
                additionalProperties: false,
                title: 'CategoryWithRelations',
            };
            core_1.MetadataInspector.defineMetadata(__1.JSON_SCHEMA_KEY, { modelWithRelations: cachedSchema }, Category);
            const jsonSchema = __1.getJsonSchema(Category, { includeRelations: true });
            testlab_1.expect(jsonSchema).to.eql(cachedSchema);
        });
        it('updates same cache with new key if one exists for model', () => {
            let Product = class Product extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true }),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.belongsTo(() => Category),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "categoryId", void 0);
            Product = tslib_1.__decorate([
                repository_1.model()
            ], Product);
            let Category = class Category extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true }),
                tslib_1.__metadata("design:type", Number)
            ], Category.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.hasMany(() => Product),
                tslib_1.__metadata("design:type", Array)
            ], Category.prototype, "products", void 0);
            Category = tslib_1.__decorate([
                repository_1.model()
            ], Category);
            const cachedSchema = {
                definitions: {
                    ProductWithRelations: {
                        title: 'ProductWithRelations',
                        type: 'object',
                        properties: {
                            id: { type: 'number' },
                            categoryId: { type: 'number' },
                            category: { $ref: '#/definitions/CategoryWithRelations' },
                        },
                        additionalProperties: false,
                    },
                },
                properties: {
                    id: { type: 'number' },
                    cachedProp: { type: 'string' },
                    products: {
                        type: 'array',
                        items: { $ref: '#/definitions/ProductWithRelations' },
                    },
                },
                additionalProperties: false,
                title: 'CategoryWithRelations',
                type: 'object',
            };
            core_1.MetadataInspector.defineMetadata(__1.JSON_SCHEMA_KEY, { modelWithRelations: cachedSchema }, Category);
            const jsonSchema = __1.getJsonSchema(Category);
            // Make sure it's not pulling the withrelations key
            testlab_1.expect(jsonSchema).to.not.eql(cachedSchema);
            testlab_1.expect(jsonSchema).to.eql({
                properties: {
                    id: { type: 'number' },
                },
                additionalProperties: false,
                title: 'Category',
                type: 'object',
            });
        });
        it('emits all properties as optional when the option "partial" is set', () => {
            let Product = class Product extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true, required: true }),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.property({ required: true }),
                tslib_1.__metadata("design:type", String)
            ], Product.prototype, "name", void 0);
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], Product.prototype, "optionalDescription", void 0);
            Product = tslib_1.__decorate([
                repository_1.model()
            ], Product);
            const originalSchema = __1.getJsonSchema(Product);
            testlab_1.expect(originalSchema.required).to.deepEqual(['id', 'name']);
            testlab_1.expect(originalSchema.title).to.equal('Product');
            const partialSchema = __1.getJsonSchema(Product, { partial: true });
            testlab_1.expect(partialSchema.required).to.equal(undefined);
            testlab_1.expect(partialSchema.title).to.equal('ProductPartial');
        });
        context('exclude properties when option "exclude" is set', () => {
            let Product = class Product extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true, required: true }),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], Product.prototype, "name", void 0);
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], Product.prototype, "description", void 0);
            Product = tslib_1.__decorate([
                repository_1.model()
            ], Product);
            it('excludes one property when the option "exclude" is set to exclude one property', () => {
                const originalSchema = __1.getJsonSchema(Product);
                testlab_1.expect(originalSchema.properties).to.deepEqual({
                    id: { type: 'number' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                });
                testlab_1.expect(originalSchema.title).to.equal('Product');
                const excludeIdSchema = __1.getJsonSchema(Product, { exclude: ['id'] });
                testlab_1.expect(excludeIdSchema).to.deepEqual({
                    title: 'ProductExcluding_id_',
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' },
                    },
                    additionalProperties: false,
                    description: `(tsType: Omit<Product, 'id'>, ` +
                        `schemaOptions: { exclude: [ 'id' ] })`,
                });
            });
            it('excludes multiple properties when the option "exclude" is set to exclude multiple properties', () => {
                const originalSchema = __1.getJsonSchema(Product);
                testlab_1.expect(originalSchema.properties).to.deepEqual({
                    id: { type: 'number' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                });
                testlab_1.expect(originalSchema.title).to.equal('Product');
                const excludeIdAndNameSchema = __1.getJsonSchema(Product, {
                    exclude: ['id', 'name'],
                });
                testlab_1.expect(excludeIdAndNameSchema).to.deepEqual({
                    title: 'ProductExcluding_id-name_',
                    type: 'object',
                    properties: {
                        description: { type: 'string' },
                    },
                    additionalProperties: false,
                    description: `(tsType: Omit<Product, 'id' | 'name'>, ` +
                        `schemaOptions: { exclude: [ 'id', 'name' ] })`,
                });
            });
            it(`doesn't exclude properties when the option "exclude" is set to exclude no properties`, () => {
                const originalSchema = __1.getJsonSchema(Product);
                testlab_1.expect(originalSchema.properties).to.deepEqual({
                    id: { type: 'number' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                });
                testlab_1.expect(originalSchema.title).to.equal('Product');
                const excludeNothingSchema = __1.getJsonSchema(Product, { exclude: [] });
                testlab_1.expect(excludeNothingSchema.properties).to.deepEqual({
                    id: { type: 'number' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                });
                testlab_1.expect(excludeNothingSchema.title).to.equal('Product');
            });
        });
        context('optional properties when option "optional" is set', () => {
            let Product = class Product extends repository_1.Entity {
            };
            tslib_1.__decorate([
                repository_1.property({ id: true, required: true }),
                tslib_1.__metadata("design:type", Number)
            ], Product.prototype, "id", void 0);
            tslib_1.__decorate([
                repository_1.property({ required: true }),
                tslib_1.__metadata("design:type", String)
            ], Product.prototype, "name", void 0);
            tslib_1.__decorate([
                repository_1.property(),
                tslib_1.__metadata("design:type", String)
            ], Product.prototype, "description", void 0);
            Product = tslib_1.__decorate([
                repository_1.model()
            ], Product);
            it('makes one property optional when the option "optional" includes one property', () => {
                const originalSchema = __1.getJsonSchema(Product);
                testlab_1.expect(originalSchema.required).to.deepEqual(['id', 'name']);
                testlab_1.expect(originalSchema.title).to.equal('Product');
                const optionalIdSchema = __1.getJsonSchema(Product, { optional: ['id'] });
                testlab_1.expect(optionalIdSchema.required).to.deepEqual(['name']);
                testlab_1.expect(optionalIdSchema.title).to.equal('ProductOptional_id_');
                testlab_1.expect(optionalIdSchema.description).to.endWith(`(tsType: @loopback/repository-json-schema#Optional<Product, 'id'>, ` +
                    `schemaOptions: { optional: [ 'id' ] })`);
            });
            it('makes multiple properties optional when the option "optional" includes multiple properties', () => {
                const originalSchema = __1.getJsonSchema(Product);
                testlab_1.expect(originalSchema.required).to.deepEqual(['id', 'name']);
                testlab_1.expect(originalSchema.title).to.equal('Product');
                const optionalIdAndNameSchema = __1.getJsonSchema(Product, {
                    optional: ['id', 'name'],
                });
                testlab_1.expect(optionalIdAndNameSchema.required).to.equal(undefined);
                testlab_1.expect(optionalIdAndNameSchema.title).to.equal('ProductOptional_id-name_');
                testlab_1.expect(optionalIdAndNameSchema.description).to.endWith(`(tsType: @loopback/repository-json-schema#Optional<Product, 'id' | 'name'>, ` +
                    `schemaOptions: { optional: [ 'id', 'name' ] })`);
            });
            it(`doesn't make properties optional when the option "optional" includes no properties`, () => {
                const originalSchema = __1.getJsonSchema(Product);
                testlab_1.expect(originalSchema.required).to.deepEqual(['id', 'name']);
                testlab_1.expect(originalSchema.title).to.equal('Product');
                const optionalNothingSchema = __1.getJsonSchema(Product, { optional: [] });
                testlab_1.expect(optionalNothingSchema.required).to.deepEqual(['id', 'name']);
                testlab_1.expect(optionalNothingSchema.title).to.equal('Product');
            });
            it('overrides "partial" option when "optional" option is set', () => {
                const originalSchema = __1.getJsonSchema(Product);
                testlab_1.expect(originalSchema.required).to.deepEqual(['id', 'name']);
                testlab_1.expect(originalSchema.title).to.equal('Product');
                let optionalNameSchema = __1.getJsonSchema(Product, {
                    partial: true,
                    optional: ['name'],
                });
                testlab_1.expect(optionalNameSchema.required).to.deepEqual(['id']);
                testlab_1.expect(optionalNameSchema.title).to.equal('ProductOptional_name_');
                testlab_1.expect(optionalNameSchema.description).to.endWith(`(tsType: @loopback/repository-json-schema#Optional<Product, 'name'>,` +
                    ` schemaOptions: { optional: [ 'name' ] })`);
                optionalNameSchema = __1.getJsonSchema(Product, {
                    partial: false,
                    optional: ['name'],
                });
                testlab_1.expect(optionalNameSchema.required).to.deepEqual(['id']);
                testlab_1.expect(optionalNameSchema.title).to.equal('ProductOptional_name_');
                testlab_1.expect(optionalNameSchema.description).to.endWith(`(tsType: @loopback/repository-json-schema#Optional<Product, 'name'>, ` +
                    `schemaOptions: { optional: [ 'name' ] })`);
            });
            it('uses "partial" option, if provided, when "optional" option is set but empty', () => {
                const originalSchema = __1.getJsonSchema(Product);
                testlab_1.expect(originalSchema.required).to.deepEqual(['id', 'name']);
                testlab_1.expect(originalSchema.title).to.equal('Product');
                const optionalNameSchema = __1.getJsonSchema(Product, {
                    partial: true,
                    optional: [],
                });
                testlab_1.expect(optionalNameSchema.required).to.equal(undefined);
                testlab_1.expect(optionalNameSchema.title).to.equal('ProductPartial');
            });
            it('can work with "optional" and "exclude" options together', () => {
                const originalSchema = __1.getJsonSchema(Product);
                testlab_1.expect(originalSchema.required).to.deepEqual(['id', 'name']);
                testlab_1.expect(originalSchema.title).to.equal('Product');
                const bothOptionsSchema = __1.getJsonSchema(Product, {
                    exclude: ['id'],
                    optional: ['name'],
                });
                testlab_1.expect(bothOptionsSchema.title).to.equal('ProductOptional_name_Excluding_id_');
                testlab_1.expect(bothOptionsSchema.description).to.endWith(`(tsType: @loopback/repository-json-schema#` +
                    `Optional<Omit<Product, 'id'>, 'name'>, ` +
                    `schemaOptions: { exclude: [ 'id' ], optional: [ 'name' ] })`);
            });
        });
        it('creates new cache entry for each custom title', () => {
            let TestModel = class TestModel {
            };
            TestModel = tslib_1.__decorate([
                repository_1.model()
            ], TestModel);
            // populate the cache
            __1.getJsonSchema(TestModel, { title: 'First' });
            __1.getJsonSchema(TestModel, { title: 'Second' });
            // obtain cached instances & verify the title
            const schema1 = __1.getJsonSchema(TestModel, { title: 'First' });
            testlab_1.expect(schema1.title).to.equal('First');
            const schema2 = __1.getJsonSchema(TestModel, { title: 'Second' });
            testlab_1.expect(schema2.title).to.equal('Second');
        });
    });
});
//# sourceMappingURL=build-schema.integration.js.map