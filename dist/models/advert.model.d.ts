import { Entity } from '@loopback/repository';
export declare class Advert extends Entity {
    id?: number;
    title: string;
    description?: string;
    mediaType?: string;
    mediaLink?: string;
    constructor(data?: Partial<Advert>);
}
export interface AdvertRelations {
}
export declare type AdvertWithRelations = Advert & AdvertRelations;
