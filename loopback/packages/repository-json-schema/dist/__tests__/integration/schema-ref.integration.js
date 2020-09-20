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
describe('getJsonSchemaRef', () => {
    it('creates spec referencing shared model schema', () => {
        let MyModel = class MyModel {
        };
        tslib_1.__decorate([
            repository_1.property(),
            tslib_1.__metadata("design:type", String)
        ], MyModel.prototype, "name", void 0);
        MyModel = tslib_1.__decorate([
            repository_1.model()
        ], MyModel);
        const spec = __1.getJsonSchemaRef(MyModel);
        testlab_1.expect(spec).to.deepEqual({
            $ref: '#/definitions/MyModel',
            definitions: {
                MyModel: {
                    title: 'MyModel',
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                    },
                    additionalProperties: false,
                },
            },
        });
    });
});
//# sourceMappingURL=schema-ref.integration.js.map