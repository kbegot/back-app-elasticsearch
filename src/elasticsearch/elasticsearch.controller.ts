import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { MyElasticsearchService } from './elasticsearch.service';

@Controller('elasticsearch')
export class ElasticsearchController {
  constructor(private readonly esService: MyElasticsearchService) {}

  @Post('index')
  async indexDocument(
    @Body() body: any,
    @Headers('X-Index-Name') indexName: string,
  ): Promise<any> {
    if (!indexName) {
      throw new BadRequestException('X-Index-Name header is missing.');
    }

    return await this.esService.indexDocument(indexName, body);
  }
}
