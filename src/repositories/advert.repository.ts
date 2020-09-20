// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/core';
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Advert, AdvertRelations} from '../models';

export class AdvertRepository extends DefaultCrudRepository<
  Advert,
  typeof Advert.prototype.id,
  AdvertRelations
> {
  constructor(@inject('datasources.db') dataSource: juggler.DataSource) {
    super(Advert, dataSource);
  }
}
