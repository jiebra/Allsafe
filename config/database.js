// config/database.js

import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config(); // Load environment variables from .env

// Function to create a MySQL connection
const createMySQLConnection = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('✅ MySQL connection established');
        return connection;
    } catch (error) {
        console.error('❌ MySQL connection error:', error.message);
        process.exit(1);
    }
};

// Function to initialize database and create tables
const initializeDatabase = async () => {
    try {
        const connection = await createMySQLConnection();
        
        // Create contacts table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                company VARCHAR(255),
                service ENUM('basic-scan', 'pentest', 'training', 'audit', 'wordpress', 'other') NOT NULL,
                message TEXT NOT NULL,
                status ENUM('new', 'contacted', 'converted', 'archived') DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        
        await connection.execute(createTableQuery);
        console.log('✅ Contacts table created/verified');
        
        await connection.end();
        console.log('✅ Database initialization completed');
        
    } catch (error) {
        console.error('❌ Database initialization error:', error.message);
        throw error;
    }
};

// Export the functions
export { createMySQLConnection, initializeDatabase };
