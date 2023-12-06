const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
const sqlFilePath = path.join(__dirname, "backend", "advanced_queries.sql");
const sqlQuery = fs.readFileSync(sqlFilePath, "utf-8");

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

app.get("/noMean", (req, res) => {
  db.query("CALL NoMean()", (error, results) => {
    if (error) {
      console.error("Error calling NoMean stored procedure:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const mergedResults = results[0];

    res.json({ data: mergedResults });
  });
});

app.get("/api/search", (req, res) => {
  let { search: s } = req.query;

  if (s === undefined) {
    return res.status(301).json({ error: "Malformed query" });
  }

  s = s.padEnd(s.length + 1, "%");
  s = s.padStart(s.length + 1, "%");

  db.query(
    "SELECT City, avg(No2Mean) as No2Mean, avg(O3Mean) as O3Mean, avg(So2Mean) as So2Mean, avg(CoMean) as CoMean from Location natural join Measurements where City LIKE ? group by City;",
    [s],
    (qErr, qRes) => {
      if (qErr) {
        console.log(qErr);
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.status(200).json(qRes);
      }
    }
  );
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

// Given login -> username and password, return successful or not (I used post instead of get, idk if that's best?)
app.post("/api/login", (req, res) => {
  const { username: u, password: p } = req.body; // Extract properties 'username' and 'password' from request body

  if (u === undefined || p === undefined) {
    return res.status(400).json("Failed.");
  }

  db.query(
    "SELECT Username FROM Users WHERE Username = ? AND UserPassword = ?",
    [u, p],
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
  const { username: u, role: r } = req.query; // Get from query
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

// Update UserRole (for use by admin only)
app.post("/api/update-role", (req, res) => {
  const { username: u, role: r } = req.body; // Extract properties 'username' and 'role' from request body

  if (u === undefined || r === undefined) {
    return res.status(400).json("Failed.");
  }

  db.query(
    "UPDATE Users SET UserRole = ? WHERE Users.Username = ?",
    [r, u],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json("Internal server error");
      }
      if (results.length === 0) {
        // Empty set returned
        return res.status(404).json({ error: "Username not found" });
      }
      // Otherwise successful
      res.json({ roleUpdate: " Update successful" });
    }
  );
});

app.get("/api/getPollutantScore", (req, res) => {
  const { formattedDate, cutoff } = req.query;
  const sql = `
    CALL GetPollutantScore('${formattedDate}', '${cutoff}');
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error calling GetPollutantScore stored procedure:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
