import { DefaultCrudRepository, juggler } from '@loopback/repository';
import { Advert, AdvertRelations } from '../models';
export declare class AdvertRepository extends DefaultCrudRepository<Advert, typeof Advert.prototype.id, AdvertRelations> {
    constructor(dataSource: juggler.DataSource);
}
