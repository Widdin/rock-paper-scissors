import { Request, Response } from 'express';
import GameHandler from '../services/gameHandler';
import Player from '../services/player';

const gameHandler = new GameHandler();

/**
 * Creates a new game and adds a player to it.
 * @param {Request} req - The request object from Express.
 * @param {Response} res - The response object from Express.
 * @returns {Response} - A JSON response containing the message and id of the newly created game.
 * @throws {Error} - If the player name is invalid or the game creation fails.
 */
const create = (req: Request, res: Response): Response => {
  const { name } = req.body;

  const player = new Player(name);
  const gameId = gameHandler.createNewGame();
  gameHandler.joinGame(gameId, player);

  return res.status(201).json({
    message: 'New game successfully created.',
    id: gameId
  });
};

/**
 * Retrieves the status of a game.
 * @param {Request} req - The request object from Express.
 * @param {Response} res - The response object from Express.
 * @returns {Response} - A JSON response containing the Game object with the players.
 * @throws {Error} - If the game does not exist.
 */
const status = (req: Request, res: Response): Response => {
  const { id } = req.params;

  try {
    const game = gameHandler.getGame(id);
    return res.status(200).json(game);
  } catch (err) {
    return res.status(404).json({
      error: err.message
    });
  }
};

/**
 * Join a game with a given ID.
 * @param {Request} req - The request object from Express.
 * @param {Response} res - The response object from Express.
 * @returns {Response} - A JSON response containing a success-message.
 * @throws {Error} - If the game does not exist.
 */
const join = (req: Request, res: Response): Response => {
  const { name } = req.body;
  const { id } = req.params;

  const player = new Player(name);
  try {
    gameHandler.joinGame(id, player);
    return res.status(200).json({
      message: 'Successfully joined the game.'
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
};

/**
 * Sets the move for a player.
 * @param {Request} req - The request object from Express.
 * @param {Response} res - The response object from Express.
 * @returns {Response} - A JSON response containing a success-message.
 * @throws {Error} - If the move is invalid or player/game does not exist.
 */
const move = (req: Request, res: Response): Response => {
  const { name, move } = req.body;
  const { id } = req.params;

  try {
    gameHandler.setMove(id, name, move);
    return res.status(200).json({
      message: `Successfully selected ${move}.`
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message
    });
  }
};

export { create, status, join, move };
