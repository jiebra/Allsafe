#!/usr/bin/env node

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setupMySQL() {
    console.log('🚀 AllSafe MySQL Database Setup\n');
    
    try {
        // Get database configuration from user
        const host = await question('MySQL Host (default: localhost): ') || 'localhost';
        const user = await question('MySQL Username (default: root): ') || 'root';
        const password = await question('MySQL Password: ');
        const database = await question('Database Name (default: allsafe_db): ') || 'allsafe_db';
        const port = await question('MySQL Port (default: 3306): ') || '3306';
        
        console.log('\n📡 Testing MySQL connection...');
        
        // Test connection without database first
        const testConnection = await mysql.createConnection({
            host,
            user,
            password,
            port: parseInt(port)
        });
        
        console.log('✅ MySQL connection successful!');
        
        // Create database if it doesn't exist
        await testConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        console.log(`✅ Database '${database}' created/verified`);
        
        await testConnection.end();
        
        // Connect to the specific database
        const dbConnection = await mysql.createConnection({
            host,
            user,
            password,
            database,
            port: parseInt(port)
        });
        
        // Create contacts table
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
        
        await dbConnection.execute(createTableQuery);
        console.log('✅ Contacts table created successfully');
        
        await dbConnection.end();
        
        // Create .env file
        const envContent = `# MySQL Database Configuration
DB_HOST=${host}
DB_USER=${user}
DB_PASSWORD=${password}
DB_NAME=${database}
DB_PORT=${port}

# Email Configuration (optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# Server Configuration
PORT=3000
`;
        
        const envPath = path.join(__dirname, '.env');
        fs.writeFileSync(envPath, envContent);
        console.log('✅ .env file created with your database configuration');
        
        console.log('\n🎉 MySQL setup completed successfully!');
        console.log('📝 You can now start your server with: npm start');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\n💡 Make sure:');
        console.log('   - MySQL server is running');
        console.log('   - Your MySQL credentials are correct');
        console.log('   - You have permission to create databases');
    } finally {
        rl.close();
    }
}

// Run setup if this file is executed directly
if (import.meta.url === path.toFileURL(process.argv[1]).href) {
    setupMySQL();
}

export { setupMySQL };

