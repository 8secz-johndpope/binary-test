"use strict";
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const __1 = require("../..");
const SANDBOX_PATH = path_1.resolve(__dirname, '../../.sandbox');
describe('TestSandbox', () => {
    it('creates a subdir by default', () => {
        const sandbox = new __1.TestSandbox(SANDBOX_PATH);
        __1.expect(sandbox.path).to.not.eql(SANDBOX_PATH);
        __1.expect(path_1.dirname(sandbox.path)).to.eql(SANDBOX_PATH);
    });
    it('creates a unique subdir by default', () => {
        const sandbox1 = new __1.TestSandbox(SANDBOX_PATH);
        const sandbox2 = new __1.TestSandbox(SANDBOX_PATH);
        __1.expect(sandbox1.path).to.not.eql(sandbox2.path);
    });
    it('creates a unique subdir if it is true', () => {
        const sandbox1 = new __1.TestSandbox(SANDBOX_PATH, { subdir: true });
        const sandbox2 = new __1.TestSandbox(SANDBOX_PATH, { subdir: true });
        __1.expect(sandbox1.path).to.not.eql(sandbox2.path);
    });
    it('creates a named subdir', () => {
        const sandbox = new __1.TestSandbox(SANDBOX_PATH, { subdir: 'd1' });
        __1.expect(sandbox.path).to.not.eql(SANDBOX_PATH);
        __1.expect(path_1.dirname(sandbox.path)).to.eql(SANDBOX_PATH);
        __1.expect(sandbox.path).to.eql(path_1.join(SANDBOX_PATH, 'd1'));
    });
    it('does not creates a subdir if it is false', () => {
        const sandbox = new __1.TestSandbox(SANDBOX_PATH, { subdir: false });
        __1.expect(sandbox.path).to.eql(SANDBOX_PATH);
    });
    it("does not creates a subdir if it is '.'", () => {
        const sandbox = new __1.TestSandbox(SANDBOX_PATH, { subdir: '.' });
        __1.expect(sandbox.path).to.eql(SANDBOX_PATH);
    });
    it("does not creates a subdir if it is ''", () => {
        const sandbox = new __1.TestSandbox(SANDBOX_PATH, { subdir: '' });
        __1.expect(sandbox.path).to.eql(SANDBOX_PATH);
    });
});
//# sourceMappingURL=test-sandbox.unit.js.map