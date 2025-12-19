const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 4002;

app.use(cors());
app.use(express.json());

const FILE = "./favorites.json";

// Load favorites
function loadFavorites() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, "[]");
    }
    return JSON.parse(fs.readFileSync(FILE));
}

// Save favorites
function saveFavorites(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// ADD favorite  (POST /add)
app.post("/add", (req, res) => {
    const { studentId, clubId } = req.body;

    let favs = loadFavorites();

    // If student has an entry already
    let student = favs.find(x => x.studentId === studentId);

    if (!student) {
        student = { studentId, favorites: [] };
        favs.push(student);
    }

    if (!student.favorites.includes(clubId)) {
        student.favorites.push(clubId);
    }

    saveFavorites(favs);
    res.json({ message: "Favorite added!", favorites: student.favorites });
});

// GET favorites (GET /list/:studentId)
app.get("/list/:studentId", (req, res) => {
    const favs = loadFavorites();
    const student = favs.find(x => x.studentId === req.params.studentId);

    if (!student) {
        return res.json({ studentId: req.params.studentId, favorites: []});
    }

    res.json(student);
});

// REMOVE favorite
app.post("/remove", (req, res) => {
    const { studentId, clubId } = req.body;

    let favs = loadFavorites();
    let student = favs.find(x => x.studentId === studentId);

    if (student) {
        student.favorites = student.favorites.filter(id => id !== clubId);
    }

    saveFavorites(favs);
    res.json({ message: "Favorite removed" });
});

app.listen(PORT, () => {
    console.log(`Favorites microservice running on port ${PORT}`);
});
