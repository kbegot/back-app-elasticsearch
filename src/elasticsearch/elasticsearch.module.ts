import { Module } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MyElasticsearchService } from './elasticsearch.service';
import { ElasticsearchController } from './elasticsearch.controller';

// ElasticSearch client
@Module({
  providers: [
    MyElasticsearchService,
    {
      provide: ElasticsearchService,
      useFactory: () =>
        new ElasticsearchService({
          node: process.env.ELASTICSEARCH_NODE_URL,
          auth: {
            apiKey: process.env.ELASTICSEARCH_API_KEY,
          },
        }),
    },
  ],
  controllers: [ElasticsearchController],
})
export class ElasticsearchModule {}
