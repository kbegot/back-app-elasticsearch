import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MyElasticsearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  /**
   * Indexes a document in Elasticsearch.
   * @param index - The name of the index.
   * @param document - The document to be indexed.
   */
  async indexDocument(index: string, document: any): Promise<any> {
    try {
      // Check if the index already exists
      const indexExists = await this.esService.indices.exists({ index });
      if (indexExists) {
        // If the index already exists, throw an exception with an error code 409 (Conflict)
        throw new HttpException(
          `L'index '${index}' existe déjà`,
          HttpStatus.CONFLICT,
        );
      }

      // If the index does not exist, index the document
      return await this.esService.index({
        index: index.toLowerCase(),
        id: document.originalname,
        body: document,
      });
    } catch (error) {
      // If an error occurs during indexing, rethrow it
      throw error;
    }
  }

  /**
   * Retrieves the list of all indices with their IDs, excluding internal and surveillance indices.
   * @returns A promise resolving to the list of all indices with their IDs.
   */
  async getAllIndexes(): Promise<any> {
    try {
      // Get all indices
      const body = await this.esService.cat.indices({ format: 'json' });
      // Filter out internal and surveillance indices
      const filteredIndices = body.filter((index: any) => {
        // Exclude indices starting with "." and other specific prefixes
        const excludePrefixes = ['.', 'monitoring-', 'watcher-', 'metricbeat-']; // Add more prefixes if needed
        return !excludePrefixes.some((prefix) =>
          index.index.startsWith(prefix),
        );
      });
      // Extract index names and IDs from filtered list
      const indices = filteredIndices.map((index: any) => ({
        index: index.index,
        id: index.uuid,
      }));
      return indices;
    } catch (error) {
      // Handle errors
      throw error;
    }
  }

  /**
   * Searches within a specific index with pagination support.
   * @param nameIndex - The name of the index to search within.
   * @param from - The starting index for pagination.
   * @param elementsPerPage - The number of elements per page for pagination.
   * @returns A promise resolving to the search result.
   */
  async getIndexes(
    nameIndex: string,
    from: number,
    elementsPerPage: number,
  ): Promise<any> {
    return await this.esService.search({
      index: nameIndex,
      from: from,
      size: elementsPerPage,
      body: {
        query: {
          match_all: {},
        },
      },
    });
  }
}
