"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(__dirname, '../../database.sqlite');
exports.db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connection database:', err);
    }
    else {
        console.log('Connected to database');
        createTables();
    }
});
function createTables() {
    exports.db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      image TEXT,
      category TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      internalReference TEXT,
      shellId INTEGER,
      inventoryStatus TEXT CHECK(inventoryStatus IN ('INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK')),
      rating REAL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    )
  `);
}
