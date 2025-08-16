# AllSafe Website - Node.js Setup Guide

This guide will help you set up the Node.js backend for your AllSafe cybersecurity website.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Copy the example environment file:
```bash
cp env.example .env
```

### 3. Configure MySQL Database
Update your `.env` file with MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-mysql-password
DB_NAME=allsafe
```

### 4. Setup MySQL Database
Run the MySQL setup script:
```bash
npm run setup-mysql
```

### 5. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 6. Access Your Website
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Contact API**: http://localhost:3000/api/contact
- **Health Check**: http://localhost:3000/api/health

## 📧 Email Configuration

To enable email notifications for contact form submissions:

### Option 1: Gmail
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Update your `.env` file:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Option 2: Other Email Services
Modify the `sendEmail` function in `server.js` for your preferred email service.

## 🗄️ Database Setup

Choose your preferred database and follow the setup instructions:

### Option 1: MongoDB (Recommended for beginners)

1. **Install MongoDB** or use MongoDB Atlas (cloud)
2. **Install Mongoose**:
   ```bash
   npm install mongoose
   ```
3. **Update `.env`**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/allsafe
   ```
4. **Uncomment MongoDB section** in `config/database.js`
5. **Uncomment Mongoose model** in `models/Contact.js`

### Option 2: MySQL

1. **Install MySQL** and create a database
2. **Install MySQL driver**:
   ```bash
   npm install mysql2
   ```
3. **Update `.env`**:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your-password
   DB_NAME=allsafe
   ```
4. **Create the table** using the SQL in `models/Contact.js`
5. **Uncomment MySQL section** in `config/database.js`

### Option 3: PostgreSQL

1. **Install PostgreSQL** and create a database
2. **Install PostgreSQL driver**:
   ```bash
   npm install pg
   ```
3. **Update `.env`**:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/allsafe
   ```
4. **Create the table** using the SQL in `models/Contact.js`
5. **Uncomment PostgreSQL section** in `config/database.js`

### Option 4: SQLite (Development)

1. **Install SQLite**:
   ```bash
   npm install sqlite3
   ```
2. **Create database directory**:
   ```bash
   mkdir database
   ```
3. **Create the table** using the SQL in `models/Contact.js`
4. **Uncomment SQLite section** in `config/database.js`

## 🔧 Configuration Steps

### Step 1: Choose Your Database
1. Open `config/database.js`
2. Uncomment the section for your chosen database
3. Comment out the placeholder `connectDatabase` function

### Step 2: Update Contact Model
1. Open `models/Contact.js`
2. Uncomment the model for your chosen database
3. Comment out the placeholder `Contact` class

### Step 3: Update Server.js
1. Open `server.js`
2. Uncomment the email sending function if you want email notifications
3. Update the email configuration

### Step 4: Test the Setup
1. Start the server: `npm run dev`
2. Fill out the contact form on your website
3. Check the console for form submission logs
4. Check your database for stored submissions

## 📁 File Structure

```
All-safe-final/
├── index.html              # Main website
├── styles.css              # Website styles
├── script.js               # Frontend JavaScript
├── server.js               # Node.js server
├── package.json            # Dependencies
├── .env                    # Environment variables
├── env.example             # Environment template
├── config/
│   └── database.js         # Database configuration
├── models/
│   └── Contact.js          # Contact model
└── SETUP.md                # This file
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
1. **Set environment variables** for production
2. **Install dependencies**:
   ```bash
   npm install --production
   ```
3. **Start the server**:
   ```bash
   npm start
   ```

### Cloud Deployment Options

#### Heroku
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new app
4. Set environment variables in Heroku dashboard
5. Deploy:
   ```bash
   git add .
   git commit -m "Initial deployment"
   heroku create
   git push heroku main
   ```

#### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

#### DigitalOcean App Platform
1. Connect your repository
2. Configure environment variables
3. Deploy

## 🔍 Testing

### Test Contact Form
1. Open http://localhost:3000
2. Fill out the contact form
3. Submit and check:
   - Console logs for submission
   - Database for stored data
   - Email notifications (if configured)

### Test API Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Contact form submission
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "service": "pentest",
    "message": "Test message"
  }'
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use**
   - Change PORT in `.env` file
   - Or kill the process using the port

2. **Database connection failed**
   - Check database credentials in `.env`
   - Ensure database server is running
   - Verify database exists

3. **Email not sending**
   - Check email credentials in `.env`
   - Verify 2FA is enabled for Gmail
   - Check app password is correct

4. **Form submissions not working**
   - Check browser console for errors
   - Verify server is running
   - Check API endpoint is accessible

### Debug Mode
Enable debug logging by adding to `.env`:
```env
DEBUG=true
NODE_ENV=development
```

## 📞 Support

If you encounter issues:
1. Check the console logs
2. Verify all environment variables are set
3. Ensure database is properly configured
4. Test API endpoints manually

## 🎉 Next Steps

Once your setup is working:
1. **Customize the website content** in `index.html`
2. **Add more API endpoints** for additional features
3. **Implement user authentication** if needed
4. **Add admin dashboard** for managing submissions
5. **Set up automated backups** for your database

---

**Your AllSafe website is now ready with a functional backend!** 🚀
