import { Module } from '@nestjs/common';
import { MyElasticsearchService } from './elasticsearch.service';
import { ElasticsearchController } from './elasticsearch.controller';

@Module({
  providers: [MyElasticsearchService],
  controllers: [ElasticsearchController],
})
export class ElasticsearchModule {}
