const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "35.202.76.109",
  user: "smallpass",
  password: "cloudsql01$%^",
  database: "pollutant_tracker",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    console.log(":J%4Dc._<RAznO'");
  } else {
    console.log("Connected to the database");
  }
});

app.get("/api/userQueries", (req, res) => {
  const userQueriesQuery = "CALL UserQueries();";

  db.query(userQueriesQuery, (userQueriesErr, userQueriesResult) => {
    if (userQueriesErr) {
      console.error("Error executing user queries query:", userQueriesErr);
      return res.status(500).json({ error: "Internal Server Error" }); // NOTE: use return when we want to ensure END of execution
    } else {
      res.json(userQueriesResult[0]);
    }
  });
});

// Calls NoMean Stored Procedure
app.get("/api/noMean", (req, res) => {
  const noMeanQuery = "CALL NoMean();";

  db.query(noMeanQuery, (noMeanErr, noMeanResult, fields) => {
    if (noMeanErr) {
      console.error("Error executing NO2 mean query:", noMeanErr);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log(fields);
      res.json(noMeanResult[0]);
    }
  });
});

// Calls pollutantScore
app.get("/api/pollutantScore", (req, res) => {
  const { formattedDate, cutoff } = req.query;

  const pollutantScoreQuery = `
    CALL GetPollutantScore('${formattedDate}', '${cutoff}', @citygrades);
    SELECT @citygrades as cityGrades;
  `;

  db.query(pollutantScoreQuery, (pollutantScoreErr, pollutantScoreResult) => {
    if (pollutantScoreErr) {
      console.error(
        "Error executing pollutant score query:",
        pollutantScoreErr
      );
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      // Send the result as JSON response
      res.json(pollutantScoreResult[1][0]);
    }
  });
});

// Given login -> username and password, return successful or not (I used post instead of get, idk if that's best?)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body; // Extract properties 'username' and 'password' from request body

  db.query(
    "SELECT Username FROM Users WHERE Username = ? AND UserPassword = ?",
    [username, password],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json("Internal server error");
      }
      // If empty we can assume username/password combo is bad
      if (results.length === 0) {
        return res.status(401).json("Authentication failed");
      }

      // Otherwise successful
      res.json({ authentication: "Authentication successful" }); // Wrap in {} to make object?
    }
  );
});

// Read UserRole to decide whether to grant special user access (idk how this should be implemented on react side?)
app.get("/api/user-role", (req, res) => {
  const { username } = req.query; // Get from query
  // Input validation
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  db.query(
    "SELECT UserRole FROM Users WHERE Username = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error("Error executing UserRole Query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length === 0) {
        // Empty set returned
        return res.status(404).json({ error: "Username not found" });
      }
      res.json({ userRole: results[0].UserRole });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
