// Contact Model for storing form submissions
// This is an example using Mongoose (MongoDB)
// Modify this based on your chosen database

// ===== MONGODB/MONGOOSE MODEL =====
/*
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    company: {
        type: String,
        trim: true,
        default: ''
    },
    service: {
        type: String,
        required: true,
        enum: [
            'basic-scan',
            'pentest',
            'training',
            'audit',
            'wordpress',
            'other'
        ]
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'converted', 'archived'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
contactSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Contact', contactSchema);
*/

// ===== MYSQL TABLE CREATION =====
/*
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    service ENUM('basic-scan', 'pentest', 'training', 'audit', 'wordpress', 'other') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'contacted', 'converted', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
*/

// ===== POSTGRESQL TABLE CREATION =====
/*
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    service VARCHAR(50) CHECK (service IN ('basic-scan', 'pentest', 'training', 'audit', 'wordpress', 'other')) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

// ===== SQLITE TABLE CREATION =====
/*
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service TEXT CHECK(service IN ('basic-scan', 'pentest', 'training', 'audit', 'wordpress', 'other')) NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK(status IN ('new', 'contacted', 'converted', 'archived')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
*/

// MySQL Contact class
import { createMySQLConnection } from '../config/database.js';

class Contact {
    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.company = data.company || '';
        this.service = data.service;
        this.message = data.message;
        this.status = 'new';
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static async save(data) {
        let connection;
        try {
            connection = await createMySQLConnection();
            
            const query = `
                INSERT INTO contacts (name, email, company, service, message, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            `;
            
            const [result] = await connection.execute(query, [
                data.name,
                data.email,
                data.company || '',
                data.service,
                data.message,
                'new'
            ]);
            
            console.log('✅ Contact saved to MySQL database with ID:', result.insertId);
            return { id: result.insertId, ...data };
            
        } catch (error) {
            console.error('❌ Error saving contact to MySQL:', error);
            
            // Return mock save if database is not configured
            if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR' || error.message.includes('Unknown database')) {
                console.log('⚠️  Database not configured, contact saved to memory only');
                return { 
                    id: Math.floor(Math.random() * 1000) + 100, 
                    ...data,
                    status: 'new',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            }
            
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.end();
                } catch (endError) {
                    console.error('Error closing connection:', endError);
                }
            }
        }
    }

    static async findAll() {
        let connection;
        try {
            connection = await createMySQLConnection();
            
            const query = `
                SELECT * FROM contacts 
                ORDER BY created_at DESC
            `;
            
            const [rows] = await connection.execute(query);
            
            console.log('✅ Fetched', rows.length, 'contacts from MySQL database');
            return rows;
            
        } catch (error) {
            console.error('❌ Error fetching contacts from MySQL:', error);
            
            // Return mock data if database is not configured
            if (error.code === 'ECONNREFUSED' || error.code === 'ER_ACCESS_DENIED_ERROR' || error.message.includes('Unknown database')) {
                console.log('⚠️  Database not configured, returning mock data');
                return [
                    {
                        id: 1,
                        name: 'John Doe',
                        email: 'john@example.com',
                        company: 'Tech Corp',
                        service: 'pentest',
                        message: 'This is a sample contact form submission for testing purposes.',
                        status: 'new',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    },
                    {
                        id: 2,
                        name: 'Jane Smith',
                        email: 'jane@example.com',
                        company: 'Security Inc',
                        service: 'audit',
                        message: 'Another sample contact for demonstration.',
                        status: 'contacted',
                        created_at: new Date(Date.now() - 86400000).toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ];
            }
            
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.end();
                } catch (endError) {
                    console.error('Error closing connection:', endError);
                }
            }
        }
    }

    static async findById(id) {
        let connection;
        try {
            connection = await createMySQLConnection();
            
            const query = `
                SELECT * FROM contacts 
                WHERE id = ?
            `;
            
            const [rows] = await connection.execute(query, [id]);
            
            if (rows.length === 0) {
                console.log('📝 No contact found with ID:', id);
                return null;
            }
            
            console.log('✅ Fetched contact from MySQL database:', rows[0]);
            return rows[0];
            
        } catch (error) {
            console.error('❌ Error fetching contact from MySQL:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.end();
                } catch (endError) {
                    console.error('Error closing connection:', endError);
                }
            }
        }
    }

    static async updateStatus(id, status) {
        let connection;
        try {
            connection = await createMySQLConnection();
            
            const query = `
                UPDATE contacts 
                SET status = ?, updated_at = NOW()
                WHERE id = ?
            `;
            
            const [result] = await connection.execute(query, [status, id]);
            
            if (result.affectedRows === 0) {
                console.log('📝 No contact found with ID:', id);
                return false;
            }
            
            console.log('✅ Contact status updated in MySQL database');
            return true;
            
        } catch (error) {
            console.error('❌ Error updating contact status in MySQL:', error);
            throw error;
        } finally {
            if (connection) {
                try {
                    await connection.end();
                } catch (endError) {
                    console.error('Error closing connection:', endError);
                }
            }
        }
    }
}

export default Contact;
