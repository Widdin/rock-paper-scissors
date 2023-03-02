<div align="center">
  <h1>🎲 Rock Paper Scissors </h1>
    <p>
    REST API that lets developers resolve their differences using the game Rock, Paper, Scissors. The rules are simple, the best of 1 match wins.
  </p>
</div>

## 🚀 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/en/) `>=v18.0.0`

### How to run

Install dependencies

```
npm install
```

Run the tests

```
npm test
```

Start the Backend server

```
npm run build && npm start
```

## 🌌 Endpoints

`GET /api/games/{id}`

**Returns the current state of a given game.**

Parameters

- `id` (required) - The ID of the game to retrieve.

---

`POST /api/games`

**Creates a new game.**

Request-body

- `name` (required) - The name of the player.

```JSON
{
    "name": "foo"
}
```

---

`POST /api/games/{id}/join`

**Connects to a game with a given ID.**

Parameters

- `id` (required) - The ID of the game to retrieve.

Request body

- `name` (required) - The name of the player.

```JSON
{
    "name": "bar"
}
```

---

`POST /api/games/{id}/move`

**Make a move.**

Parameters

- `id` (required) - The ID of the game to retrieve.

Request body

- `name` (required) - The name of the player.
- `move` (required) - The move to make. Valid moves are `rock`, `paper` or `scissors`

```JSON
{
    "name": "foo",
    "move": "rock"
}
```

---

## 🚨 Error responses

The API may return the following error responses:

- `400 Bad Request` - The request was invalid or missing a required parameter.
- `404 Not Found` - The requested resource could not be found.

## 💬 Example usage

Player 1 sends a request to create a new game and gets a game ID back
from the server.

```bash
curl \
-X POST \
-H "Content-Type: application/json" \
-d '{"name": "Foo"}' \
http://localhost:3000/api/games
```

Player 2 joins the game using the ID.

```bash
curl \
-X POST \
-H "Content-Type: application/json" \
-d '{"name": "Bar"}' \
http://localhost:3000/api/games/c7a5de44-c925-4129-af44-c8b3fc40d2a5/join
```

Player 1 makes a move (Rock).

```bash
curl \
-X POST \
-H "Content-Type: application/json" \
-d '{"name": "Foo", "move": "rock"}' \
http://localhost:3000/api/games/c7a5de44-c925-4129-af44-c8b3fc40d2a5/move
```

Player 2 makes a move (Scissors).

```bash
curl \
-X POST \
-H "Content-Type: application/json" \
-d '{"name": "Bar", "move": "scissors"}' \
http://localhost:3000/api/games/c7a5de44-c925-4129-af44-c8b3fc40d2a5/move
```

Player 1 checks the state of the game and checks who won

```bash
curl \
-X GET \
http://localhost:3000/api/games/c7a5de44-c925-4129-af44-c8b3fc40d2a5
```

Player 2 checks the state of the game and checks who won

```bash
curl \
-X GET \
http://localhost:3000/api/games/c7a5de44-c925-4129-af44-c8b3fc40d2a5
```
