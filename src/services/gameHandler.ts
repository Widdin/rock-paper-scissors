import Moves from '../utils/moves';
import Game from './game';
import Player from './player';

interface Games {
  [key: string]: Game;
}

class GameHandler {
  games: Games = {};

  /**
   * Creates a new game and adds it to the list of games.
   * @returns the ID of the new game.
   */
  createNewGame(): string {
    const newGame = new Game();
    this.games[newGame.id] = newGame;

    return newGame.id;
  }

  /**
   * Add a player to the game identified by the given ID.
   * @param {string} id - The ID of the Game to join.
   * @param {Player} player - The player to join the game.
   * @throws {Error} Throws an error if the game is already full or the player name already exists.
   */
  joinGame(id: string, player: Player): void {
    const game = this.getGame(id);
    game.addPlayer(player);
  }

  /**
   * Sets a move for a player in a game.
   * @param {string} id - The ID of the Game.
   * @param {string} name - The name of the player making the move.
   * @param {Moves} move - The move the player is making.
   * @throws {Error} If the move is invalid or the player doesn't exist.
   * @returns {void}
   */
  setMove(id: string, name: string, move: Moves): void {
    const game = this.getGame(id);

    if (game.isValidMove(move)) {
      const player = game.getPlayer(name);

      if (player === undefined) {
        throw new Error('Player does not exist.');
      }

      player.setMove(move);

      if (game.isGameReady()) {
        game.startGame();
      }
    }
  }

  /**
   * Returns a Game with the given ID
   * @param {string} id - The ID of the Game.
   * @throws {Error} If the game doesn't exist.
   * @returns {Game} The Game object
   */
  getGame(id: string): Game {
    if (this.gameExist(id)) {
      return this.games[id];
    }
  }

  /**
   * Checks if a Game with a given ID exists.
   * @param {string} id - The ID of the Game.
   * @throws {Error} If the game doesn't exist.
   * @returns {boolean} true if it exists, otherwise it throws an error
   */
  gameExist(id: string): boolean {
    if (Object.prototype.hasOwnProperty.call(this.games, id)) {
      return true;
    }

    throw new Error('Game could not be found.');
  }
}

export default GameHandler;
