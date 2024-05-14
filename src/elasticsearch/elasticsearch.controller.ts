import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MyElasticsearchService } from './elasticsearch.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('elasticsearch')
export class ElasticsearchController {
  constructor(private readonly esService: MyElasticsearchService) {}

  @Post('index')
  @UseInterceptors(FileInterceptor('file'))
  async indexDocument(
    @Body() body: any,
    @UploadedFile('file') file,
  ): Promise<any> {
    return await this.esService.indexDocument(body.indexName, file);
  }
}
