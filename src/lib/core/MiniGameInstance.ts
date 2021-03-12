import { Container, Ticker } from 'pixi.js';

export class MiniGameInstance extends Container {
  public init;
  public update;
  public result: Promise<boolean>;
  public resultResolver: (didWin: boolean) => void;
  public resultRejector: (error: Error) => void;
  public initTime: number;

  constructor(init: () => Promise<void>, update: () => Promise<void>) {
    super();
    this.init = init;
    this.update = update;
    this.result = new Promise((resolve, reject) => {
      this.resultResolver = (didWin: boolean) => {
        this._removeTick();
        resolve(didWin);
      };
      this.resultRejector = (error: Error) => {
        this._removeTick();
        reject(error);
      };
    });
    // Start initalizing the minigame.
    this._init();
  }

  _init = async (): Promise<void> => {
    await this.init();
    Ticker.shared.add(this._tick);
  };

  /** @description Removes the class's _tick method from the shared
   * ticker.
   */
  _removeTick = (): void => {
    Ticker.shared.remove(this._tick);
  };

  /** @description The wrapper function that runs the update method for
   * the minigame. Required so that we have a refrence to remove from
   * the shared ticker via PIXI.JS's ticker system.
   */
  _tick = async (): Promise<void> => {
    this._update();
  };

  _update = async (): Promise<void> => {
    await this.update().call(this);
    return;
  };
}
