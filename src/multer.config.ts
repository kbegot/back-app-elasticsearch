/* eslint-disable prettier/prettier */
import { MulterModuleOptions } from '@nestjs/platform-express';

export const multerConfig: MulterModuleOptions = {
  dest: './uploads', // Répertoire de destination où les fichiers seront enregistrés
};
