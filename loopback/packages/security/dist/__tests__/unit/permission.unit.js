"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/security
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
const types_1 = require("../../types");
describe('Permission', () => {
    it('generates security id', () => {
        const permission = new __1.Permission();
        permission.action = 'create';
        permission.resourceType = 'order';
        testlab_1.expect(permission[types_1.securityId]).to.eql('order:create');
    });
    it('generates security id with resource property', () => {
        const permission = new __1.Permission();
        permission.action = 'read';
        permission.resourceType = 'user';
        permission.resourceProperty = 'email';
        testlab_1.expect(permission[types_1.securityId]).to.eql('user.email:read');
    });
    it('generates security id with resource id', () => {
        const permission = new __1.Permission();
        permission.action = 'delete';
        permission.resourceType = 'order';
        permission.resourceId = '001';
        testlab_1.expect(permission[types_1.securityId]).to.eql('order:delete:001');
    });
});
//# sourceMappingURL=permission.unit.js.map