"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const js_yaml_1 = __importDefault(require("js-yaml"));
// Load Swagger YAML file
const swaggerFile = path_1.default.join(__dirname, '../../docs/swagger.yaml');
const swaggerDocument = js_yaml_1.default.load(fs_1.default.readFileSync(swaggerFile, 'utf8'));
exports.swaggerSpec = swaggerDocument;
