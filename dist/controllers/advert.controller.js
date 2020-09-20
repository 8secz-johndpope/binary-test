"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-advert-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const repository_1 = require("@loopback/repository");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const keys_1 = require("../keys");
let AdvertController = class AdvertController {
    constructor(advertRepository, handler) {
        this.advertRepository = advertRepository;
        this.handler = handler;
    }
    async createAdvert(request, response) {
        // return this.advertRepository.create(advert);
        return new Promise((resolve, reject) => {
            this.handler(request, response, (err) => {
                if (err)
                    reject(err);
                else {
                    resolve(this.getFilesAndFields(request));
                }
            });
        });
    }
    /**
     * Get files and fields for the request
     * @param request - Http request
     */
    getFilesAndFields(request) {
        const uploadedFiles = request.files;
        const mapper = (f) => ({
            fieldname: f.fieldname,
            originalname: f.originalname,
            encoding: f.encoding,
            mimetype: f.mimetype,
            size: f.size,
        });
        let files = [];
        if (Array.isArray(uploadedFiles)) {
            files = uploadedFiles.map(mapper);
        }
        else {
            for (const filename in uploadedFiles) {
                files.push(...uploadedFiles[filename].map(mapper));
            }
        }
        // since we are only allow 1 file at a time
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const file = files[0];
        // creating the advert
        return this.advertRepository.create({
            title: request.body['title'],
            description: request.body['description'],
            mediaType: file.mimetype === 'video/mp4' ? 'video' : 'image',
            mediaLink: '/file/' + file.originalname,
        });
        // return {files, fields: request.body};
    }
    async findAdvertById(id, items) {
        return this.advertRepository.findById(id);
    }
    async findAdverts(filter) {
        return this.advertRepository.find(filter);
    }
    async findAllAdverts(filter) {
        return this.advertRepository.find(filter);
    }
    async replaceAdvert(id, advert) {
        await this.advertRepository.replaceById(id, advert);
    }
    async updateAdvert(id, advert) {
        await this.advertRepository.updateById(id, advert);
    }
    async deleteAdvert(id) {
        await this.advertRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    authentication_1.authenticate.skip(),
    rest_1.post('/advert', {
        responses: {
            '200': {
                description: 'Advert model instance',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.Advert) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.requestBody.file()),
    tslib_1.__param(1, core_1.inject(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdvertController.prototype, "createAdvert", null);
tslib_1.__decorate([
    rest_1.get('/advert/{id}', {
        responses: {
            '200': {
                description: 'Advert model instance',
                content: { 'application/json': { schema: rest_1.getModelSchemaRef(models_1.Advert) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.query.boolean('items')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
], AdvertController.prototype, "findAdvertById", null);
tslib_1.__decorate([
    rest_1.get('/advert', {
        responses: {
            '200': {
                description: 'Array of Advert model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Advert) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Advert)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdvertController.prototype, "findAdverts", null);
tslib_1.__decorate([
    authentication_1.authenticate.skip(),
    rest_1.get('/adverts', {
        responses: {
            '200': {
                description: 'Public API -Array of all Advert model instances',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: rest_1.getModelSchemaRef(models_1.Advert) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Advert)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdvertController.prototype, "findAllAdverts", null);
tslib_1.__decorate([
    rest_1.put('/advert/{id}', {
        responses: {
            '204': {
                description: 'Advert PUT success',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.requestBody()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, models_1.Advert]),
    tslib_1.__metadata("design:returntype", Promise)
], AdvertController.prototype, "replaceAdvert", null);
tslib_1.__decorate([
    rest_1.patch('/advert/{id}', {
        responses: {
            '204': {
                description: 'Advert PATCH success',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.requestBody({
        content: {
            'application/json': {
                schema: rest_1.getModelSchemaRef(models_1.Advert, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdvertController.prototype, "updateAdvert", null);
tslib_1.__decorate([
    rest_1.del('/advert/{id}', {
        responses: {
            '204': {
                description: 'Advert DELETE success',
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], AdvertController.prototype, "deleteAdvert", null);
AdvertController = tslib_1.__decorate([
    authentication_1.authenticate('jwt'),
    tslib_1.__param(0, repository_1.repository(repositories_1.AdvertRepository)),
    tslib_1.__param(1, core_1.inject(keys_1.FILE_UPLOAD_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.AdvertRepository, Function])
], AdvertController);
exports.AdvertController = AdvertController;
//# sourceMappingURL=advert.controller.js.map