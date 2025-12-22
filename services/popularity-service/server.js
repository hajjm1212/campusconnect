const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 4003;

app.use(express.json());

// ⭐ STATIC FAKE POPULARITY DATA (good for demo video)
const popularityData = {
    "coding_club": 12,
    "robotics_club": 8,
    "astronomy_club": 5,
    "dance_club": 9,
    "game_dev_club": 14
};

// ➤ GET popularity for one club
app.get("/popularity/:clubId", (req, res) => {
    const clubId = req.params.clubId;
    const score = popularityData[clubId] || 0;   // default score = 0 if not found
    res.json({ clubId, score });
});

// Start server
app.listen(PORT, () => {
    console.log(`Popularity service running on port ${PORT}`);
});
