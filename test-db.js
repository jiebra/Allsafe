#!/usr/bin/env node

import { createMySQLConnection } from './config/database.js';
import Contact from './models/Contact.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDatabase() {
    console.log('🧪 Testing AllSafe MySQL Database Connection\n');
    
    try {
        // Test basic connection
        console.log('1️⃣ Testing database connection...');
        const connection = await createMySQLConnection();
        console.log('✅ Database connection successful!');
        await connection.end();
        
        // Test Contact model operations
        console.log('\n2️⃣ Testing Contact model operations...');
        
        // Test saving a contact
        const testContact = {
            name: 'Test User',
            email: 'test@example.com',
            company: 'Test Company',
            service: 'pentest',
            message: 'This is a test message from the database test script.'
        };
        
        console.log('📝 Saving test contact...');
        const savedContact = await Contact.save(testContact);
        console.log('✅ Contact saved with ID:', savedContact.id);
        
        // Test finding all contacts
        console.log('\n📋 Fetching all contacts...');
        const allContacts = await Contact.findAll();
        console.log('✅ Found', allContacts.length, 'contacts');
        
        // Test finding contact by ID
        console.log('\n🔍 Fetching contact by ID...');
        const foundContact = await Contact.findById(savedContact.id);
        if (foundContact) {
            console.log('✅ Contact found:', foundContact.name);
        }
        
        // Test updating contact status
        console.log('\n🔄 Updating contact status...');
        const updated = await Contact.updateStatus(savedContact.id, 'contacted');
        if (updated) {
            console.log('✅ Contact status updated successfully');
        }
        
        console.log('\n🎉 All database tests passed successfully!');
        console.log('✅ Your MySQL connection is working perfectly');
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        console.log('\n💡 Troubleshooting tips:');
        console.log('   - Make sure MySQL server is running');
        console.log('   - Check your .env file configuration');
        console.log('   - Run "npm run setup-mysql" to configure database');
    }
}

// Run test if this file is executed directly
if (import.meta.url === path.toFileURL(process.argv[1]).href) {
    testDatabase();
}

export { testDatabase };

