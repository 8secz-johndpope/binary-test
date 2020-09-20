"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const models_1 = require("../models");
let AdvertRepository = class AdvertRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.Advert, dataSource);
    }
};
AdvertRepository = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject('datasources.db')),
    tslib_1.__metadata("design:paramtypes", [repository_1.juggler.DataSource])
], AdvertRepository);
exports.AdvertRepository = AdvertRepository;
//# sourceMappingURL=advert.repository.js.map