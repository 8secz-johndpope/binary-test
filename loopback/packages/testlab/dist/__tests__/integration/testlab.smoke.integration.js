"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const assert_1 = tslib_1.__importDefault(require("assert"));
const testlab = tslib_1.__importStar(require("../.."));
describe('testlab smoke test', () => {
    it('exports expect interface', () => {
        assert_1.default.equal(typeof testlab.expect, 'function');
    });
});
//# sourceMappingURL=testlab.smoke.integration.js.map