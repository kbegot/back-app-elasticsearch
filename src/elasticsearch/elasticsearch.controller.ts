import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
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
  @Post('createIndex')
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

  /**
   * Endpoint to get the list of all indices with their IDs.
   */
  @Get('getAllIndexes')
  async getAllIndexes(): Promise<any> {
    try {
      return await this.esService.getAllIndexes();
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

  @Get('getIndex')
  async searchIndex(
    @Query('index') nameIndex: string,
    @Query('page') page: string,
    @Query('elementsPerPage') elementsPerPage: string,
    @Res() response,
  ): Promise<any> {
    try {
      // Calcul de l'index de départ pour la pagination
      const from = (parseInt(page) - 1) * parseInt(elementsPerPage);
      response.send(
        await this.esService.getIndexes(
          nameIndex,
          from,
          parseInt(elementsPerPage),
        ),
      );
    } catch (error) {
      // Otherwise, propagate the error with status 500 (Internal Server Error)
      throw error;
    }
  }
}
