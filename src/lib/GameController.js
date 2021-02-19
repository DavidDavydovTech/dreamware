import { Container } from 'pixi.js';
import GameHUD from './GameHUD';
import MiniGame from './MiniGame';
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
    // Boss MiniGame
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

    // Internals
    this.MGArray = MGArray;
    this.MGBoss = MGBoss;
    this.gameCount = 0;
    this.prevLives = 4;
    this.lives = 4;
    this.timeMod = timeMod;
    this.didWin = true;

    this.HUDContainer = new GameHUD({ 
      app: this._appReference, 
      timeMod, 
      lives: this.lives,
    });
    this.addChild(this.HUDContainer);

    // Animation que;
    this._animationQue = [];
    this._animationRunning = false;
    this._tickerReference.add(this._runAnimationQue);


    this._animationQue.push(this.HUDContainer.animateDelay({}));
    this._gameLoop();
  }

  _gameLoop = async () => {
    const { 
      sfxBubbleIn, 
      sfxBubbleOut, 
      sfxBubbleOutSecret,
      bgmNextGame,
      bgmWinGame,
      bgmFailGame,
    } = this._appReference.loader.resources;

    this.gameCount++;
    this.queAnimation(this.HUDContainer.levelNumber(this.gameCount));
    this.queAnimation(this.HUDContainer.zoomIn({ 
      callback: () => {
        bgmNextGame.speed = this.timeMod;
        bgmNextGame.sound.play();
      }, 
      callbackEnd: () => {  
        sfxBubbleIn.sound.speed = this.timeMod;
        sfxBubbleIn.sound.play();
      }
    }));
    
    this.queAnimation(() => new Promise( resolve => {
      this._playMiniGame(resolve)
        .then( res => this.didWin = res );
    }))

    // this._playMiniGame();
    this.queAnimation(this.HUDContainer.zoomOut({ callback: () => {
      const sound = Math.round(Math.random() * 58913);
      if (sound === 58913) {
        sfxBubbleOutSecret.sound.speed = this.timeMod;
        sfxBubbleOutSecret.sound.play();
      } else {
        sfxBubbleOut.sound.speed = this.timeMod;
        sfxBubbleOut.sound.play();
      }
      console.log('did win in context', this.didWin)
      if (this.didWin) {
        bgmWinGame.sound.speed = this.timeMod;
        bgmWinGame.sound.play();
      } else {
        this.queAnimation(this.HUDContainer.removeLife(), { delay: false });
        bgmFailGame.sound.speed = this.timeMod;
        bgmFailGame.sound.play();
      }
      if (this.gameCount % 5 === 1 && this.gameCount !== 1) {
        // speed up sound
        // speed up animation
        this.updateTimeMod(this.timeMod += 0.3);
      }
    }, callbackEnd: () => { this.HUDContainer.cleanUpMGs() } }));

    this.queAnimation(() => new Promise (resolve => {
      if ( this.lives > 0) {
        resolve(this._gameLoop());
      }
    }));
  }

  _playMiniGame = async (resolver) => {
    const {init, update} = this.MGArray[ Math.floor( Math.random() * this.MGArray.length ) ]();
    this.minigame = new MiniGame({
      app: this._appReference,
      update,
      init,
      maxMS: 5,
    })
    this.HUDContainer.addChild(this.minigame);
    this.HUDContainer.minigames.push(this.minigame);
    const hudScale = {
      x: this.HUDContainer.scale.x,
      y: this.HUDContainer.scale.y,
    }
    // this.minigame.pivot.set( this.minigame.width / 2, this.minigame.height / 2);
    this.minigame.scale.set( 1 / hudScale.x, 1 / hudScale.y);
    this.minigame.x = 320;
    this.minigame.y = 80;
    this.minigame._minigameComplete
      .then(() => {
        return this.minigame.didWin;
      })
      .then( didWin => {
        this.didWin = didWin;
        resolver(didWin);
        resolve(didWin)
      })
    
    // this.queAnimation(() => this.minigame.didWin)
    // this.queAnimation(() => new Promise( resolve => {

    // }))
    // await readyForMG;


    // return this.minigame.didWin;
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

  updateTimeMod = (newVal) => {
    this.timeMod = newVal;
    this.HUDContainer.timeMod = newVal;
  }

  queAnimation = (animation, { delay = true, delayMS = 750 } = {}) => {
    if (delay === true) {
      this._animationQue.push(animation);
      this._animationQue.push(this.HUDContainer.animateDelay({ duration: delayMS }));
    } else {
      this._animationQue.push(animation);
    }
  }

  // delayAnimation = ( delay ) => {
  //   return () => new Promise( resolve => {
  //     setTimeout( () => {
  //       resolve();
  //     }, delay)
  //   });
  // }

}

export default GameController;