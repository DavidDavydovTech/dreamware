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

    this.sprites = {
      hearts: [],
      character: {
        body: undefined,
        face: {
          default: undefined,
          squirm: undefined,
          wake: undefined,
        }
      }
    };

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
    // Hearts
    this._initCharacter();
  }

  _initCharacter = () => {
    const { _appReference: app, character } = this;
    switch(character) {
      case 'clingy': {
        const { 
          clingyA, 
          clingyB,
          clingyFaceA,
          clingyFaceB,
          clingyFaceAngA,
          clingyFaceAngB,
          clingyFaceAngC,
          clingyFaceAngD,
        } = app.loader.resources;
        // Clingy Body
        const clingyBody = new DoodleSprite({
          texture: [clingyA.texture, clingyB.texture],
          app,
          timeMod: this.timeMod
        });
        clingyBody.pivot.set( clingyBody.width / 2, clingyBody.height)
        clingyBody.x = 400;
        clingyBody.y = 750;
        this.addChild(clingyBody);
        this.sprites.character.body = clingyBody;
        // Clingy Sleep
        const clingySleep = new DoodleSprite({
          texture: [clingyFaceA.texture, clingyFaceB.texture],
          app,
          timeMod: this.timeMod
        });
        clingySleep.pivot.set( clingySleep.width / 2, clingySleep.height / 2);
        clingySleep.x = 400;
        clingySleep.y = 600;
        this.addChild(clingySleep);
        this.sprites.character.face.default = clingySleep;
        // Clingy Sleep
        const clingySquirm = new DoodleSprite({
          texture: [clingyFaceAngA.texture, clingyFaceAngB.texture],
          app,
          timeMod: this.timeMod
        });
        clingySquirm.pivot.set( clingySleep.width / 2, clingySleep.height / 2);
        clingySquirm.x = 400;
        clingySquirm.y = 600;
        clingySquirm.alpha = 0;
        this.addChild(clingySquirm);
        this.sprites.character.face.squirm = clingySquirm;
        // Clingy Sleep
        const clingyWake = new DoodleSprite({
          texture: [clingyFaceAngC.texture, clingyFaceAngD.texture],
          app,
          timeMod: this.timeMod
        });
        clingyWake.pivot.set( clingySleep.width / 2, clingySleep.height / 2);
        clingyWake.x = 400;
        clingyWake.y = 600;
        clingyWake.alpha = 0;
        this.addChild(clingyWake);
        this.sprites.character.face.wake = clingyWake;
        break;
      }
    }
    

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
    // Hearts
    this._initHearts();
  }

  _initHearts = () => {
    for ( let i = 0; i < this.lives; i++ ) {
      this._addHeartSprite(i + 1);
    }
  }

  _addHeartSprite = (lives) => {
    const { _appReference: app } = this;
    const { heartA, heartB } = app.loader.resources;
    const heart = new DoodleSprite({
      texture: [heartA.texture, heartB.texture],
      app,
      timeMod: this.timeMod
    });
    heart.pivot.set( 0 , heart.height );
    heart.x = 650;
    heart.y = 700 - (lives - 1) * 150;
    this.addChild(heart);
    this.sprites.hearts.push(heart);
    return heart;
  }

  _init = () => {
    this._initGraphics();
    const { _appReference: app, timeMod, } = this;
    // new Promise( (resolve, reject) => {
    //   this.animateLevelNumberCycle({ resolve, number: 10, x: 400, y: 170});
    // })
    //   .then( () => {
    //     return new Promise ( ( resolve, reject ) => {
    //       this.animateZoomCycle({ resolve, zoomInMS: 1400, zoomInScale: 5, x: -1600, y: -450})
    //     })
    //   })
    //   .then( () => {
    //     this.animateZoomCycle({ zoomInMS: 1400, zoomInScale: 1, x: 0, y: 0})
    //   })
    this._tickerReference.add(this._ticker);
  }

  _ticker = () => {
    this.tickHUD(this);
  }

  animateLevelNumberCycle = ({ 
    number, 
    fadeInMS = 500, 
    fadeOutMS = 500, 
    displayMS = 2000, 
    x = 400, 
    y = 170
  }) => {
    return () => new Promise( resolve => {
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
    });
  }

  animateZoomCycle = ({ 
    zoomMS = 1000,
    zoomInScale = 2,
    x = 400, 
    y = 170
  }) => {
    return () => new Promise( ( resolve ) => {
      const { _appReference: app, timeMod } = this;
      // console.log(x);
      let animationMS = 0;
      const startX = this.x;
      const startY = this.y;
      const startScale = { ...this.scale };
      const animation = () => {
        const { deltaMS } = this;
        switch (true) {
          case animationMS <= zoomMS: {
            let animationProgress = ( animationMS / zoomMS );
            if (animationProgress > 1) animationProgress = 1;
            let zoomAmount = startScale._x + animationProgress * ( zoomInScale - startScale._x);
            this.scale.set( zoomAmount, zoomAmount );
            let currentX = startX + animationProgress * ( x - startX );
            let currentY = startY + animationProgress * ( y - startY );

            // console.log(this.x);
            this.x = currentX;
            this.y = currentY;
            break;
          }
          default: {
            this.scale.set( zoomInScale, zoomInScale );
            this.x = x;

            // console.log(this.x);
            this.y = y;
            resolve( animationMS - zoomMS );
            app.ticker.remove(animation);
          }
        }
        animationMS += deltaMS;
      }
      app.ticker.add(animation);
    });
  }

  animateAddLife = ({ duration = 360 * 6, blinkMS = 360 } = {}) => {
    return () => new Promise( resolve => {
      const heart = this._addHeartSprite(this.lives);
      heart.alpha = 0;
      let animationMS = 0;
      let animationBlink = 0;
      const animation = () => {
        const { deltaMS } = this;
        if (animationBlink > blinkMS) {
          animationBlink -= blinkMS;
          heart.alpha = heart.alpha === 0 ? 1 : 0;
        }
        if (animationMS > duration) {
          heart.alpha = 1;
          resolve( animationMS - duration );
          this._tickerReference.remove(animation);
        }
        animationBlink += deltaMS;
        animationMS += deltaMS;
      }
      this._tickerReference.add(animation);
    });
  }

  animateRemoveLife = ({ duration = 360 * 6, blinkMS = 360, heartBreakMS = 360 * 2.5, faceDelayMS = 500, } = {}) => {
    return () => new Promise( resolve => {
      this.sprites.character.face.default.alpha = 0;
      this.sprites.character.face.squirm.alpha = 1;
      let heartBreak;
      console.log(this.sprites.hearts)
      const heart = this.sprites.hearts.pop();
      console.log(this.sprites.hearts)
      heart.alpha = 0;
      let animationMS = 0;
      let animationBlink = 0;
      const animation = () => {
        const { deltaMS } = this;
        switch(true) {
          case animationMS + deltaMS <= duration: {
            if (animationBlink > blinkMS) {
              animationBlink -= blinkMS;
              heart.alpha = heart.alpha === 0 ? 1 : 0;
            }
            animationBlink += deltaMS;
            break;
          }
          case animationMS < duration + heartBreakMS: {
            heart.alpha = 0;
            if (!heartBreak) {
              const { _appReference: app } = this;
              const { heartC, heartD, heartE, heartF, heartG } = app.loader.resources;
              heartBreak = new DoodleSprite({
                texture: [ heartC.texture, heartD.texture, heartE.texture, heartF.texture, heartG.texture ],
                app: this._appReference,
                destroyOnLoop: true,
                swapMS: heartBreakMS / 5,
                timeMod: this.timeMod
              });
              heartBreak.pivot.set( 0 , heartBreak.height );
              heartBreak.x = 650;
              heartBreak.y = 700 - this.lives * 150;
              this.addChild(heartBreak);
            }
            break;
          }
          case animationMS < duration + heartBreakMS + faceDelayMS: {
            heartBreak.alpha = 0;
            break;
          }
          default: {
            heart.destroy();
            if (this.lives > 0) {
              this.sprites.character.face.default.alpha = 1;
              this.sprites.character.face.squirm.alpha = 0;
            } else {
              this.sprites.character.face.squirm.alpha = 0;
              this.sprites.character.face.wake.alpha = 1;
            }
            // console.log('RESOLVED')
            resolve( animationMS - duration );
            this._tickerReference.remove(animation);
          }
        }
        animationMS += deltaMS;
      }
      this._tickerReference.add(animation);
    });
  }

  animateDelay = ({ duration = 250 }) => {
    let animationMS = 0;
    return function (resolve) {
        const { deltaMS } = this;
        if (animationMS > duration) {
          resolve( animationMS - duration );
          this._tickerReference.remove(animation);
          // console.log(`Finished in ${animationMS} milliseconds!`);
        }
        animationMS += deltaMS;
    }
  }

  addLife = () => {
    if (this.lives + 1 <= this.livesMax) {
      this.lives += 1;
      return this.animateAddLife();
    }
  }

  removeLife = () => {
    this.lives -= 1;
    return this.animateRemoveLife();
  }

  zoomIn = ({ zoomInMS = 2500 } = {}) => {
    return this.animateZoomCycle({ zoomMS: zoomInMS, zoomInScale: 5, x: -320 * 5, y: -80 * 5 })
  }

  zoomOut = ({ zoomOutMS = 2500 } = {}) => {
    return this.animateZoomCycle({ zoomMS: zoomOutMS, zoomInScale: 1, x: 0, y: 0 })
  }

  levelNumber = (number, options) => {
    return this.animateLevelNumberCycle({ number, ...options })
  }

  tickHUD = () => {
    this.deltaMS = this._tickerReference.elapsedMS * this.timeMod;
    this.totalMS += this.deltaMS;
    this.renderHUD();
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