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
    this._destroy = this.destroy;
    this.destroy = (options) => {
      this._tickerReference.remove(this._ticker);
      this._destroy(options);
    };

    this.timeMod = timeMod;

    this.HUDContainer = new GameHUD({ app: this._appReference, timeMod });
    this.addChild(this.HUDContainer);
    this.HUDContainer.animateLevelNumberCycle({ number: 1 });

    this.animation = new Promise( resolve => resolve(0));
    
    this.queAnimation( this.HUDContainer.animateRemoveLife(), { noDelay: true })
    this.queAnimation( this.HUDContainer.animateRemoveLife(), { noDelay: true })
    // this.queAnimation( this.HUDContainer.animateRemoveLife())
    // this.queAnimation( this.HUDContainer.animateLevelNumberCycle({ number: 2}))
    // this.queAnimation( this.HUDContainer.animateZoomCycle({ zoomInMS: 1000 }));
  }

  queAnimation = ( animation, { delayMS = 350, noDelay = false} = {} ) => {
    if ( this.animation instanceof Promise ) {
      if ( noDelay === true ) {
        this.animation
          .then( () => {
            
            return animation();
          } );
      } else {
        this.animation
          .then( animation )
          .then( this.HUDContainer.animateDelay({ duration: delayMS }) );
      }
    } else {  
      alert('Critial error, if you\'re the developer check the logs.');
      throw new Error('GameController.queAnimation: this.animation is no longer a Promise!')
    }
  }
}

export default GameController;