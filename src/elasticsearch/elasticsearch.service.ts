import { Injectable } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MyElasticsearchService {
  constructor(private readonly esService: NestElasticsearchService) {}

  async indexDocument(index: string, document: any): Promise<any> {
    return await this.esService.index({
      index: index,
      body: document,
    });
  }
}
