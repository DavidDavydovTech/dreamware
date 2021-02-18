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

    this._appReference = app;
    this._tickerReference = app.ticker;
    this._dispose = this.dispose;

    this.timeMod = timeMod;
    this.timeModMeterMax = timeModMeterMax;
    this.deltaMS = 0;
    this.totalMS = 0;
    
    this.lives = lives;
    this.livesMax = livesMax;
    this.character = character;

    this._init();
  }

  _initGraphics = () => {
    const { _appReference: app } = this;
    const { cloudA, cloudB } = app.loader.resources;
    const cloud = new DoodleSprite({
      texture: [cloudA.texture, cloudB.texture],
      app,
      timeMod: this.timeMod
    });
    cloud.pivot.set( cloud.width/2, cloud.height/2 );
    cloud.x = 400;
    cloud.y = 200;
    cloud.scale.set(0.5, 0.5)
    this.addChild(cloud);

    const { boxA, boxB } = app.loader.resources;
    const box = new DoodleSprite({
      texture: [boxA.texture, boxB.texture],
      app,
      timeMod: this.timeMod
    });
    box.x = 400
    box.y = 775
    box.pivot.set( box.width / 2 , box.height )
    this.addChild(box);
  }
  _init = () => {
    this._initGraphics();
    const { _appReference: app, timeMod, } = this;
    new Promise( (resolve, reject) => {
      this.animateLevelNumberCycle({ resolve, number: 10, x: 400, y: 170});
    })
      .then( () => {
        return new Promise ( ( resolve, reject ) => {
          this.animateZoomCycle({ resolve, zoomInMS: 1400, zoomInScale: 5, x: -1600, y: -450})
        })
      })
      .then( () => {
        this.animateZoomCycle({ zoomInMS: 1400, zoomInScale: 1, x: 0, y: 0})
      })
    this._tickerReference.add(this._ticker);
  }

  _ticker = () => {
    this.tickHUD(this);
  }

  animateLevelNumberCycle = ({ 
    resolve = () => { 
      console.warn(new Error('Warning no resolve function given.'));
    }, 
    number, 
    fadeInMS = 500, 
    fadeOutMS = 500, 
    displayMS = 2000, 
    x, 
    y
  }) => {
    const { _appReference: app, timeMod } = this;
    const levelNumber = new GameHUDNumbers({ app, timeMod, number});
    levelNumber.alpha = 0;
    levelNumber.pivot.x = levelNumber.width / 2;
    levelNumber.pivot.y = levelNumber.height / 2;
    levelNumber.x = x;
    levelNumber.y = y;
    this.addChild(levelNumber);

    let animationMS = 0;
    const animation = () => {
      const { deltaMS } = this;
      switch (true) {
        case animationMS <= fadeInMS: {
          const alpha = animationMS / fadeInMS;
          levelNumber.alpha = alpha > 1 ? 1 : alpha;
          break;
        }
        case animationMS <= fadeInMS + displayMS: {
          levelNumber.alpha = 1;
          break;
        }
        case animationMS <= fadeInMS + displayMS + fadeOutMS: {
          const alpha = 1 - ( animationMS - fadeInMS - displayMS ) / fadeOutMS;
          levelNumber.alpha = alpha < 0 ? 0 : alpha;
          break;
        }
        default: {
          levelNumber.alpha = 0;
          resolve( animationMS - fadeInMS - displayMS - fadeOutMS );
          app.ticker.remove(animation);
        }
      }
      animationMS += deltaMS;
    }
    app.ticker.add(animation);
  }

  animateZoomCycle = ({ 
    resolve = () => { 
      console.warn(new Error('Warning no resolve function given.'));
    },
    zoomInMS = 1000,
    zoomInScale = 2,
    x, 
    y
  }) => {
    const { _appReference: app, timeMod } = this;

    let animationMS = 0;
    const startX = this.x;
    const startY = this.y;
    const startScale = { ...this.scale };
    console.log(startScale);
    const animation = () => {
      const { deltaMS } = this;
      switch (true) {
        case animationMS <= zoomInMS: {
          let animationProgress = ( animationMS / zoomInMS );
          if (animationProgress > 1) animationProgress = 1;
          let zoomAmount = startScale._x + animationProgress * ( zoomInScale - startScale._x);
          this.scale.set( zoomAmount, zoomAmount );
          let currentX = startX + animationProgress * ( x - startX );
          let currentY = startY + animationProgress * ( y - startY );
          console.log('animationProgress', animationProgress, 'zoomAmount', zoomAmount, 'currentX', currentX)
          this.x = currentX;
          this.y = currentY;
          break;
        }
        default: {
          this.scale.set( zoomInScale, zoomInScale );;
          this.x = x;
          this.y = y;
          resolve( animationMS - zoomInMS );
          app.ticker.remove(animation);
        }
      }
      animationMS += deltaMS;
    }
    app.ticker.add(animation);
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
    // console.log('rendered');
  }

  dispose = () => {
    this._dispose();
    this._tickerReference.remove(this._ticker);
  }
}

export default GameHUD;