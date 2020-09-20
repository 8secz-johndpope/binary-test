"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
let app;
let server;
describe('ContextView', () => {
    let viewOfControllers;
    beforeEach(givenViewForControllers);
    it('watches matching bindings', async () => {
        // We have server: ServerController, app: AppController
        testlab_1.expect(await getControllers()).to.eql([
            'ServerController',
            'AppController',
        ]);
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
    function givenViewForControllers() {
        givenServerWithinAnApp();
        viewOfControllers = server.createView(__1.filterByTag('controller'));
        givenController(server, 'ServerController');
        givenController(app, 'AppController');
    }
    function givenController(context, name) {
        class MyController {
            constructor() {
                this.name = name;
            }
        }
        context.bind(`controllers.${name}`).toClass(MyController).tag('controller');
    }
    async function getControllers() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (await viewOfControllers.values()).map((v) => v.name);
    }
});
function givenServerWithinAnApp() {
    app = new __1.Context('app');
    server = new __1.Context(app, 'server');
}
//# sourceMappingURL=context-view.acceptance.js.map