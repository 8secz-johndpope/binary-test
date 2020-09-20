import { juggler } from '@loopback/repository';
export declare class DbDataSource extends juggler.DataSource {
    static dataSourceName: string;
    static readonly defaultConfig: {
        name: string;
        connector: string;
        url: string;
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };
    constructor(dsConfig?: object);
}
