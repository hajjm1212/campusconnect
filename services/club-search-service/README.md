# Club Search Microservice (Port 4001)

This microservice allows the CampusConnect main program to search for clubs
based on keywords. It reads from `clubs.json` and returns matching results.

## How to Run
npm install
npm start

## Endpoint: GET /search?keyword=xxx

### Example Request
GET http://localhost:4001/search?keyword=robot



### Example Response
```json
{
  "keyword": "robot",
  "results": [
    {
      "id": "robotics_club",
      "name": "Robotics Club",
      "category": "Engineering",
      "description": "Design and build robots..."
    }
  ],
  "count": 1,
  "noResults": false
}
CS361 Requirements
Runs independently on port 4001

No direct function calls from the main program

Accepts programmatic requests only



