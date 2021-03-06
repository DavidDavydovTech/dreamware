import { Container } from 'pixi.js';
import MiniGameInstance from './MiniGameInstance';
// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';

export interface MiniGameOptions {
  minigameDuration?: number | Array<number | undefined>;
  timeoutDelay?: number | Array<number | undefined>;
  loseOnTimeout?: boolean;

  maxDifficulty?: number;

  autoIncrementDifficulty?: boolean;
  textureArray?: [];
  preloadTextures?: boolean;
  preloadSprites?: boolean;
}

/** @description A constructor that can be used to get minigame instantiations.*/
export class MiniGame extends Container {
  private _init: () => Promise<void> | Array<() => Promise<void> | undefined>;
  private _update: (deltaTime: number) => Promise<void> | Array<(deltaTime: number) => Promise<void> | undefined>;
  private _minigameDuration: number | Array<number | undefined>;
  private _timeoutDelay: number | Array<number | undefined>;
  public loseOnTimeout: boolean;
  public maxDifficulty: number;
  public difficulty = 1;
  public autoIncrementDifficulty: boolean;

  constructor(
    init: () => Promise<void> | Array<() => Promise<void> | undefined>,
    update: (deltaTime: number) => Promise<void> | Array<(deltaTime: number) => Promise<void> | undefined>,
    {
      minigameDuration = 5000,
      timeoutDelay = 50,
      loseOnTimeout = true,
      maxDifficulty = 3,
      autoIncrementDifficulty = true,
    }: MiniGameOptions = {}
  ) {
    super();
    // Assign parameters to private properties of the same name.
    this._init = init;
    this._update = update;
    this._minigameDuration = minigameDuration;
    this._timeoutDelay = timeoutDelay;
    // Assign parameters to properties of the same name.
    this.loseOnTimeout = loseOnTimeout;
    this.maxDifficulty = maxDifficulty;
    this.autoIncrementDifficulty = autoIncrementDifficulty;
  }

  _findValidValue = <T>(arr: Array<T | undefined>, propertyName: string): T => {
    const targetValue = arr[this.difficulty];
    if (targetValue !== undefined) {
      return targetValue;
    } else {
      for (let i = 0; i < arr.length; ++i) {
        const currentValue = arr[i];
        if (currentValue !== undefined) {
          return currentValue;
        }
      }
      throw new Error(`Tried to get a value for property ${propertyName} but every value is undefined!`);
    }
  };

  get init(): () => Promise<void> {
    const init = this._init;
    return Array.isArray(init) ? this._findValidValue(init, 'init') : init;
  }

  get update(): () => Promise<void> {
    const update = this._update;
    return Array.isArray(update) ? this._findValidValue(update, 'update') : update;
  }

  get minigameDuration(): number {
    const minigameDuration = this._minigameDuration;
    return Array.isArray(minigameDuration)
      ? this._findValidValue(minigameDuration, 'minigameDuration')
      : minigameDuration;
  }

  get timeoutDelay(): number {
    const timeoutDelay = this._timeoutDelay;
    return Array.isArray(timeoutDelay) ? this._findValidValue(timeoutDelay, 'timeoutDelay') : timeoutDelay;
  }

  get instance(): MiniGameInstance {
    const options = {
      minigameDuration: this.minigameDuration,
      timeoutDelay: this.timeoutDelay,
      loseOnTimeout: this.loseOnTimeout,
      difficulty: this.difficulty,
    };
    if (this.autoIncrementDifficulty) this.incrementDiffuclty();
    return new MiniGameInstance(this.init, this.update, options);
  }

  incrementDiffuclty = (): number => {
    this.difficulty = ++this.difficulty % this.maxDifficulty;
    return this.difficulty;
  };
}

// export class MiniGameInstance extends Container {};

export default MiniGame;
