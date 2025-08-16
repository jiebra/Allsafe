# Quick Database Setup Guide

## 🚀 To Fix the "Loading Forever" Issue

The admin page is showing a loading spinner because the database isn't configured. Here's how to fix it:

### Option 1: Quick Fix (No Database Setup)
The app now includes mock data, so it should work immediately. Just restart your server:

```bash
npm run dev
```

### Option 2: Set Up MySQL Database (Recommended)

1. **Create a `.env` file** in your project root:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=allsafe_db
DB_PORT=3306
PORT=3001
```

2. **Run the MySQL setup script**:
```bash
npm run setup-mysql
```

3. **Test the database connection**:
```bash
npm run test-db
```

4. **Restart your server**:
```bash
npm run dev
```

### Option 3: Use XAMPP/WAMP (Easiest)

1. Install XAMPP or WAMP
2. Start MySQL service
3. Create a database named `allsafe_db`
4. Use these credentials in `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=allsafe_db
DB_PORT=3306
PORT=3001
```

## ✅ After Setup

- **Website**: http://localhost:3001
- **Admin Panel**: http://localhost:3001/admin
- **Contact Form**: http://localhost:3001

The admin page should now load contacts without the infinite loading spinner!
