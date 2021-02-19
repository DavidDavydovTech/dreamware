import { Container } from 'pixi.js';
import GameHUD from './GameHUD';
// import Animation from './Animation';
// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';
// const sound = PixiSound.default.sound;
class Animation {
  constructor(animationFunc, context, props) {
    this.animationFunc = animationFunc;
    this.context = context;
    this.props = props
  }

  then(resolve, reject) {
    this.animationFunc.call(this.context, { resolve, ...this.props });
  }
  
}

const AnimationFactory = (props) => {
  const animation = ({ resolve, duration = 1000, message = 'hi' }) => {
    console.log(message)
    setTimeout(() => resolve(message), duration);
  };

  return () => {
    return new Animation(animation, this, {});
  }
}


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

    // Animation que;
    this._animationQue = [];
    this._animationRunning = false;
    this._tickerReference.add(this._runAnimationQue);

    this.queAnimation(this.HUDContainer.removeLife())
    this.queAnimation(this.HUDContainer.levelNumber(1))
    this.queAnimation(this.HUDContainer.zoomIn())
    this.queAnimation(this.HUDContainer.zoomOut())
    this.queAnimation(this.HUDContainer.levelNumber(2))
    this.queAnimation(this.HUDContainer.addLife())
  }

  _init = () => {
    this._tickerReference.add(this._runAnimationQue);
  }

  _runBetweenAnimations = () => {
    
  }

  _runAnimationQue = async () => {
    if ( this._animationQue.length > 0 && this._animationRunning === false ) {
      this._animationRunning = true;
      console.log(this._animationQue);
      const animation = this._animationQue.shift();
      await animation();
      this._runBetweenAnimations();
      this._animationRunning = false;
      console.log( this._animationQue, this._animationQue.length, this._animationRunning === false );
    }
  }

  queAnimation = (animation, { delay = true, delayMS = 250 } = {}) => {
    if (delay === true) {
      this._animationQue.push(animation);
    } else {
      this._animationQue.push(animation);
    }
  }

  delayAnimation = ( delay ) => {
    return;
  }

}

export default GameController;