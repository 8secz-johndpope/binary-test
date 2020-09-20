"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const __1 = require("../..");
describe('Context bindings - injecting configuration for bound artifacts', () => {
    let ctx;
    beforeEach(givenContext);
    it('binds configuration independent of binding', async () => {
        // Bind configuration
        ctx.configure('servers.rest.server1').to({ port: 3000 });
        // Bind RestServer
        ctx.bind('servers.rest.server1').toClass(RestServer);
        // Resolve an instance of RestServer
        // Expect server1.config to be `{port: 3000}
        const server1 = await ctx.get('servers.rest.server1');
        testlab_1.expect(server1.configObj).to.eql({ port: 3000 });
    });
    it('configures an artifact with a dynamic source', async () => {
        // Bind configuration
        ctx
            .configure('servers.rest.server1')
            .toDynamicValue(() => Promise.resolve({ port: 3000 }));
        // Bind RestServer
        ctx.bind('servers.rest.server1').toClass(RestServer);
        // Resolve an instance of RestServer
        // Expect server1.config to be `{port: 3000}
        const server1 = await ctx.get('servers.rest.server1');
        testlab_1.expect(server1.configObj).to.eql({ port: 3000 });
    });
    it('configures an artifact with alias', async () => {
        // Configure rest server 1 to reference `rest` property of the application
        // configuration
        ctx
            .configure('servers.rest.server1')
            .toAlias(__1.configBindingKeyFor('application', 'rest'));
        // Configure the application
        ctx.configure('application').to({ rest: { port: 3000 } });
        // Bind RestServer
        ctx.bind('servers.rest.server1').toClass(RestServer);
        // Resolve an instance of RestServer
        // Expect server1.config to be `{port: 3000}
        const server1 = await ctx.get('servers.rest.server1');
        testlab_1.expect(server1.configObj).to.eql({ port: 3000 });
    });
    it('reports error if @config.* is applied more than once', () => {
        testlab_1.expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class TestClass {
                constructor() { }
            }
            tslib_1.__decorate([
                __1.config('foo'),
                __1.config('bar'),
                tslib_1.__metadata("design:type", String)
            ], TestClass.prototype, "foo", void 0);
        }).to.throw('@config cannot be applied more than once on TestClass.prototype.foo');
    });
    it('allows propertyPath for injection', async () => {
        let RestServerWithPort = class RestServerWithPort {
            constructor(port) {
                this.port = port;
            }
        };
        RestServerWithPort = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('port')),
            tslib_1.__metadata("design:paramtypes", [Number])
        ], RestServerWithPort);
        // Bind configuration
        ctx
            .configure('servers.rest.server1')
            .toDynamicValue(() => Promise.resolve({ port: 3000 }));
        // Bind RestServer
        ctx.bind('servers.rest.server1').toClass(RestServerWithPort);
        // Resolve an instance of RestServer
        // Expect server1.config to be `{port: 3000}
        const server1 = await ctx.get('servers.rest.server1');
        testlab_1.expect(server1.port).to.eql(3000);
    });
    it('allows propertyPath for injection metadata', async () => {
        let RestServerWithPort = class RestServerWithPort {
            constructor(port) {
                this.port = port;
            }
        };
        RestServerWithPort = tslib_1.__decorate([
            tslib_1.__param(0, __1.config({ propertyPath: 'port' })),
            tslib_1.__metadata("design:paramtypes", [Number])
        ], RestServerWithPort);
        // Bind configuration
        ctx
            .configure('servers.rest.server1')
            .toDynamicValue(() => Promise.resolve({ port: 3000 }));
        // Bind RestServer
        ctx.bind('servers.rest.server1').toClass(RestServerWithPort);
        // Resolve an instance of RestServer
        // Expect server1.config to be `{port: 3000}
        const server1 = await ctx.get('servers.rest.server1');
        testlab_1.expect(server1.port).to.eql(3000);
    });
    it('allows propertyPath & fromBinding for injection metadata', async () => {
        let RestServerWithPort = class RestServerWithPort {
            constructor(port) {
                this.port = port;
            }
        };
        RestServerWithPort = tslib_1.__decorate([
            tslib_1.__param(0, __1.config({ propertyPath: 'port', fromBinding: 'restServer' })),
            tslib_1.__metadata("design:paramtypes", [Number])
        ], RestServerWithPort);
        // Bind configuration
        ctx
            .configure('restServer')
            .toDynamicValue(() => Promise.resolve({ port: 3000 }));
        // Bind RestServer
        ctx.bind('servers.rest.server1').toClass(RestServerWithPort);
        // Resolve an instance of RestServer
        // Expect server1.config to be `{port: 3000}
        const server1 = await ctx.get('servers.rest.server1');
        testlab_1.expect(server1.port).to.eql(3000);
    });
    it('allows propertyPath parameter & fromBinding for injection metadata', async () => {
        let RestServerWithPort = class RestServerWithPort {
            constructor(port) {
                this.port = port;
            }
        };
        RestServerWithPort = tslib_1.__decorate([
            tslib_1.__param(0, __1.config('port', { fromBinding: 'restServer' })),
            tslib_1.__metadata("design:paramtypes", [Number])
        ], RestServerWithPort);
        // Bind configuration
        ctx
            .configure('restServer')
            .toDynamicValue(() => Promise.resolve({ port: 3000 }));
        // Bind RestServer
        ctx.bind('servers.rest.server1').toClass(RestServerWithPort);
        // Resolve an instance of RestServer
        // Expect server1.config to be `{port: 3000}
        const server1 = await ctx.get('servers.rest.server1');
        testlab_1.expect(server1.port).to.eql(3000);
    });
    const LOGGER_KEY = 'loggers.Logger';
    it('injects a getter function to access config', async () => {
        let Logger = class Logger {
            constructor(configGetter) {
                this.configGetter = configGetter;
            }
        };
        Logger = tslib_1.__decorate([
            tslib_1.__param(0, __1.config.getter()),
            tslib_1.__metadata("design:paramtypes", [Function])
        ], Logger);
        // Bind logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'INFO' });
        // Bind Logger
        ctx.bind(LOGGER_KEY).toClass(Logger);
        const logger = await ctx.get(LOGGER_KEY);
        let configObj = await logger.configGetter();
        testlab_1.expect(configObj).to.eql({ level: 'INFO' });
        // Update logger configuration
        const configBinding = ctx.configure(LOGGER_KEY).to({ level: 'DEBUG' });
        configObj = await logger.configGetter();
        testlab_1.expect(configObj).to.eql({ level: 'DEBUG' });
        // Now remove the logger configuration
        ctx.unbind(configBinding.key);
        // configGetter returns undefined as config is optional by default
        configObj = await logger.configGetter();
        testlab_1.expect(configObj).to.be.undefined();
    });
    it('injects a getter function with fromBinding to access config', async () => {
        let MyService = class MyService {
            constructor(configGetter) {
                this.configGetter = configGetter;
            }
        };
        MyService = tslib_1.__decorate([
            tslib_1.__param(0, __1.config.getter({ fromBinding: LOGGER_KEY })),
            tslib_1.__metadata("design:paramtypes", [Function])
        ], MyService);
        // Bind logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'INFO' });
        // Bind MyService
        ctx.bind('services.MyService').toClass(MyService);
        const myService = await ctx.get('services.MyService');
        const configObj = await myService.configGetter();
        testlab_1.expect(configObj).to.eql({ level: 'INFO' });
    });
    it('injects a getter function with propertyPath, {fromBinding} to access config', async () => {
        let MyService = class MyService {
            constructor(levelGetter) {
                this.levelGetter = levelGetter;
            }
        };
        MyService = tslib_1.__decorate([
            tslib_1.__param(0, __1.config.getter('level', { fromBinding: LOGGER_KEY })),
            tslib_1.__metadata("design:paramtypes", [Function])
        ], MyService);
        // Bind logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'INFO' });
        // Bind MyService
        ctx.bind('services.MyService').toClass(MyService);
        const myService = await ctx.get('services.MyService');
        const configObj = await myService.levelGetter();
        testlab_1.expect(configObj).to.eql('INFO');
    });
    it('injects a view to access config', async () => {
        let Logger = class Logger {
            constructor(configView) {
                this.configView = configView;
            }
        };
        Logger = tslib_1.__decorate([
            tslib_1.__param(0, __1.config.view()),
            tslib_1.__metadata("design:paramtypes", [__1.ContextView])
        ], Logger);
        // Bind logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'INFO' });
        // Bind Logger
        ctx.bind(LOGGER_KEY).toClass(Logger);
        const logger = await ctx.get(LOGGER_KEY);
        let configObj = await logger.configView.singleValue();
        testlab_1.expect(configObj).to.eql({ level: 'INFO' });
        // Update logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'DEBUG' });
        configObj = await logger.configView.singleValue();
        testlab_1.expect(configObj).to.eql({ level: 'DEBUG' });
    });
    it('injects a view to access config with path', async () => {
        let Logger = class Logger {
            constructor(configView) {
                this.configView = configView;
            }
        };
        Logger = tslib_1.__decorate([
            tslib_1.__param(0, __1.config.view('level')),
            tslib_1.__metadata("design:paramtypes", [__1.ContextView])
        ], Logger);
        // Bind logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'INFO' });
        // Bind Logger
        ctx.bind(LOGGER_KEY).toClass(Logger);
        const logger = await ctx.get(LOGGER_KEY);
        let level = await logger.configView.singleValue();
        testlab_1.expect(level).to.eql('INFO');
        // Update logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'DEBUG' });
        level = await logger.configView.singleValue();
        testlab_1.expect(level).to.eql('DEBUG');
    });
    it('injects a view to access config with {fromBinding, propertyPath}', async () => {
        let MyService = class MyService {
            constructor(configView) {
                this.configView = configView;
            }
        };
        MyService = tslib_1.__decorate([
            tslib_1.__param(0, __1.config.view({ fromBinding: LOGGER_KEY, propertyPath: 'level' })),
            tslib_1.__metadata("design:paramtypes", [__1.ContextView])
        ], MyService);
        // Bind logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'INFO' });
        // Bind MyService
        ctx.bind('services.MyService').toClass(MyService);
        const myService = await ctx.get('services.MyService');
        let level = await myService.configView.singleValue();
        testlab_1.expect(level).to.eql('INFO');
        // Update logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'DEBUG' });
        level = await myService.configView.singleValue();
        testlab_1.expect(level).to.eql('DEBUG');
    });
    it('injects a view to access config with parameter, {fromBinding}', async () => {
        let MyService = class MyService {
            constructor(configView) {
                this.configView = configView;
            }
        };
        MyService = tslib_1.__decorate([
            tslib_1.__param(0, __1.config.view('level', { fromBinding: LOGGER_KEY })),
            tslib_1.__metadata("design:paramtypes", [__1.ContextView])
        ], MyService);
        // Bind logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'INFO' });
        // Bind MyService
        ctx.bind('services.MyService').toClass(MyService);
        const myService = await ctx.get('services.MyService');
        let level = await myService.configView.singleValue();
        testlab_1.expect(level).to.eql('INFO');
        // Update logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'DEBUG' });
        level = await myService.configView.singleValue();
        testlab_1.expect(level).to.eql('DEBUG');
    });
    it('rejects injection of config view if the target type is not ContextView', async () => {
        let Logger = class Logger {
            constructor(configView) {
                this.configView = configView;
            }
        };
        Logger = tslib_1.__decorate([
            tslib_1.__param(0, __1.config.view()),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], Logger);
        // Bind logger configuration
        ctx.configure(LOGGER_KEY).to({ level: 'INFO' });
        // Bind Logger
        ctx.bind(LOGGER_KEY).toClass(Logger);
        await testlab_1.expect(ctx.get(LOGGER_KEY)).to.be.rejectedWith('The type of Logger.constructor[0] (Object) is not ContextView');
    });
    function givenContext() {
        ctx = new __1.Context();
    }
    let RestServer = class RestServer {
        constructor(configObj) {
            this.configObj = configObj;
        }
    };
    RestServer = tslib_1.__decorate([
        tslib_1.__param(0, __1.config()),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], RestServer);
});
//# sourceMappingURL=binding-config.acceptance.js.map