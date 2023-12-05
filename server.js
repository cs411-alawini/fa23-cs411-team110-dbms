const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
const sqlFilePath = path.join(__dirname, 'backend', 'advanced_queries.sql');
const sqlQuery = fs.readFileSync(sqlFilePath, 'utf-8');

const db = mysql.createConnection({
  host: '35.202.76.109',
  user: 'smallpass',
  password: 'cloudsql01$%^',
  database: 'pollutant_tracker',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    console.log(":J%4Dc._\<RAznO\'");
  } else {
    console.log('Connected to the database');
  }
});


app.get('/noMean', (req, res) => {
  db.query('CALL NoMean()', (error, results) => {
    if (error) {
      console.error('Error calling NoMean stored procedure:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const mergedResults = results[0];

    res.json({ data: mergedResults });
  });
});

// TODO fix 
app.get('/getPollutantScore', (req, res) => {
  const { formattedDate, cutoff } = req.query;

  const sql = `
    CALL GetPollutantScore('${formattedDate}', '${cutoff}', @chosenCities);
    SELECT @chosenCities AS chosenCities;
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error calling GetPollutantScore stored procedure:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const chosenCities = results[1][0].chosenCities;

    if (!chosenCities) {
      return res.status(404).json({ error: 'No data found' });
    }
    res.json({ chosenCities });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
