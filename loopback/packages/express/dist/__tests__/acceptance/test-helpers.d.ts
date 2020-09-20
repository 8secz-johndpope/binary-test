import { Binding, InterceptorOrKey } from '@loopback/core';
import { Client } from '@loopback/testlab';
import { ExpressApplication } from '../../express.application';
import { SpyConfig } from '../fixtures/spy-config';
export declare const spy: import("../../types").ExpressMiddlewareFactory<SpyConfig>;
export { SpyConfig } from '../fixtures/spy-config';
export declare type TestFunction = (spyBinding: Binding<unknown>, path?: string) => Promise<unknown>;
export declare class TestHelper {
    readonly app: ExpressApplication;
    client: Client;
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
    bindController(interceptor?: InterceptorOrKey): void;
    private configureSpy;
    testSpyLog(spyBinding: Binding<unknown>, path?: string): Promise<void>;
    assertSpyLog(path?: string): Promise<void>;
    testSpyMock(spyBinding: Binding<unknown>, path?: string): Promise<void>;
    assertSpyMock(path?: string): Promise<void>;
    testSpyReject(spyBinding: Binding<unknown>, path?: string): Promise<void>;
    private assertSpyReject;
}
