// CLUB SEARCH MICROSERVICE (PORT 4001)

const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Load clubs.json
let clubs = JSON.parse(fs.readFileSync("clubs.json", "utf8"));

// --- ROUTE: SEARCH BY KEYWORD ---
app.get("/search", (req, res) => {
    const keyword = req.query.keyword?.toLowerCase() || "";

    const results = clubs.filter(club =>
        club.name.toLowerCase().includes(keyword) ||
        club.description.toLowerCase().includes(keyword) ||
        club.category.toLowerCase().includes(keyword)
    );

    res.json({ results });
});

// --- ROUTE: GET ALL CLUBS ---
app.get("/search/all", (req, res) => {
    res.json({ results: clubs });
});

// Start server
app.listen(4001, () => {
    console.log("Club Search Microservice running on port 4001");
});

