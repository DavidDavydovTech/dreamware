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
        Ticker.shared.remove(this._tick);
        resolve(didWin);
      };
      this.resultRejector = (error: Error) => {
        Ticker.shared.remove(this._tick);
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

  /** @description The function that runs the update function for the
   * minigame. Used to remove itself by refrence on win or loss via
   * PIXI.JS's ticker system. */
  _tick = async (): Promise<void> => {
    this._update();
  };

  _update = async (): Promise<void> => {
    await this.update();
    return;
  };
}
