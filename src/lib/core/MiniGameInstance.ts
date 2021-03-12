import { Container, Ticker } from 'pixi.js';

interface MiniGameInstanceOptions {
  loseOnTimeout?: boolean;
  minigameDuration?: number;
  timeoutDelay?: number;
}

export class MiniGameInstance extends Container {
  public init;
  public update;
  public loseOnTimeout;
  public timeoutDelay;
  public minigameDuration;

  public result: Promise<boolean>;
  public resultResolver: (didWin: boolean) => void;
  public resultRejector: (error: Error) => void;

  public initTime: number;

  constructor(
    init: () => Promise<void>,
    update: () => Promise<void>,
    { loseOnTimeout = true, timeoutDelay = 0, minigameDuration = 5000 }: MiniGameInstanceOptions = {}
  ) {
    super();
    // Assign parameters to properties of the same name.
    this.init = init;
    this.update = update;
    this.loseOnTimeout = loseOnTimeout;
    this.timeoutDelay = timeoutDelay;
    this.minigameDuration = minigameDuration;
    // Set up the result property/resolver
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
    await this.init().call(this);
    Ticker.shared.add(this._tick);
  };

  /** @description Removes this class's this._tick method from the
   * shared ticker. */
  _removeTick = (): void => {
    Ticker.shared.remove(this._tick);
  };

  /** @description The wrapper function that runs the update method for
   * the minigame. Required so that we have a refrence to remove from
   * the shared ticker via PIXI.JS's ticker system. */
  _tick = async (): Promise<void> => {
    this._update();
  };

  /** @description Runs this.update along with custom minigame logic. */
  _update = async (): Promise<void> => {
    await this.update().call(this);
    return;
  };
}