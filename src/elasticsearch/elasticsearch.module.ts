import { Module } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch'; // Importez ElasticsearchService depuis @nestjs/elasticsearch
import { MyElasticsearchService } from './elasticsearch.service';
import { ElasticsearchController } from './elasticsearch.controller';

@Module({
  providers: [
    MyElasticsearchService,
    {
      provide: ElasticsearchService,
      useFactory: () =>
        new ElasticsearchService({
          node: 'https://536d7c1013ee44b4a249d08e8e22d733.us-central1.gcp.cloud.es.io',
          auth: {
            apiKey:
              'ODBHRGNvOEJqVllJLTZDOVhTN3I6MGRqRGhsbTFRU0dvLU9fTGVQLVFKUQ==', // Utilisez votre clé API pour l'authentification
          },
        }),
    },
  ],
  controllers: [ElasticsearchController],
})
export class ElasticsearchModule {}
