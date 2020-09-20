"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/openapi-spec-builder
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const openapi_spec_builder_1 = require("../../openapi-spec-builder");
describe('OpenAPI Spec Builder', () => {
    describe('anOpenApiSpec', () => {
        it('creates an empty spec', () => {
            const spec = openapi_spec_builder_1.anOpenApiSpec().build();
            testlab_1.expect(spec).to.eql({
                openapi: '3.0.0',
                info: {
                    title: 'LoopBack Application',
                    version: '1.0.0',
                },
                paths: {},
                servers: [{ url: '/' }],
            });
        });
        it('adds an extension', () => {
            const spec = openapi_spec_builder_1.anOpenApiSpec()
                .withExtension('x-loopback-version', '4.0')
                .build();
            testlab_1.expect(spec).to.containEql({ 'x-loopback-version': '4.0' });
        });
        it('adds an operation', () => {
            const opSpec = openapi_spec_builder_1.anOperationSpec().build();
            const spec = openapi_spec_builder_1.anOpenApiSpec()
                .withOperation('get', '/users', opSpec)
                .build();
            testlab_1.expect(spec.paths).to.containEql({
                '/users': {
                    get: opSpec,
                },
            });
        });
        it('adds components', () => {
            const comSpec = openapi_spec_builder_1.aComponentsSpec().build();
            const spec = openapi_spec_builder_1.anOpenApiSpec().withComponents(comSpec).build();
            testlab_1.expect(spec.components).to.containEql(comSpec);
        });
    });
    describe('anOperationSpec', () => {
        it('creates an empty spec', () => {
            const spec = openapi_spec_builder_1.anOperationSpec().build();
            testlab_1.expect(spec).to.eql({
                responses: { '200': { description: 'An undocumented response body.' } },
            });
        });
        it('adds an extension', () => {
            const spec = openapi_spec_builder_1.anOperationSpec()
                .withExtension('x-loopback-authentication', 'oAuth2')
                .build();
            testlab_1.expect(spec).to.containEql({ 'x-loopback-authentication': 'oAuth2' });
        });
        it('sets controller name', () => {
            const spec = openapi_spec_builder_1.anOperationSpec().withControllerName('MyController').build();
            testlab_1.expect(spec).to.containEql({ 'x-controller-name': 'MyController' });
        });
        it('sets operation name', () => {
            const spec = openapi_spec_builder_1.anOperationSpec().withOperationName('greet').build();
            testlab_1.expect(spec).to.containEql({ 'x-operation-name': 'greet' });
        });
        it('sets operationId', () => {
            const spec = openapi_spec_builder_1.anOperationSpec()
                .withOperationId('MyController.greet')
                .build();
            testlab_1.expect(spec).to.containEql({ operationId: 'MyController.greet' });
        });
        it('sets operationId from controller/operation name', () => {
            const spec = openapi_spec_builder_1.anOperationSpec()
                .withControllerName('MyController')
                .withOperationName('greet')
                .build();
            testlab_1.expect(spec).to.containEql({ operationId: 'MyController.greet' });
        });
        it('does not set operationId without operation name', () => {
            const spec = openapi_spec_builder_1.anOperationSpec().withControllerName('MyController').build();
            testlab_1.expect(spec.operationId).to.be.undefined();
        });
        it('does not set operationId without controller name', () => {
            const spec = openapi_spec_builder_1.anOperationSpec().withOperationName('greet').build();
            testlab_1.expect(spec.operationId).to.be.undefined();
        });
        it('sets tags', () => {
            const spec = openapi_spec_builder_1.anOperationSpec()
                .withTags('loopback')
                .withTags(['customer'])
                .build();
            testlab_1.expect(spec.tags).to.eql(['loopback', 'customer']);
        });
        it('sets response', () => {
            const spec = openapi_spec_builder_1.anOperationSpec()
                .withResponse(200, { description: 'My response' })
                .build();
            testlab_1.expect(spec.responses).to.eql({ '200': { description: 'My response' } });
        });
        it('sets string response', () => {
            const spec = openapi_spec_builder_1.anOperationSpec().withStringResponse(200).build();
            testlab_1.expect(spec.responses).to.eql({
                '200': {
                    description: 'The string result.',
                    content: {
                        'text/plain': {
                            schema: { type: 'string' },
                        },
                    },
                },
            });
        });
        it('sets parameters', () => {
            const apiKey = {
                name: 'apiKey',
                in: 'header',
                schema: { type: 'string' },
            };
            const limit = {
                name: 'limit',
                in: 'query',
                schema: { type: 'number' },
            };
            const spec = openapi_spec_builder_1.anOperationSpec().withParameter(apiKey, limit).build();
            testlab_1.expect(spec.parameters).to.eql([apiKey, limit]);
        });
    });
    describe('aComponentsSpec', () => {
        it('creates an empty spec', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec().build();
            testlab_1.expect(spec).to.eql({});
        });
        it('adds a spec to schemas', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec()
                .withSchema('TestSchema', { type: 'object' })
                .build();
            testlab_1.expect(spec.schemas).to.eql({
                TestSchema: { type: 'object' },
            });
        });
        it('adds a spec to responses', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec()
                .withResponse('TestResponse', { description: 'test' })
                .build();
            testlab_1.expect(spec.responses).to.eql({
                TestResponse: { description: 'test' },
            });
        });
        it('adds a spec to parameters', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec()
                .withParameter('TestParameter', { name: 'test', in: 'path' })
                .build();
            testlab_1.expect(spec.parameters).to.eql({
                TestParameter: { name: 'test', in: 'path' },
            });
        });
        it('adds a spec to examples', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec()
                .withExample('TestExample', { description: 'test', anyProp: {} })
                .build();
            testlab_1.expect(spec.examples).to.eql({
                TestExample: { description: 'test', anyProp: {} },
            });
        });
        it('adds a spec to requestBodies', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec()
                .withRequestBody('TestRequestBody', { content: { 'application/json': {} } })
                .build();
            testlab_1.expect(spec.requestBodies).to.eql({
                TestRequestBody: { content: { 'application/json': {} } },
            });
        });
        it('adds a spec to headers', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec()
                .withHeader('TestHeader', { description: 'test' })
                .build();
            testlab_1.expect(spec.headers).to.eql({
                TestHeader: { description: 'test' },
            });
        });
        it('adds a spec to securitySchemes', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec()
                .withSecurityScheme('TestSecurityScheme', { type: 'http' })
                .build();
            testlab_1.expect(spec.securitySchemes).to.eql({
                TestSecurityScheme: { type: 'http' },
            });
        });
        it('adds a spec to links', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec()
                .withLink('TestLink', { description: 'test', anyProp: {} })
                .build();
            testlab_1.expect(spec.links).to.eql({
                TestLink: { description: 'test', anyProp: {} },
            });
        });
        it('adds a spec to callbacks', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec()
                .withCallback('TestCallback', { anyProp: {} })
                .build();
            testlab_1.expect(spec.callbacks).to.eql({
                TestCallback: { anyProp: {} },
            });
        });
        it('adds an extension', () => {
            const spec = openapi_spec_builder_1.aComponentsSpec()
                .withExtension('x-loopback-test', 'test')
                .build();
            testlab_1.expect(spec).to.containEql({ 'x-loopback-test': 'test' });
        });
    });
});
//# sourceMappingURL=openapi-spec-builder.unit.js.map