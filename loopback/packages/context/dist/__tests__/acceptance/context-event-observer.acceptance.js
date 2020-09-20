"use strict";
// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
let app;
let server;
describe('ContextEventObserver', () => {
    let contextObserver;
    beforeEach(givenControllerObserver);
    it('receives notifications of matching binding events', async () => {
        const controllers = await getControllers();
        // We have server: ServerController, app: AppController
        // NOTE: The controllers are not guaranteed to be ['ServerController`,
        // 'AppController'] as the events are emitted by two context objects and
        // they are processed asynchronously
        testlab_1.expect(controllers).to.containEql('ServerController');
        testlab_1.expect(controllers).to.containEql('AppController');
        server.unbind('controllers.ServerController');
        // Now we have app: AppController
        testlab_1.expect(await getControllers()).to.eql(['AppController']);
        app.unbind('controllers.AppController');
        // All controllers are gone from the context chain
        testlab_1.expect(await getControllers()).to.eql([]);
        // Add a new controller - server: AnotherServerController
        givenController(server, 'AnotherServerController');
        testlab_1.expect(await getControllers()).to.eql(['AnotherServerController']);
    });
    class MyObserverForControllers {
        constructor() {
            this.controllers = new Set();
            this.filter = __1.filterByTag('controller');
        }
        observe(event, binding) {
            if (event === 'bind') {
                this.controllers.add(binding.tagMap.name);
            }
            else if (event === 'unbind') {
                this.controllers.delete(binding.tagMap.name);
            }
        }
    }
    function givenControllerObserver() {
        givenServerWithinAnApp();
        contextObserver = new MyObserverForControllers();
        server.subscribe(contextObserver);
        givenController(server, 'ServerController');
        givenController(app, 'AppController');
    }
    function givenController(ctx, controllerName) {
        class MyController {
            constructor() {
                this.name = controllerName;
            }
        }
        ctx
            .bind(`controllers.${controllerName}`)
            .toClass(MyController)
            .tag('controller', { name: controllerName });
    }
    async function getControllers() {
        return new Promise(resolve => {
            // Wrap it inside `setImmediate` to make the events are triggered
            setImmediate(() => resolve(Array.from(contextObserver.controllers)));
        });
    }
});
function givenServerWithinAnApp() {
    app = new __1.Context('app');
    server = new __1.Context(app, 'server');
}
//# sourceMappingURL=context-event-observer.acceptance.js.map