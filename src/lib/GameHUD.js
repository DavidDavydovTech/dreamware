import { Container } from 'pixi.js';
import DoodleSprite from './DoodleSprite';
import GameHUDNumbers from './GameHUDNumbers';

// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';
// const sound = PixiSound.default.sound;

/** Class that renders the HUD */
class GameHUD extends Container {
  /**
   * Constructor for GameHUD
   * @param {object} props - The main props for the HUD
   * @param {import('pixi.js').Application} props.app - A refrence to the main app, required.
   * @param {integer} props.timeMod - How much faster/slower the minigame should play (twice as fast = a timeMod of 2).
   * @param {integer} props.timeModMeterMax - At what point the render of the timeMod meter should no longer 'grow' (does not effect the actual timeMod limit)
   * @param {integer} props.lives - Number of lives the player starts with
   * @param {string} props.character - Which character to use in the portrat
   */
  constructor({ 
    app,
    timeMod = 1,
    timeModMeterMax = 3,
    lives = 4,
    livesMax = 4,
    character = 'clingy'
  }) {
    super();

    switch(true) {
      case !app: {
        throw new Error('Warning app not supplied.');
      }
      case !timeMod: {
        throw new Error('Warning timeMod not supplied.');
      }
      case !timeModMeterMax: {
        throw new Error('Warning timeModMeterMax not supplied.');
      }
      case !lives: {
        throw new Error('Warning lives not supplied.');
      }
      case !livesMax: {
        throw new Error('Warning livesMax not supplied.');
      }
      case !character: {
        throw new Error('Warning character not supplied.');
      }
    }

    this._appRefrence = app;
    this._tickerReference = app.ticker;

    this.timeMod = timeMod;
    this.timeModMeterMax = timeModMeterMax;
    this.deltaMS = 0;
    this.totalMS = 0;

    
    this.lives = lives;
    this.livesMax = livesMax;
    this.character = character;

    this._init();
  }

  _init = () => {
    const { _appRefrence: app, timeMod, } = this;
    const test = new GameHUDNumbers({ app, timeMod, number: 42069});
    this.addChild( test );
    console.log(this.children[0])
    const resources = this._appRefrence.loader.resources;
    this._tickerReference.add(this._ticker);
  }

  _ticker = () => {
    this.tickHUD(this);
  }

  animateAddLife = () => {
    return new Promise( (resolve, reject) => {
      
    })
  }

  addLife = () => {
    if (this.lives + 1 <= this.livesMax) {
      this.lives += 1;
    }
  }

  removeLife = () => {
    if (this.lives - 1 > 0) {
      this.lives += 1;
    }
  }

  tickHUD = () => {
    this.deltaMS = this._tickerReference.elapsedMS * this.timeMod;
    this.totalMS += this.deltaMS;
    this.renderHUD()
  }

  renderHUD = () => {
    console.log('rendered');
  }

  dispose = () => {
    this._tickerReference.remove(this._ticker);
  }
}

export default GameHUD;