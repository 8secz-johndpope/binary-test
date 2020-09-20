"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_DIRECTORY = exports.FILE_UPLOAD_SERVICE = void 0;
const core_1 = require("@loopback/core");
/**
 * Binding key for the file upload service
 */
exports.FILE_UPLOAD_SERVICE = core_1.BindingKey.create('services.FileUpload');
/**
 * Binding key for the storage directory
 */
exports.STORAGE_DIRECTORY = core_1.BindingKey.create('storage.directory');
//# sourceMappingURL=keys.js.map