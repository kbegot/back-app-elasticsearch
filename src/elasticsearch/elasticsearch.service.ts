import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MyElasticsearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  async indexDocument(index: string, document: any): Promise<any> {
    return await this.esService.index({
      index: index,
      body: document,
    });
  }
}
