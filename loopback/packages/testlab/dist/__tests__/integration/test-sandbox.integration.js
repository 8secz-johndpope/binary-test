"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/testlab
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const __1 = require("../..");
const FIXTURES = path_1.resolve(__dirname, '../../../fixtures');
describe('TestSandbox integration tests', () => {
    let sandbox;
    let path;
    const COPY_FILE = 'copy-me.txt';
    const COPY_FILE_PATH = path_1.resolve(FIXTURES, COPY_FILE);
    beforeEach(createSandbox);
    beforeEach(givenPath);
    afterEach(deleteSandbox);
    it('returns path of sandbox and it exists', async () => {
        __1.expect(path).to.be.a.String();
        __1.expect(await fs_extra_1.pathExists(path)).to.be.True();
    });
    it('creates a directory in the sandbox', async () => {
        const dir = 'controllers';
        await sandbox.mkdir(dir);
        __1.expect(await fs_extra_1.pathExists(path_1.resolve(path, dir))).to.be.True();
    });
    it('copies a file to the sandbox', async () => {
        await sandbox.copyFile(COPY_FILE_PATH);
        __1.expect(await fs_extra_1.pathExists(path_1.resolve(path, COPY_FILE))).to.be.True();
        await expectFilesToBeIdentical(COPY_FILE_PATH, path_1.resolve(path, COPY_FILE));
    });
    it('copies a file to the sandbox with transform', async () => {
        await sandbox.copyFile(COPY_FILE_PATH, undefined, content => content.toUpperCase());
        const dest = path_1.resolve(path, COPY_FILE);
        __1.expect(await fs_extra_1.pathExists(dest)).to.be.True();
        const content = await fs_extra_1.readFile(dest, 'utf-8');
        __1.expect(content).to.equal('HELLO WORLD!');
    });
    it('copies a file to the sandbox with dest and transform', async () => {
        const rename = 'copy.me.js';
        await sandbox.copyFile(COPY_FILE_PATH, rename, content => content.toUpperCase());
        const dest = path_1.resolve(path, rename);
        __1.expect(await fs_extra_1.pathExists(dest)).to.be.True();
        const content = await fs_extra_1.readFile(dest, 'utf-8');
        __1.expect(content).to.equal('HELLO WORLD!');
    });
    it('copies and renames the file to the sandbox', async () => {
        const rename = 'copy.me.js';
        await sandbox.copyFile(COPY_FILE_PATH, rename);
        __1.expect(await fs_extra_1.pathExists(path_1.resolve(path, COPY_FILE))).to.be.False();
        __1.expect(await fs_extra_1.pathExists(path_1.resolve(path, rename))).to.be.True();
        await expectFilesToBeIdentical(COPY_FILE_PATH, path_1.resolve(path, rename));
    });
    it('copies file to a directory', async () => {
        const dir = 'test';
        const rename = `${dir}/${COPY_FILE}`;
        await sandbox.copyFile(COPY_FILE_PATH, rename);
        __1.expect(await fs_extra_1.pathExists(path_1.resolve(path, rename))).to.be.True();
        await expectFilesToBeIdentical(COPY_FILE_PATH, path_1.resolve(path, rename));
    });
    it('updates source map path for a copied file', async () => {
        const file = 'test.js';
        const resolvedFile = path_1.resolve(__dirname, '../fixtures/test.js');
        const sourceMapString = `//# sourceMappingURL=${resolvedFile}.map`;
        await sandbox.copyFile(resolvedFile);
        const fileContents = (await fs_extra_1.readFile(path_1.resolve(path, file), 'utf8')).split('\n');
        __1.expect(fileContents.pop()).to.equal(sourceMapString);
    });
    it('creates a JSON file in the sandbox', async () => {
        await sandbox.writeJsonFile('data.json', { key: 'value' });
        const fullPath = path_1.resolve(path, 'data.json');
        __1.expect(await fs_extra_1.pathExists(fullPath)).to.be.True();
        const content = await fs_extra_1.readFile(fullPath, 'utf-8');
        __1.expect(content).to.equal('{\n  "key": "value"\n}\n');
    });
    it('creates a text file in the sandbox', async () => {
        await sandbox.writeTextFile('data.txt', 'Hello');
        const fullPath = path_1.resolve(path, 'data.txt');
        __1.expect(await fs_extra_1.pathExists(fullPath)).to.be.True();
        const content = await fs_extra_1.readFile(fullPath, 'utf-8');
        __1.expect(content).to.equal('Hello');
    });
    it('resets the sandbox', async () => {
        const file = 'test.js';
        const resolvedFile = path_1.resolve(__dirname, '../fixtures/test.js');
        await sandbox.copyFile(resolvedFile);
        await sandbox.reset();
        __1.expect(await fs_extra_1.pathExists(path_1.resolve(path, file))).to.be.False();
    });
    it('decaches files from npm require when sandbox is reset', async () => {
        const file = 'test.json';
        await fs_extra_1.writeJSON(path_1.resolve(path, file), { x: 1 });
        const data = require(path_1.resolve(path, file));
        __1.expect(data).to.be.eql({ x: 1 });
        await sandbox.reset();
        await fs_extra_1.writeJSON(path_1.resolve(path, file), { x: 2 });
        const data2 = require(path_1.resolve(path, file));
        __1.expect(data2).to.be.eql({ x: 2 });
    });
    it('deletes the test sandbox', async () => {
        await sandbox.delete();
        __1.expect(await fs_extra_1.pathExists(path)).to.be.False();
    });
    describe('after deleting sandbox', () => {
        const ERR = 'TestSandbox instance was deleted. Create a new instance.';
        beforeEach(callSandboxDelete);
        it('throws an error when trying to call getPath()', () => {
            __1.expect(() => sandbox.path).to.throw(ERR);
        });
        it('throws an error when trying to call mkdir()', async () => {
            await __1.expect(sandbox.mkdir('test')).to.be.rejectedWith(ERR);
        });
        it('throws an error when trying to call copy()', async () => {
            await __1.expect(sandbox.copyFile(COPY_FILE_PATH)).to.be.rejectedWith(ERR);
        });
        it('throws an error when trying to call reset()', async () => {
            await __1.expect(sandbox.reset()).to.be.rejectedWith(ERR);
        });
        it('throws an error when trying to call delete() again', async () => {
            await __1.expect(sandbox.delete()).to.be.rejectedWith(ERR);
        });
    });
    async function callSandboxDelete() {
        await sandbox.delete();
    }
    async function expectFilesToBeIdentical(original, copied) {
        const originalContent = await fs_extra_1.readFile(original, 'utf8');
        const copiedContent = await fs_extra_1.readFile(copied, 'utf8');
        __1.expect(copiedContent).to.equal(originalContent);
    }
    function createSandbox() {
        sandbox = new __1.TestSandbox(path_1.resolve(__dirname, '../../.sandbox'));
    }
    function givenPath() {
        path = sandbox.path;
    }
    async function deleteSandbox() {
        if (!(await fs_extra_1.pathExists(path)))
            return;
        await fs_extra_1.remove(sandbox.path);
    }
});
//# sourceMappingURL=test-sandbox.integration.js.map