import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus, Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
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
   * @throws {Error} An error if retrieving the mapping fails.
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
   * @throws {Error} An error if retrieving the mapping fails.
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
   * @throws {Error} An error if retrieving the mapping fails.
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
   * @returns A promise resolving to the search result.
   * @throws {Error} An error if retrieving the mapping fails.
   * @param body
   */
  @Post('search')
  async searchIndex(@Body() body): Promise<any> {
    try {
      return await this.esService.searchIndex(
        body.data.indexName,
        body.data.currentPage,
        body.data.itemsPerPage,
        body.data.query,
      );
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

  /**
   * Retrieves the mapping of properties for the specified index.
   * @param indexName - The name of the index for which to retrieve the mapping of properties.
   * @returns The mapping of properties for the specified index.
   * @throws {Error} An error if retrieving the mapping fails.
   */
  @Get('getAllColumns')
  async getAllColumns(@Query('indexName') indexName: string): Promise<any> {
    try {
      return await this.esService.getAllcolumns(indexName);
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

  /**
   * Retrieves aggregated film data based on the specified type.
   * @param type - The type of aggregation to perform (e.g., 'country', 'listed_in', 'type').
   * @param index
   * @param columnType
   * @returns Aggregated film data based on the specified type.
   */
  @Get('/aggregation')
  async getFilmsAggregation(
    @Query('type') type: string,
    @Query('index') index: string,
  ) {
    return this.esService.getFilmsAggregation(type, index);
  }
}
