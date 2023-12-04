const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'dbms-sqlserver.us-central1.rdbms.googleapis.com',
  user: 'root',
  password: ":J%4Dc._\<RAznO'",
  database: 'pollutantTracker',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
    executeSqlScripts();
  }
});

function executeSqlScripts() {
  // Reads and executes SQL scripts
  const sqlFolderPath = path.join(__dirname, 'backend'); 
  fs.readdirSync(sqlFolderPath).forEach((file) => {
    const sqlFilePath = path.join(sqlFolderPath, file);
    const sql = fs.readFileSync(sqlFilePath, 'utf-8');

    db.query(sql, (err) => {
      if (err) {
        console.error(`Error executing SQL script ${file}:`, err);
      } else {
        console.log(`SQL script ${file} executed successfully`);
      }
    });
  });
}

app.get('/api/userQueries', (req, res) => {
  const userQueriesQuery = 'CALL UserQueries();';

  db.query(userQueriesQuery, (userQueriesErr, userQueriesResult) => {
    if (userQueriesErr) {
      console.error('Error executing user queries query:', userQueriesErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(userQueriesResult[0]);
    }
  });
});

app.get('/api/noMean', (req, res) => {
  const noMeanQuery = 'CALL NoMean();';

  db.query(noMeanQuery, (noMeanErr, noMeanResult) => {
    if (noMeanErr) {
      console.error('Error executing NO2 mean query:', noMeanErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(noMeanResult[0]);
    }
  });
});

app.get('/api/pollutantScore', (req, res) => {
  const { cityCode, formattedDate } = req.query;

  const pollutantScoreQuery = `
    CALL GetPollutantScore('${cityCode}', '${formattedDate}', @no2grade, @o3grade, @so2grade, @cograde);
    SELECT @no2grade AS no2grade, @o3grade AS o3grade, @so2grade AS so2grade, @cograde AS cograde;
  `;

  db.query(pollutantScoreQuery, (pollutantScoreErr, pollutantScoreResult) => {
    if (pollutantScoreErr) {
      console.error('Error executing pollutant score query:', pollutantScoreErr);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Send the result as JSON response
      res.json(pollutantScoreResult[1][0]);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
