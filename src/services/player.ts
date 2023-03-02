class Player {
  private move: string = null;
  state: string = null;
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Sets the move for the player.
   * @param {string} move - The move to set.
   * @throws {Error} Unable to set move if the move has already been set.
   * @returns {void}
   */
  setMove(move: string): void {
    if (this.move !== null) {
      throw new Error(
        `Unable to set move to ${move}, move has already been set.`
      );
    }

    this.move = move;
  }

  getMove(): string {
    return this.move;
  }

  /**
   * Returns a JSON representation of the Player instance.
   * Removes the 'move' property from the returned object.
   * @returns {Object} - The JSON representation of the Player instance.
   */
  toJSON(): object {
    const copy = Object.assign({}, this);
    delete copy.move;
    return copy;
  }
}

export default Player;
