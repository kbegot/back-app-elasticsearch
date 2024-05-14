import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MyElasticsearchService } from './elasticsearch.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('elasticsearch')
export class ElasticsearchController {
  constructor(private readonly esService: MyElasticsearchService) {}

  /**
   * Endpoint for indexing a document in Elasticsearch.
   * @param body - The request body containing the index name and the file to be indexed.
   * @param file - The uploaded file to be indexed.
   */
  @Post('index')
  @UseInterceptors(FileInterceptor('file'))
  async indexDocument(
    @Body() body: any,
    @UploadedFile('file') file,
  ): Promise<any> {
    try {
      return await this.esService.indexDocument(body.indexName, file);
    } catch (error) {
      // If an error is raised in the service
      if (
        error instanceof HttpException &&
        error.getStatus() === HttpStatus.CONFLICT
      ) {
        // If the error is a conflict (index already exists), return a response with status 409
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else {
        // Otherwise, propagate the error with status 500 (Internal Server Error)
        throw error;
      }
    }
  }
}
