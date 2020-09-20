// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-Advert-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property} from '@loopback/repository';

@model()
export class Advert extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description?: string;

  @property({
    type: 'string',
    required: true,
  })
  mediaType?: string;

  @property({
    type: 'string',
    required: true,
  })
  mediaLink?: string;

  constructor(data?: Partial<Advert>) {
    super(data);
  }
}

export interface AdvertRelations {
  // describe navigational properties here
}

export type AdvertWithRelations = Advert & AdvertRelations;
