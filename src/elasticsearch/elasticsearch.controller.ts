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
   * Endpoint for retrieving the list of all indices with their IDs.
   * This route fetches the list of all indices and their IDs from Elasticsearch.
   * @returns A promise resolving to the list of all indices with their IDs.
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

  /**
   * Endpoint for searching within a specific index with pagination support.
   * @param nameIndex - The name of the index to search within.
   * @param page - The page number for pagination.
   * @param elementsPerPage - The number of elements per page for pagination.
   * @param response - The HTTP response object.
   */
  @Get('getIndex')
  async getIndex(
    @Query('index') nameIndex: string,
    @Query('page') page: string,
    @Query('elementsPerPage') elementsPerPage: string,
    @Res() response,
  ): Promise<any> {
    try {
      // Calculating the starting index for pagination
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

  /**
   * Endpoint for searching within a specific index.
   * @param indexName - The name of the index to search within.
   * @param query - The query string for searching.
   * @returns A promise resolving to the search result.
   */
  @Get('search')
  async searchIndex(
    @Query('index') indexName: string,
    @Query('page') page: number,
    @Query('elementsPerPage') elementsPerPage: number,
    @Query('query') query: string,
  ): Promise<any> {
    try {
      return await this.esService.searchIndex(
        indexName,
        page,
        elementsPerPage,
        query,
      );
    } catch (error) {
      // Handle errors
      throw error;
    }
  }
}
