import { Module } from '@nestjs/common';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';

@Module({
  imports: [ElasticsearchModule],
})
export class AppModule {}
