"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const child_process_1 = require("child_process");
const app = require.resolve('./application-with-shutdown');
const isWindows = process.platform === 'win32';
describe('Application shutdown hooks', () => {
    testlab_1.skipIf(isWindows, it, 'traps registered signals - SIGTERM', () => {
        return testSignal('SIGTERM');
    });
    testlab_1.skipIf(isWindows, it, 'traps registered signals with grace period - SIGTERM', () => {
        // No 'stopped` is recorded
        return testSignal('SIGTERM', 5, ['start\n', 'stop\n']);
    });
    testlab_1.skipIf(isWindows, it, 'traps registered signals - SIGINT', () => {
        return testSignal('SIGINT');
    });
    testlab_1.skipIf(isWindows, it, 'does not trap unregistered signals - SIGHUP', () => {
        return testSignal('SIGHUP', undefined, ['start\n']);
    });
    function normalizeStdoutData(output) {
        // The received events can be `['start\n', 'stop\nstopped\n']` instead
        // of [ 'start\n', 'stop\n', 'stopped\n' ]
        return output.join('');
    }
    function createAppWithShutdown(expectedSignal, gracePeriod, expectedEvents) {
        let args = [];
        if (typeof gracePeriod === 'number') {
            args = [gracePeriod.toString()];
        }
        const child = child_process_1.fork(app, args, {
            stdio: 'pipe',
        });
        const events = [];
        // Wait until the child process logs `start`
        const childStart = new Promise(resolve => {
            child.stdout.on('data', (buf) => {
                events.push(buf.toString('utf-8'));
                resolve(child);
            });
        });
        // Wait until the child process exits
        const childExit = new Promise((resolve, reject) => {
            child.on('exit', (code, sig) => {
                if (typeof sig === 'string') {
                    // FIXME(rfeng): For some reason, the sig can be null
                    testlab_1.expect(sig).to.eql(expectedSignal);
                }
                // The received events can be `['start\n', 'stop\nstopped\n']` instead
                // of [ 'start\n', 'stop\n', 'stopped\n' ]
                testlab_1.expect(normalizeStdoutData(events)).to.eql(normalizeStdoutData(expectedEvents));
                resolve();
            });
            child.on('error', err => {
                reject(err);
            });
        });
        return { childStart, childExit };
    }
    async function testSignal(expectedSignal, gracePeriod = undefined, expectedEvents = ['start\n', 'stop\n', 'stopped\n']) {
        const { childStart, childExit } = createAppWithShutdown(expectedSignal, gracePeriod, expectedEvents);
        const child = await childStart;
        // Send SIGTERM signal to the child process
        child.kill(expectedSignal);
        return childExit;
    }
});
//# sourceMappingURL=application.shutdown.acceptance.js.map