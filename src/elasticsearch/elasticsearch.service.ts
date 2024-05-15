import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MyElasticsearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  /**
   * Indexes a document in Elasticsearch.
   * @param index - The name of the index.
   * @param document - The document to be indexed.
   * @throws {Error} An error if retrieving the mapping fails.
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
   * @throws {Error} An error if retrieving the mapping fails.
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
      query: {
        match_all: {},
      },
    });
  }

  /**
   * Searches within a specific index with pagination support.
   * @param indexName - The name of the index to search within.
   * @param page - The page number for pagination.
   * @param elementsPerPage - The number of elements per page for pagination.
   * @param query - The query string for searching.
   * @returns A promise resolving to the search result.
   * @throws {Error} An error if retrieving the mapping fails.
   */
  async searchIndex(
    indexName: string,
    page: number,
    elementsPerPage: number,
    query: { [key: string]: string },
  ): Promise<any> {
    try {
      const mustArray = [];

      // Parcourir dynamiquement les champs de query et ajouter des conditions pour chaque champ non vide
      for (const [key, value] of Object.entries(query)) {
        if (value) {
          mustArray.push({ match_phrase: { [key]: value } });
        }
      }

      return await this.esService.search({
        index: indexName,
        from: (page - 1) * elementsPerPage,
        size: elementsPerPage, // Limiting the search results
        query: {
          bool: {
            must: mustArray,
          },
        },
      });
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
  async getAllcolumns(indexName: string): Promise<any> {
    try {
      return await this.esService.indices.getMapping({
        index: indexName,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves aggregated film data based on the specified type.
   * @param type - The type of aggregation to perform (e.g., 'rating', 'listed_in', 'type').
   * @param index
   * @param columnType
   * @returns An array containing aggregated film data with keys and counts.
   * @throws {Error} If an invalid aggregation type is provided or an error occurs during the aggregation process.
   */
  async getFilmsAggregation(type: string, index: string) {
    try {
      // Vérifier si le champ est fourni
      if (!type) {
        throw new Error('Aggregation field type is required');
      }

      const body = await this.esService.search({
        index: index,
        size: 0, // Just need the aggregation
        aggs: {
          type: {
            terms: {
              field: `${type}`,
              size: 10,
            },
          },
        },
      });

      if (body.aggregations) {
        return body.aggregations.type['buckets'].map((bucket: any) => ({
          key: bucket.key,
          count: bucket.doc_count,
        }));
      } else {
        console.error(
          'Unexpected response structure:',
          body.aggregations?.type,
        );
        throw new Error('Error performing aggregation');
      }
    } catch (error) {
      console.error('Aggregation error:', error);
      throw new Error('Error performing aggregation');
    }
  }
}
