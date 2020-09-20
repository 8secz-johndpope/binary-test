"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/security
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('typed principle', () => {
    it('returns the security id', () => {
        const principal = { [__1.securityId]: 'auser' };
        const typedPrincipal = new __1.TypedPrincipal(principal, 'USER');
        testlab_1.expect(typedPrincipal[__1.securityId]).to.eql('USER:auser');
    });
});
//# sourceMappingURL=principle.unit.js.map