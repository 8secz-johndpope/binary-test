"use strict";
// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: @loopback/http-server
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testlab_1 = require("@loopback/testlab");
const events_1 = require("events");
const fs_1 = tslib_1.__importDefault(require("fs"));
const http_1 = require("http");
const os_1 = tslib_1.__importDefault(require("os"));
const path_1 = tslib_1.__importDefault(require("path"));
const __1 = require("../../");
describe('HttpServer (integration)', () => {
    let server;
    afterEach(stopServer);
    testlab_1.skipOnTravis(it, 'formats IPv6 url correctly', async () => {
        server = new __1.HttpServer(dummyRequestHandler, {
            host: '::1',
        });
        await server.start();
        testlab_1.expect(getAddressFamily(server)).to.equal('IPv6');
        const response = await testlab_1.httpGetAsync(server.url);
        testlab_1.expect(response.statusCode).to.equal(200);
    });
    it('starts server', async () => {
        const serverOptions = testlab_1.givenHttpServerConfig();
        server = new __1.HttpServer(dummyRequestHandler, serverOptions);
        await server.start();
        await testlab_1.supertest(server.url).get('/').expect(200);
    });
    it('stops server', async function () {
        // This test takes a bit longer to finish on windows.
        this.timeout(3000);
        const serverOptions = testlab_1.givenHttpServerConfig();
        server = new __1.HttpServer(dummyRequestHandler, serverOptions);
        await server.start();
        await server.stop();
        await testlab_1.expect(testlab_1.httpGetAsync(server.url)).to.be.rejectedWith(/ECONNREFUSED/);
    });
    it('stops server with grace period and inflight request', async function () {
        // This test takes a bit longer to finish on windows.
        this.timeout(3000);
        const serverOptions = testlab_1.givenHttpServerConfig();
        serverOptions.gracePeriodForClose = 1000;
        const { emitter, deferredRequestHandler } = createDeferredRequestHandler();
        server = new __1.HttpServer(deferredRequestHandler, serverOptions);
        await server.start();
        const agent = new http_1.Agent({ keepAlive: true });
        // Send a request with keep-alive
        const req = testlab_1.httpGetAsync(server.url, agent);
        // Wait until the request is accepted by the server
        await events_1.once(server.server, 'request');
        // Stop the server
        const stop = server.stop();
        // Now notify the request to finish in next cycle with setImmediate
        setImmediate(() => {
            emitter.emit('finish');
        });
        // The in-flight task can finish before the grace period
        await req;
        // Wait until the server is stopped
        await stop;
        // No more new connections are accepted
        await testlab_1.expect(testlab_1.httpGetAsync(server.url)).to.be.rejectedWith(/ECONNREFUSED/);
    });
    it('stops server with shorter grace period and inflight request', async function () {
        // This test takes a bit longer to finish on windows.
        this.timeout(3000);
        const serverOptions = testlab_1.givenHttpServerConfig();
        serverOptions.gracePeriodForClose = 10;
        const { deferredRequestHandler } = createDeferredRequestHandler();
        server = new __1.HttpServer(deferredRequestHandler, serverOptions);
        await server.start();
        const agent = new http_1.Agent({ keepAlive: true });
        // Send a request with keep-alive
        const req = testlab_1.httpGetAsync(server.url, agent);
        // Wait until the request is accepted by the server
        await events_1.once(server.server, 'request');
        // Set up error handler for expected rejection before the event is emitted
        const socketPromise = testlab_1.expect(req).to.be.rejectedWith(/socket hang up/);
        // Stop the server
        await server.stop();
        // No more new connections are accepted
        await testlab_1.expect(testlab_1.httpGetAsync(server.url)).to.be.rejectedWith(/ECONNREFUSED/);
        // We never send `finish` to the pending request
        // The inflight request is aborted as it takes longer than the grace period
        await socketPromise;
    });
    it('exports original port', async () => {
        server = new __1.HttpServer(dummyRequestHandler, { port: 0 });
        testlab_1.expect(server).to.have.property('port').which.is.equal(0);
    });
    it('exports reported port', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        await server.start();
        testlab_1.expect(server)
            .to.have.property('port')
            .which.is.a.Number()
            .which.is.greaterThan(0);
    });
    it('does not permanently bind to the initial port', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        await server.start();
        const port = server.port;
        await server.stop();
        await server.start();
        testlab_1.expect(server)
            .to.have.property('port')
            .which.is.a.Number()
            .which.is.not.equal(port);
    });
    it('exports original host', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        testlab_1.expect(server).to.have.property('host').which.is.equal(undefined);
    });
    it('exports reported host', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        await server.start();
        testlab_1.expect(server).to.have.property('host').which.is.a.String();
    });
    it('exports protocol', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        await server.start();
        testlab_1.expect(server)
            .to.have.property('protocol')
            .which.is.a.String()
            .match(/http|https/);
    });
    it('exports url', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        await server.start();
        testlab_1.expect(server)
            .to.have.property('url')
            .which.is.a.String()
            .match(/http|https\:\/\//);
    });
    it('exports address', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        await server.start();
        testlab_1.expect(server).to.have.property('address').which.is.an.Object();
    });
    it('exports server before start', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        testlab_1.expect(server.server).to.be.instanceOf(http_1.Server);
    });
    it('stops server before start', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        await server.stop();
    });
    it('resets address when server is stopped', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        await server.start();
        testlab_1.expect(server).to.have.property('address').which.is.an.Object();
        await server.stop();
        testlab_1.expect(server.address).to.be.undefined();
    });
    it('exports listening', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        await server.start();
        testlab_1.expect(server.listening).to.be.true();
        await server.stop();
        testlab_1.expect(server.listening).to.be.false();
    });
    it('reports error when the server cannot be started', async () => {
        server = new __1.HttpServer(dummyRequestHandler);
        await server.start();
        const port = server.port;
        const anotherServer = new __1.HttpServer(dummyRequestHandler, {
            port: port,
        });
        await testlab_1.expect(anotherServer.start()).to.be.rejectedWith(/EADDRINUSE/);
    });
    it('supports HTTP over IPv4', async () => {
        server = new __1.HttpServer(dummyRequestHandler, { host: '127.0.0.1' });
        await server.start();
        testlab_1.expect(getAddressFamily(server)).to.equal('IPv4');
        const response = await testlab_1.httpGetAsync(server.url);
        testlab_1.expect(response.statusCode).to.equal(200);
    });
    testlab_1.skipOnTravis(it, 'supports HTTP over IPv6', async () => {
        server = new __1.HttpServer(dummyRequestHandler, { host: '::1' });
        await server.start();
        testlab_1.expect(getAddressFamily(server)).to.equal('IPv6');
        const response = await testlab_1.httpGetAsync(server.url);
        testlab_1.expect(response.statusCode).to.equal(200);
    });
    it('supports HTTPS protocol with key and certificate files', async () => {
        const serverOptions = testlab_1.givenHttpServerConfig();
        const httpsServer = givenHttpsServer(serverOptions);
        await httpsServer.start();
        const response = await testlab_1.httpsGetAsync(httpsServer.url);
        testlab_1.expect(response.statusCode).to.equal(200);
    });
    it('supports HTTPS protocol with a pfx file', async () => {
        const httpsServer = givenHttpsServer({ usePfx: true });
        await httpsServer.start();
        const response = await testlab_1.httpsGetAsync(httpsServer.url);
        testlab_1.expect(response.statusCode).to.equal(200);
    });
    testlab_1.skipOnTravis(it, 'handles IPv6 loopback address in HTTPS', async () => {
        const httpsServer = givenHttpsServer({
            host: '::1',
        });
        await httpsServer.start();
        testlab_1.expect(getAddressFamily(httpsServer)).to.equal('IPv6');
        const response = await testlab_1.httpsGetAsync(httpsServer.url);
        testlab_1.expect(response.statusCode).to.equal(200);
    });
    it('converts host from [::] to [::1] in url', async () => {
        // Safari on MacOS does not support http://[::]:3000/
        server = new __1.HttpServer(dummyRequestHandler, { host: '::' });
        await server.start();
        testlab_1.expect(server.url).to.equal(`http://[::1]:${server.port}`);
    });
    it('converts host from 0.0.0.0 to 127.0.0.1 in url', async () => {
        // Windows does not support http://0.0.0.0:3000/
        server = new __1.HttpServer(dummyRequestHandler, { host: '0.0.0.0' });
        await server.start();
        testlab_1.expect(server.url).to.equal(`http://127.0.0.1:${server.port}`);
    });
    it('supports HTTP over unix socket', async () => {
        if (os_1.default.platform() === 'win32')
            return;
        const socketPath = path_1.default.join(os_1.default.tmpdir(), 'test.sock');
        server = new __1.HttpServer(dummyRequestHandler, {
            path: socketPath,
        });
        await server.start();
        testlab_1.expect(getAddressFamily(server)).to.equal('ipc');
        testlab_1.expect(server.address).to.eql(socketPath);
        testlab_1.expect(server.host).to.be.undefined();
        testlab_1.expect(server.port).to.eql(0);
        testlab_1.expect(server.url).to.eql('http+unix://' + encodeURIComponent(socketPath));
        await testlab_1.supertest(server.url).get('/').expect(200);
    });
    it('supports HTTP over Windows named pipe', async () => {
        if (os_1.default.platform() !== 'win32')
            return;
        const namedPipe = path_1.default.join('\\\\?\\pipe', process.cwd(), 'test.pipe');
        server = new __1.HttpServer(dummyRequestHandler, {
            path: namedPipe,
        });
        await server.start();
        testlab_1.expect(getAddressFamily(server)).to.equal('ipc');
        testlab_1.expect(server.url).to.eql(namedPipe);
    });
    it('rejects invalid named pipe on Windows', async () => {
        if (os_1.default.platform() !== 'win32')
            return;
        const namedPipe = 'test.pipe';
        testlab_1.expect(() => {
            server = new __1.HttpServer(dummyRequestHandler, {
                path: namedPipe,
            });
        }).to.throw(/Named pipe test\.pipe does NOT start with/);
    });
    function getAddressFamily(httpServer) {
        if (!httpServer || !httpServer.address)
            return undefined;
        if (typeof httpServer.address === 'string') {
            return 'ipc';
        }
        return httpServer.address.family;
    }
    function dummyRequestHandler(req, res) {
        res.end();
    }
    /**
     * Create a request handler to simulate long-running requests. The request
     * is only processed once the emitter receives `finish` signal.
     */
    function createDeferredRequestHandler() {
        const emitter = new events_1.EventEmitter();
        function deferredRequestHandler(req, res) {
            emitter.on('finish', () => res.end());
        }
        return { emitter, deferredRequestHandler };
    }
    async function stopServer() {
        if (!server)
            return;
        await server.stop();
    }
    function givenHttpsServer({ usePfx, host, }) {
        const options = testlab_1.givenHttpServerConfig({
            protocol: 'https',
            host,
        });
        const certDir = path_1.default.resolve(__dirname, '../../../fixtures');
        if (usePfx) {
            const pfxPath = path_1.default.join(certDir, 'pfx.pfx');
            options.pfx = fs_1.default.readFileSync(pfxPath);
            options.passphrase = 'loopback4';
        }
        else {
            const keyPath = path_1.default.join(certDir, 'key.pem');
            const certPath = path_1.default.join(certDir, 'cert.pem');
            options.key = fs_1.default.readFileSync(keyPath);
            options.cert = fs_1.default.readFileSync(certPath);
        }
        return new __1.HttpServer(dummyRequestHandler, options);
    }
});
//# sourceMappingURL=http-server.integration.js.map