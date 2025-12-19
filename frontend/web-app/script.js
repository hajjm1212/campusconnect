console.log("script.js loaded!");

// =============================
// GLOBAL ONLOAD HANDLER
// =============================
window.onload = function () {
    loadAllClubs();
    loadFavorites();
};

// =============================
// SEARCH CLUBS (4001)
// =============================
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const resultsDiv = document.getElementById('searchResults');

    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const keyword = document.getElementById('keyword').value.trim();

            const res = await fetch(`http://localhost:4001/search?keyword=${keyword}`);
            const data = await res.json();

            resultsDiv.innerHTML = "";

            if (!data.results || data.results.length === 0) {
                resultsDiv.innerHTML = "<p>No clubs found.</p>";
                return;
            }

            data.results.forEach(club => {
                const div = document.createElement('div');
                div.className = "club-card";
                const clubId = clubNameToId(club.name);

div.innerHTML = `
    <h3>${club.name}</h3>
    <p>${club.description}</p>

    <p><strong>Popularity Score:</strong> <span id="pop-${clubId}">Loading...</span></p>
    <p><strong>Recommendation:</strong> <span id="rec-${clubId}">Loading...</span></p>

    <button onclick="addFavorite('${clubId}')">Add to Favorites</button>
`;

                resultsDiv.appendChild(div);
            });
        });
    }
});

// =============================
// LOAD ALL CLUBS (4001)
// =============================
async function loadAllClubs() {
    const container = document.getElementById("clubs-container");
    if (!container) return;

    const res = await fetch("http://localhost:4001/search/all");
    const data = await res.json();
    const clubs = data.results;

    container.innerHTML = "";

    clubs.forEach(club => {
        const div = document.createElement("div");
        div.classList.add("club-card");

div.innerHTML = `
  <h3>${club.name}</h3>
  <p>${club.description}</p>

  <!-- Popularity will load here -->
  <p id="pop-${club.id}">Loading popularity...</p>

  <!-- Recommendations will load here -->
  <div id="rec-${club.id}">Loading recommendations...</div>

  <button onclick="addFavorite('${club.id}')">Add to Favorites</button>
`;

        container.appendChild(div);
        // Load popularity & recommendations
const popElement = document.getElementById(`pop-${club.id}`);
loadPopularity(club.id, popElement);

const recElement = document.getElementById(`rec-${club.id}`);
loadRecommendations(club.id, recElement);

    });
}

// =============================
// FAVORITES (4002)
// =============================
async function addFavorite(clubId) {
    console.log("Adding favorite:", clubId);

    try {
        const response = await fetch("http://localhost:4002/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId: "mia",
                clubId: clubId
            })
        });

        const data = await response.json();
        alert(data.message || "Added to favorites!");

    } catch (err) {
        console.error("Error adding favorite:", err);
        alert("Failed to add favorite.");
    }
}
// Load favorites (GET)
// Load clubs so we can map clubId -> clubName
async function fetchClubs() {
    const response = await fetch("/clubs.json");
    return await response.json();
}

async function loadFavorites() {
    const container = document.getElementById("favoritesList");
    if (!container) return;

    // Get student's favorites
    const response = await fetch("http://localhost:4002/list/mia");
    const data = await response.json();

    // Load clubs.json (for club names)
    const clubs = await fetchClubs();

    container.innerHTML = "";

    if (!data.favorites || data.favorites.length === 0) {
        container.innerHTML = "<p>No favorites yet.</p>";
        return;
    }

    // Loop through clubIds
    data.favorites.forEach(clubId => {
        const div = document.createElement("div");
        div.className = "favorite-card";

        // Find the club info in clubs.json
        const club = clubs.find(c => c.id === clubId);

        div.innerHTML = `
            <p><strong>${club ? club.name : clubId}</strong></p>
            <button onclick="removeFavorite('mia', '${clubId}')">Remove</button>
        `;

        container.appendChild(div);
    });
}


async function removeFavorite(studentId, clubId) {
    await fetch("http://localhost:4002/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, clubId })
    });

    loadFavorites();
}

async function loadPopularity(clubId, element) {
  try {
    const res = await fetch(`http://localhost:3000/popularity/${clubId}`);
    const data = await res.json();
    element.innerHTML = `Popularity Score: ${data.popularity}`;
  } catch (err) {
    element.innerHTML = "Popularity unavailable";
  }
}

async function loadRecommendations(clubId, container) {
  try {
    const res = await fetch(`http://localhost:3000/recommend/${clubId}`);
    const data = await res.json();

    container.innerHTML = "<strong>Recommended Clubs:</strong><br>";
    data.recommendations.forEach(rec => {
      container.innerHTML += `• ${rec}<br>`;
    });
  } catch (err) {
    container.innerHTML = "No recommendations available.";
  }
}
// ====================
// Popularity
// =====================

function clubNameToId(name) {
    return name.toLowerCase().replace(/\s+/g, "_");
}