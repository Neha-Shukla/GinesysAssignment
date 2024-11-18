// server.js
const app = require('./app');
const port = process.env.PORT || 3000;
const path = require('path')
const fs = require('fs')
const uploadsDir = path.join(__dirname, 'uploads', 'dogs');

// Ensure that the 'uploads/dogs' directory exists on server start
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Creates the directory along with any missing parent directories
  console.log('Uploads directory "uploads/dogs" created!');
} else {
  console.log('Uploads directory "uploads/dogs" already exists!');
}

app.listen(port, () => {
  console.log(`Dog Picture API is running on port ${port}`);
});
