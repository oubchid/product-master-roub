import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Load Swagger file
const swaggerFile = path.join(__dirname, '../../docs/swagger.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(swaggerFile, 'utf8'));

export const swaggerSpec = swaggerDocument;
