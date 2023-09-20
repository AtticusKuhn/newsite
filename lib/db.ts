import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// let db = null;

export const getDB = async () => {
  // if (!db) {
    // If the database instance is not initialized, open the database connection
    const db = await open({
      filename: "/home/atticusk/.config/emacs/.local/cache/org-roam.db", // Specify the database file path
      driver: sqlite3.Database, // Specify the database driver (sqlite3 in this case)
    // });
  // }
    return db;
}
