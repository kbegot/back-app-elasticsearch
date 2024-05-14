import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MyElasticsearchService {
  constructor(private readonly esService: ElasticsearchService) {}

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
      throw new HttpException(
        `Erreur lors de l'indexation du document : ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
