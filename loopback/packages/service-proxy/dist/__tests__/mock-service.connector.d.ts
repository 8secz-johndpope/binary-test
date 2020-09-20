import legacy from 'loopback-datasource-juggler';
import { juggler } from '..';
/**
 * A mockup service connector
 */
export declare class MockConnector {
    name: 'mock';
    connected?: boolean;
    dataSource: juggler.DataSource;
    static initialize(dataSource: juggler.DataSource, cb: (err: any, result: any) => void): void;
    connect(cb: (err: any, connected: boolean) => void): void;
    disconnect(cb: legacy.Callback): void;
    ping(cb: legacy.Callback): void;
    get DataAccessObject(): {
        geocode?: undefined;
        prototype?: undefined;
    } | {
        geocode: (street: string, city: string, zipcode: string) => Promise<{
            lat: number;
            lng: number;
        }>;
        prototype: {};
    };
}
