import { Container } from 'pixi.js';
import GameHUD from './GameHUD';
// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';
// const sound = PixiSound.default.sound;

class GameController extends Container {
  constructor({ 
    // A refrence to the main app, required.
    app,
    // How much faster/slower the minigame should play (twice as fast = a timeMod of 2)
    timeMod = 1, 
    // Array of minigames 
    MGArray,
    // Boss Minigame
    MGBoss,
  },) {
    super();

    switch(true) {
      case !app: {
        throw new Error('Warning app not supplied.');
      }
      case !timeMod: {
        throw new Error('Warning timeMod not supplied.');
      }
      case !MGArray: {
        throw new Error('Warning update not supplied.');
      }
      case !MGBoss: {
        throw new Error('Warning update not supplied.');
      }
    }

    this._appReference = app;
    this._tickerReference = app.ticker;
    // This is just our update/render function, HOWEVER render is 
    // already taken by the Container class, so we're using the name
    // "renderMG" instead!
    this._destroy = this.destroy;
    this.destroy = (options) => {
      this._tickerReference.remove(this._ticker);
      this._destroy(options);
    };

    this.timeMod = timeMod;

    this.HUDContainer = new GameHUD({ app: this._appReference, timeMod });
    this.addChild(this.HUDContainer);
  }

  _init = () => {
    this.init.call(this);
    this._tickerReference.add(this._ticker);
  }

  _ticker = () => {
    this.tickMG(this);
  }

  // Do not touch these. These are placeholders for Intelisense
  failMG = () => { console.error('The failMG method WAS NOT UPDATED; MINIGAME CAN NOT BE FAILED!'); }
  winMG = () => { console.error('The winMG method WAS NOT UPDATED; MINIGAME CAN NOT BE WON!'); }

  tickMG = () => {
    if ( this.maxMS < this.totalMS && this.maxMS !== 0 ) {
      this.failMG();
      return;
    }
    this.deltaMS = this._tickerReference.elapsedMS * this.timeMod;
    this.totalMS += this.deltaMS;
    this.renderMG.call(this);
  }

  renderMG = () => {
    console.error(`WARNING renderMG DIDN'T RENDER. KILLING GAME EARLY.`)
    this.failMG();
  }

  dispose = () => {
    let timeSinceDispose = 0;
    // console.log('Disposing minigame... MS since dispose:')
    // this.renderMG = () => {
    //   console.log( timeSinceDispose / ( 1 * this.timeMod) );
    //   timeSinceDispose += this._tickerReference.elapsedMS;
    // };
    this._tickerReference.remove(this._ticker);
  }
}

export default GameController;