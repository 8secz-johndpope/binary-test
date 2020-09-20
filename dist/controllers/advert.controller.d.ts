/// <reference types="express" />
import { Filter } from '@loopback/repository';
import { Request, Response } from '@loopback/rest';
import { Advert } from '../models';
import { AdvertRepository } from '../repositories';
import { FileUploadHandler } from '../types';
export declare class AdvertController {
    protected advertRepository: AdvertRepository;
    private handler;
    constructor(advertRepository: AdvertRepository, handler: FileUploadHandler);
    createAdvert(request: Request, response: Response): Promise<object>;
    /**
     * Get files and fields for the request
     * @param request - Http request
     */
    private getFilesAndFields;
    findAdvertById(id: number, items?: boolean): Promise<Advert>;
    findAdverts(filter?: Filter<Advert>): Promise<Advert[]>;
    findAllAdverts(filter?: Filter<Advert>): Promise<Advert[]>;
    replaceAdvert(id: number, advert: Advert): Promise<void>;
    updateAdvert(id: number, advert: Partial<Advert>): Promise<void>;
    deleteAdvert(id: number): Promise<void>;
}
