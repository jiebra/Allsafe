import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import nodemailer from 'nodemailer';
import { initializeDatabase } from './config/database.js';
import Contact from './models/Contact.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working correctly',
        timestamp: new Date().toISOString()
    });
});

// GET endpoint for /api/contact (for testing/info)
app.get('/api/contact', (req, res) => {
    res.json({
        success: false,
        message: 'This endpoint only accepts POST requests for contact form submissions.',
        info: {
            method: 'POST',
            endpoint: '/api/contact',
            required_fields: ['name', 'email', 'service', 'message'],
            optional_fields: ['company']
        },
        example: {
            name: 'John Doe',
            email: 'john@example.com',
            company: 'Company Name',
            service: 'pentest',
            message: 'Your message here'
        }
    });
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
    console.log('📧 Contact form submission received:', req.body);
    try {
        const { name, email, company, service, message } = req.body;

        // Validate required fields
        if (!name || !email || !service || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Create email content
        const emailContent = `
            New Contact Form Submission from AllSafe Website
            
            Name: ${name}
            Email: ${email}
            Company: ${company || 'Not provided'}
            Service: ${service}
            
            Message:
            ${message}
            
            Submitted on: ${new Date().toLocaleString()}
        `;

        // For now, we'll just log the submission
        // You can replace this with actual email sending or database storage
        console.log('=== NEW CONTACT FORM SUBMISSION ===');
        console.log(emailContent);
        console.log('===================================');

        // TODO: Add email sending functionality here
        // await sendEmail(emailContent);

        // Save to database
        const savedContact = await Contact.save({ name, email, company, service, message });
        console.log('✅ Contact saved:', savedContact);

        res.json({
            success: true,
            message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
        });

    } catch (error) {
        console.error('❌ Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending your message. Please try again.',
            error: error.message
        });
    }
});

// Email sending function (commented out for now)
async function sendEmail(content) {
    // Configure your email service here
    // Example with Gmail:
    /*
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'info@allsafe.co.ke',
        subject: 'New Contact Form Submission - AllSafe',
        text: content
    };

    await transporter.sendMail(mailOptions);
    */
}

// Database storage function (commented out for now)
async function saveToDatabase(data) {
    // Add your database connection and storage logic here
    // Example with MongoDB:
    /*
    import Contact from './models/Contact.js';
    const contact = new Contact(data);
    await contact.save();
    */
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'AllSafe website server is running',
        timestamp: new Date().toISOString(),
        endpoints: {
            'GET /': 'Main website',
            'GET /admin': 'Admin panel',
            'POST /api/contact': 'Submit contact form',
            'GET /api/contacts': 'Get all contacts (admin)',
            'GET /api/contacts/:id': 'Get single contact',
            'PUT /api/contacts/:id/status': 'Update contact status',
            'GET /api/health': 'Health check',
            'GET /api/test': 'Test endpoint'
        }
    });
});

// Get all contacts (for admin purposes)
app.get('/api/contacts', async (req, res) => {
    try {
        console.log('📋 Fetching contacts from database...');
        const contacts = await Contact.findAll();
        console.log(`✅ Successfully fetched ${contacts.length} contacts`);
        res.json({
            success: true,
            data: contacts
        });
    } catch (error) {
        console.error('❌ Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts: ' + error.message
        });
    }
});

// Get contact by ID
app.get('/api/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact'
        });
    }
});

// Update contact status
app.put('/api/contacts/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['new', 'contacted', 'converted', 'archived'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: new, contacted, converted, archived'
            });
        }
        
        const updated = await Contact.updateStatus(req.params.id, status);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Contact status updated successfully'
        });
    } catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact status'
        });
    }
});

// Start server
const server = app.listen(PORT, async () => {
    console.log(`🚀 AllSafe website server running on port ${PORT}`);
    console.log(`🌐 Website: http://localhost:${PORT}`);
    console.log(`👨‍💼 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`🧪 Test Page: http://localhost:${PORT}/test`);
    console.log(`📧 Contact Form: http://localhost:${PORT}/#contact`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
    console.log(`📝 Contact API Info: http://localhost:${PORT}/api/contact`);
    
    try {
        // Initialize database and create tables
        await initializeDatabase();
        console.log('✅ Database connection and initialization completed');
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        console.log('⚠️  Server will continue running but database features may not work');
    }
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.log(`💡 Try one of these commands:`);
        console.log(`   npm run dev:3003`);
        console.log(`   $env:PORT=3003; npm run dev`);
        console.log(`   set PORT=3003 && npm run dev`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', error);
    }
});

export default app;
