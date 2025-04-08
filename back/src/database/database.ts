import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../database.sqlite');

export const db: Database = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connection database:', err);
  } else {
    console.log('Connected to database');
    createTables();
  }
});

function createTables() {
  db.run(`
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
