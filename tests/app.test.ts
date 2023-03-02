import request from 'supertest';
import app from '../src/app';
import Moves from '../src/utils/moves';

describe('POST /api/games', () => {
  test('Create a new game', async () => {
    const res = await request(app).post('/api/games').send({ name: 'Foo' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('New game successfully created.');
  });

  test('Missing parameters', async () => {
    const res = await request(app).post('/api/games').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Missing parameters: name');
  });
});

describe('GET /api/games/{id}', () => {
  test('Status of a existing game', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    const res = await request(app).get(`/api/games/${gameID}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(gameID);
  });

  test('Status of a non-existing game', async () => {
    const res = await request(app).get('/api/games/123');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Game could not be found.');
  });
});

describe('POST /api/games/{id}/join', () => {
  test('Join a game', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    const res = await request(app)
      .post(`/api/games/${gameID}/join`)
      .send({ name: 'Bar' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Successfully joined the game.');
  });

  test('The name already exist', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    const res = await request(app)
      .post(`/api/games/${gameID}/join`)
      .send({ name: 'Foo' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('The name already exists.');
  });

  test('The game is already full.', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    await request(app).post(`/api/games/${gameID}/join`).send({ name: 'Bar' });

    const res = await request(app)
      .post(`/api/games/${gameID}/join`)
      .send({ name: 'Baz' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('The game is already full.');
  });

  test('Join a non-existing game', async () => {
    const res = await request(app)
      .post(`/api/games/123/join`)
      .send({ name: 'Bar' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Game could not be found.');
  });

  test('Missing parameters', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    const res = await request(app).post(`/api/games/${gameID}/join`).send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Missing parameters: name');
  });
});

describe('POST /api/games/{id}/move', () => {
  test('Make a valid move', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;
    const move = Moves.Rock;

    const res = await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Foo',
      move: move
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe(`Successfully selected ${move}.`);
  });

  test("Invalid move 'duck'", async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    const res = await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Foo',
      move: 'duck'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid move 'duck'.");
  });

  test('Set a move twice', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Foo',
      move: Moves.Rock
    });

    const move = Moves.Paper;

    const res = await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Foo',
      move: move
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      `Unable to set move to ${move}, move has already been set.`
    );
  });

  test('Player does not exist', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    const res = await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Bar',
      move: Moves.Rock
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Player does not exist.');
  });

  test('Missing parameters', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    const res = await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Foo'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Missing parameters: move');
  });
});

describe('Full game', () => {
  test('Player One winner', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    await request(app).post(`/api/games/${gameID}/join`).send({
      name: 'Bar'
    });

    await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Foo',
      move: Moves.Rock
    });

    await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Bar',
      move: Moves.Scissors
    });

    const res = await request(app).get(`/api/games/${gameID}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.state).toBe('Game is over.');
    expect(res.body.id).toBe(gameID);

    const [playerOne, playerTwo] = res.body.players;

    expect(playerOne.name).toBe('Foo');
    expect(playerTwo.name).toBe('Bar');

    expect(playerOne.state).toBe('Winner with rock');
    expect(playerTwo.state).toBe('Loser with scissors');
  });

  test('Player Two winner', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    await request(app).post(`/api/games/${gameID}/join`).send({ name: 'Bar' });

    await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Foo',
      move: Moves.Rock
    });

    await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Bar',
      move: Moves.Paper
    });

    const res = await request(app).get(`/api/games/${gameID}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.state).toBe('Game is over.');
    expect(res.body.id).toBe(gameID);

    const [playerOne, playerTwo] = res.body.players;

    expect(playerOne.name).toBe('Foo');
    expect(playerTwo.name).toBe('Bar');

    expect(playerOne.state).toBe('Loser with rock');
    expect(playerTwo.state).toBe('Winner with paper');
  });

  test('Draw', async () => {
    const resGame = await request(app).post('/api/games').send({ name: 'Foo' });

    const gameID = resGame.body.id;

    await request(app).post(`/api/games/${gameID}/join`).send({ name: 'Bar' });

    await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Foo',
      move: Moves.Rock
    });

    await request(app).post(`/api/games/${gameID}/move`).send({
      name: 'Bar',
      move: Moves.Rock
    });

    const res = await request(app).get(`/api/games/${gameID}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.state).toBe('Game is over.');
    expect(res.body.id).toBe(gameID);

    const [playerOne, playerTwo] = res.body.players;

    expect(playerOne.name).toBe('Foo');
    expect(playerTwo.name).toBe('Bar');

    expect(playerOne.state).toBe('Draw');
    expect(playerTwo.state).toBe('Draw');
  });
});
