import App from '../../index';
import { Container, Ticker, Texture } from 'pixi.js';
import DoodleSprite from './DoodleSprite';

export interface MiniGameInstanceOptions {
  loseOnTimeout?: boolean;
  minigameDuration?: number;
  timeoutDelay?: number;
  difficulty?: number;
}

export class MiniGameInstance extends Container {
  // Properties with parameter equivalents.
  public init;
  public update;
  public loseOnTimeout;
  public timeoutDelay;
  public minigameDuration;
  public difficulty;
  // Result properties
  public result: Promise<boolean>;
  public resultResolver?: (didWin: boolean) => void;
  public resultRejector?: (error: Error) => void;
  // Additional properties
  public timeLeft: number;
  // Stores
  public textures: Record<string, Texture> = {};
  public sprites: Record<string, DoodleSprite> = {};
  public game: Record<string, any> = {};
  public interactiveData: { x: number; y: number } = { x: 400, y: 400 };

  constructor(
    init: () => Promise<void>,
    update: (deltaTime: number) => Promise<void>,
    { loseOnTimeout = true, timeoutDelay = 0, minigameDuration = 5000, difficulty = 1 }: MiniGameInstanceOptions = {}
  ) {
    super();
    // Make minigame interactive
    this.interactive = true;
    // Assign parameters to properties of the same name.
    this.init = init;
    this.update = update;
    this.loseOnTimeout = loseOnTimeout;
    this.timeoutDelay = timeoutDelay;
    this.minigameDuration = minigameDuration;
    this.difficulty = difficulty;
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
    // Set up other essentual properties
    this.timeLeft = minigameDuration;
    // Set up interactivity
    this.on('pointermove', (val: any) => {
      this.interactiveData.x = val.data.global.x / App.stage.scale.x;
      this.interactiveData.y = val.data.global.y / App.stage.scale.y;
    });
    // Start initalizing the minigame.
    this._init();
  }

  _init = async (): Promise<void> => {
    await this.init.call(this);
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
  _tick = async (deltaTime: number): Promise<void> => {
    this._update(deltaTime);
  };

  /** @description Runs this.update along with custom minigame logic. */
  _update = async (deltaTime: number): Promise<void> => {
    await this.update.call(this, deltaTime);
    return;
  };
}

export default MiniGameInstance;
