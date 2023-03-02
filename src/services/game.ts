import { v4 as uuidv4 } from 'uuid';
import Player from './player';
import Moves from '../utils/moves';

class Game {
  id: string;
  state = 'Waiting for player to join.';
  players: Player[] = [];

  constructor(id: string = uuidv4()) {
    this.id = id;
  }

  /**
   *
   * @param {Player} player - The player to add to the game.
   * @throws {Error} Throws an error if the game is already full or if the player's name already exists.
   * @returns {void}
   */
  addPlayer(player: Player): void {
    if (this.isGameFull()) {
      throw new Error('The game is already full.');
    }

    if (this.getPlayer(player.name)) {
      throw new Error('The name already exists.');
    }

    this.players.push(player);

    if (this.isGameFull()) {
      this.state = 'Waiting for players to pick a move.';
    }
  }

  /**
   * Returns the Player object with the given name.
   * @param {string} name - The name of the player to find.
   * @returns {Player|undefined} The Player object with the given name or undefined if not found.
   */
  getPlayer(name: string): Player | undefined {
    return this.players.find((player) => {
      return player.name === name;
    });
  }

  /**
   * Returns true if the game is full (i.e., has two players), otherwise returns false.
   * @returns {boolean} Whether the game is full or not.
   */
  isGameFull(): boolean {
    return this.players.length >= 2;
  }

  /**
   * Returns true if the game is ready to start (all players has a move selected).
   * @returns {boolean} Whether the game is ready to start or not.
   */
  isGameReady(): boolean {
    if (this.isGameFull()) {
      return this.players.every((player) => player.getMove() != null);
    }

    return false;
  }

  /**
   * Check if the provided move is valid or not.
   * @param {Moves} move - The move to check.
   * @returns {boolean} - True if the move is valid, false otherwise.
   * @throws {Error} - If the move is not valid.
   */
  isValidMove(move: Moves): boolean {
    const isIncluded = [Moves.Rock, Moves.Paper, Moves.Scissors].includes(move);

    if (!isIncluded) {
      throw new Error(`Invalid move '${move}'.`);
    }

    return isIncluded;
  }

  /**
   * Starts the game by determining the winner based on each player's move.
   * @returns {void}
   */
  startGame(): void {
    const winsTo = {
      scissors: Moves.Rock,
      rock: Moves.Paper,
      paper: Moves.Scissors
    };

    const [playerOne, playerTwo] = this.players;

    if (playerOne.getMove() == winsTo[playerTwo.getMove()]) {
      playerOne.state = `Winner with ${playerOne.getMove()}`;
      playerTwo.state = `Loser with ${playerTwo.getMove()}`;
    } else if (playerTwo.getMove() == winsTo[playerOne.getMove()]) {
      playerOne.state = `Loser with ${playerOne.getMove()}`;
      playerTwo.state = `Winner with ${playerTwo.getMove()}`;
    } else {
      playerOne.state = 'Draw';
      playerTwo.state = 'Draw';
    }

    this.state = 'Game is over.';
  }
}

export default Game;
