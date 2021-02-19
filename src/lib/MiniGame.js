import { Container } from 'pixi.js';
import * as PixiSound from 'pixi-sound';
const sound = PixiSound.default.sound;
// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';

class MiniGame extends Container {
    /**
   * Constructor for GameHUDNumbers
   * @param {object} props - The main props for the HUD
   * @param {import('pixi.js').Application} props.app - A refrence to the main app, required.
   * @param {integer} props.timeMod - How much faster/slower the minigame should play (twice as fast = a timeMod of 2).
   * @param {function} props.update - The function to use when updating the minigame every frame.
   * @param {number} props.init - The function to run when initalizing the game.
   * @param {number} props.maxMS - The maximum amount of time allowed to finish the minigame.
   * @param {number} props.difficulty - A arbitrary way of delegating the minigame's difficulty.
  */
  constructor({ 
    app,
    timeMod = 1, 
    update,
    init = () => { 
      console.warn('No init provided to MiniGame') 
    },
    maxMS = 5000,
    difficulty = 1,
    winOnTimeout = false,
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

    this._appReference = app;
    this._tickerReference = app.ticker;
    // This is just our update/render function, HOWEVER render is 
    // already taken by the Container class, so we're using the name
    // "renderMG" instead!
    this.renderMG = update;
    this._destroy = this.destroy;
    this.destroy = (options) => {
      this._tickerReference.remove(this._ticker);
      this._destroy(options);
    };
    this.init = init;

    this.winOnTimeout = winOnTimeout;
    this.timeoutDelayMS = 1000;
    this.difficulty = difficulty;


    this.timeMod = timeMod;
    this.maxMS = maxMS;
    this.deltaMS = 0;
    this.totalMS = 0;
    
    this._didWinPromse;
    this.didWin = new Promise( (resolve, reject) => {
      // These are the actual declarations of winMG and failMG
      this._didWinResolver = resolve;
      this.failMG = () => { resolve(false); };
      this.winMG = () => { resolve(true); };
    });

    this._init();
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
    this.deltaMS = this._tickerReference.elapsedMS * this.timeMod;
    this.totalMS += this.deltaMS;
    if ( this.maxMS < this.totalMS && this.maxMS !== 0 ) {
      const didWin = this.didWin;
      
      if ( typeof didWin !== 'boolean') {
        if ( !this.winOnTimeout ) {
          this.failMG();
        } else {
          this.winMG();
        }
      } 
      
      if (this.timeoutDelayMS <= 0) {
        return;
      }else {
        this.timeoutDelayMS -= this.deltaMS;
      }
    }
    this.renderMG.call(this);
  }

  renderMG = () => {
    console.error(`WARNING renderMG DIDN'T RENDER. KILLING GAME EARLY.`)
    this.failMG();
  }
}

export default MiniGame;