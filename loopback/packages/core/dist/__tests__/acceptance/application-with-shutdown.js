"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/core
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const __1 = require("../..");
const sleep = util_1.promisify(setTimeout);
function main() {
    // Optional argument as the grace period
    const gracePeriod = Number.parseFloat(process.argv[2]);
    class MyTimer {
        start() {
            console.log('start');
            this.timer = setTimeout(() => {
                console.log('timeout');
            }, 30000);
        }
        async stop() {
            console.log('stop');
            clearTimeout(this.timer);
            if (gracePeriod >= 0) {
                // Set a longer sleep to trigger force kill
                await sleep(gracePeriod + 100);
            }
            console.log('stopped');
        }
    }
    const app = new __1.Application({
        shutdown: { signals: ['SIGTERM', 'SIGINT'], gracePeriod },
    });
    app.lifeCycleObserver(MyTimer);
    app.start().catch(err => {
        console.error(err);
        process.exit(1);
    });
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=application-with-shutdown.js.map