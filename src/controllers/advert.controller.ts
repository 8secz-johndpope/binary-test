// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-advert-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {authenticate} from '@loopback/authentication';
import {Filter, repository} from '@loopback/repository';
import {inject} from '@loopback/core';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {Advert} from '../models';
import {AdvertRepository} from '../repositories';
import {FILE_UPLOAD_SERVICE} from '../keys';
import {FileUploadHandler} from '../types';

@authenticate('jwt')
export class AdvertController {
  constructor(
    @repository(AdvertRepository) protected advertRepository: AdvertRepository,
    @inject(FILE_UPLOAD_SERVICE) private handler: FileUploadHandler,
  ) {}

  @authenticate.skip()
  @post('/advert', {
    responses: {
      '200': {
        description: 'Advert model instance',
        content: {'application/json': {schema: getModelSchemaRef(Advert)}},
      },
    },
  })
  async createAdvert(
    @requestBody.file()
    request: Request,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<object> {
    // return this.advertRepository.create(advert);
    return new Promise<object>((resolve, reject) => {
      this.handler(request, response, (err: unknown) => {
        if (err) reject(err);
        else {
          resolve(this.getFilesAndFields(request));
        }
      });
    });
  }
  /**
   * Get files and fields for the request
   * @param request - Http request
   */
  private getFilesAndFields(request: Request) {
    const uploadedFiles = request.files;
    const mapper = (f: globalThis.Express.Multer.File) => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      encoding: f.encoding,
      mimetype: f.mimetype,
      size: f.size,
    });
    let files: object[] = [];
    if (Array.isArray(uploadedFiles)) {
      files = uploadedFiles.map(mapper);
    } else {
      for (const filename in uploadedFiles) {
        files.push(...uploadedFiles[filename].map(mapper));
      }
    }
    // since we are only allow 1 file at a time
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const file: any = files[0];
    // creating the advert
    return this.advertRepository.create({
      title: request.body['title'],
      description: request.body['description'],
      mediaType: file.mimetype === 'video/mp4' ? 'video' : 'image',
      mediaLink: file.originalname,
    });
    // return {files, fields: request.body};
  }

  @get('/advert/{id}', {
    responses: {
      '200': {
        description: 'Advert model instance',
        content: {'application/json': {schema: getModelSchemaRef(Advert)}},
      },
    },
  })
  async findAdvertById(
    @param.path.number('id') id: number,
    @param.query.boolean('items') items?: boolean,
  ): Promise<Advert> {
    return this.advertRepository.findById(id);
  }

  @get('/advert', {
    responses: {
      '200': {
        description: 'Array of Advert model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Advert)},
          },
        },
      },
    },
  })
  async findAdverts(
    @param.filter(Advert)
    filter?: Filter<Advert>,
  ): Promise<Advert[]> {
    return this.advertRepository.find(filter);
  }

  @authenticate.skip()
  @get('/adverts', {
    responses: {
      '200': {
        description: 'Public API -Array of all Advert model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Advert)},
          },
        },
      },
    },
  })
  async findAllAdverts(
    @param.filter(Advert)
    filter?: Filter<Advert>,
  ): Promise<Advert[]> {
    return this.advertRepository.find(filter);
  }

  @put('/advert/{id}', {
    responses: {
      '204': {
        description: 'Advert PUT success',
      },
    },
  })
  async replaceAdvert(
    @param.path.number('id') id: number,
    @requestBody() advert: Advert,
  ): Promise<void> {
    await this.advertRepository.replaceById(id, advert);
  }

  @patch('/advert/{id}', {
    responses: {
      '204': {
        description: 'Advert PATCH success',
      },
    },
  })
  async updateAdvert(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Advert, {partial: true}),
        },
      },
    })
    advert: Partial<Advert>,
  ): Promise<void> {
    await this.advertRepository.updateById(id, advert);
  }

  @del('/advert/{id}', {
    responses: {
      '204': {
        description: 'Advert DELETE success',
      },
    },
  })
  async deleteAdvert(@param.path.number('id') id: number): Promise<void> {
    await this.advertRepository.deleteById(id);
  }
}
