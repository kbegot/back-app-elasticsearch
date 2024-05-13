# Utilisez une image Node.js comme base
FROM node:20

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers de configuration de votre application
COPY package.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port sur lequel l'application s'exécute
EXPOSE 3000

# Commande par défaut pour démarrer l'application
CMD ["npm", "run", "start:dev"]
