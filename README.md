# Nest.js Elasticsearch API

Ce projet est une application Nest.js qui utilise Elasticsearch pour fournir une API. L'API permet aux utilisateurs d'effectuer des opérations de recherche avancées dans un index Elasticsearch et d'indexer de nouveaux documents de manière efficace.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- Node.js
- npm (ou yarn)
- Elasticsearch

## Installation

1. Clonez ce dépôt sur votre machine :

```bash
git clone https://github.com/kbegot/back-app-elasticsearch
```

2. Accédez au répertoire du projet :

```bash
cd back-app-elasticsearch
```

3. Installez les dépendances du projet :

```bash
npm install
```

## Configuration

1. Assurez-vous que Elasticsearch est en cours d'exécution sur votre machine. Si ce n'est pas le cas, vous pouvez le télécharger et l'installer à partir du [site officiel d'Elasticsearch](https://www.elastic.co/downloads/elasticsearch). Vous avez également la possibilité d'utiliser la version cloud d'Elasticsearch proposée par Elastic.

2. Créez un fichier `.env` à la racine du projet avec les configurations Elasticsearch nécessaires. Par exemple :

```
ELASTICSEARCH_NODE_URL=http://localhost:9200
ELASTICSEARCH_API_KEY=YOUR_API_KEY
```

## Démarrage de l'API

Une fois les dépendances installées et la configuration terminée, vous pouvez démarrer l'API en exécutant la commande suivante :

```bash
docker compose up --build
```

L'API devrait démarrer sur le port par défaut `3000`.

## Utilisation de l'API

L'API fournit les endpoints suivants :

- `POST /elasticsearch/createIndex` : Crée un nouvel index dans Elasticsearch. Cette route permet d'indexer un nouveau document dans Elasticsearch.
- `GET /elasticsearch/getAllIndexes` : Récupère la liste de tous les index avec leurs IDs. Cette route permet de lister tous les index existants dans Elasticsearch.
- `GET /elasticsearch/getIndex` : Récupère la liste des index avec prise en charge de la pagination. Cette route permet d'obtenir une liste d'index spécifiques avec une pagination personnalisable en utilisant la fonction
- `GET /elasticsearch/search` : Recherche dans un index spécifique avec prise en charge de la pagination. Cette route permet de rechercher des éléments dans un index spécifique avec une pagination personnalisable en utilisant la fonction 
- `GET /elasticsearch/getAllColumns` : Récupère le mapping des propriétés pour l'index spécifié. Cette route permet de récupérer le mapping des propriétés pour un index spécifique.
- `GET /elasticsearch/aggregation/:type` : Récupère les données agrégées sur les films en fonction du type spécifié.

