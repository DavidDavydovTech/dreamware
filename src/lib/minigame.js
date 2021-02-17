import { Container } from 'pixi.js';
// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';
// const sound = PixiSound.default.sound;

class MiniGame extends Container {
  constructor({ 
    app, 
    timeMod = 1, 
    update, 
    init = () => { 
      console.warn('No init provided to MiniGame') 
    },
    maxMS = 5000,
  },) {
    super();

    switch(true) {
      case !app: {
        throw new Error('Warning app not supplied.');
      }
      case !timeMod: {
        throw new Error('Warning timeMod not supplied.');
      }
      case !update: {
        throw new Error('Warning update not supplied.');
      }
    }

    this._tickerReference = app.ticker;
    this.renderMG = update;
    this.init = init;

    this.timeMod = timeMod;
    this.maxMS = maxMS;
    this.deltaMS = 0;
    this.totalMS = 0;

    this.didWin = new Promise( (resolve, reject) => {
      this.failMG = () => { resolve(false); this.dispose(); };
      this.winMG = () => { resolve(true); this.dispose(); };
    });

    this._init();
  }

  _init = () => {
    this.init(this);
    this._tickerReference.add(this._ticker);
  }

  _ticker = () => {
    this.tickMG(this);
  }

  failMG = () => { console.error('The failMG method WAS NOT UPDATED; MINIGAME CAN NOT BE FAILED!'); }
  winMG = () => { console.error('The winMG method WAS NOT UPDATED; MINIGAME CAN NOT BE WON!'); }

  tickMG = () => {
    if ( this.maxMS < this.totalMS && this.maxMS !== 0 ) {
      this.dispose();
      return;
    }
    this.deltaMS = this._tickerReference.elapsedMS * this.timeMod;
    this.totalMS += this.deltaMS;
    this.renderMG(this);
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

export default MiniGame;