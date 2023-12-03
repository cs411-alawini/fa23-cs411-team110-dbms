const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
const path = require('path');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pollutantDB = mysql.createConnection({
  host: 'dbms-sqlserver.us-central1.rdbms.googleapis.com',
  user: 'root',
  password: ":J%4Dc._\<RAznO'",
  database: 'pollutantTracker',
});

pollutantDB.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
    executeSqlScripts();
  }
});

function executeSqlScripts() {
  // Read and execute SQL scripts
  const sqlFolderPath = path.join(__dirname, 'backend'); 
  fs.readdirSync(sqlFolderPath).forEach((file) => {
    const sqlFilePath = path.join(sqlFolderPath, file);
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');

    pollutantDB.query(sql, (err) => {
      if (err) {
        console.error(`Error executing SQL script ${file}:`, err);
      } else {
        console.log(`SQL script ${file} executed successfully`);
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});