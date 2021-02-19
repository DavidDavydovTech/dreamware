import DoodleSprite from '../lib/DoodleSprite';
import {Container} from 'pixi.js';

export const GetFlowersFuncs = () => {
  // Load textures in the array
  const texturesArray = [
  'flowerBasketsA',
  'flowerSoftFlowerA',
  'flowerSoftFlowerB',
  'flowerSpikeFlowerA',
  'flowerSpikeFlowerB',
  'flowerLossA',
  'flowerLossB',
  'flowerWinA',
  'flowerWinB',
  ];
  const textures = {};
  const populateTextures = (resources) => {
    for ( let texture of texturesArray) {
      if (resources.hasOwnProperty(texture)) {
        textures[texture] = resources[texture].texture;
      } else {
        throw new Error(`Tried to get ${texture} but it did not exist on the given resources.`)
      }
    }
  };
  // Sprite stuff
  const sprites = {};
  const populateSprites = (texturesObject, defaults) => {
    const groups = {};
    texturesArray.forEach( textureName => {
      let group = textureName;
      let lastLetter = group[group.length - 1];
      if ( lastLetter === lastLetter.toUpperCase() ) group = group.slice(0, textureName.length - 1);
      if ( groups.hasOwnProperty(group) === false) {
        groups[group] = [];
      }
      groups[group].push(textures[textureName]);
    })
    for ( let group in groups ) {
      sprites[group] = new DoodleSprite({ texture: groups[group], ...defaults });
    }
  }
  // Mouse
  let mousePosition = null;
  const populateMousePosition = ( app ) => {
    mousePosition = app.renderer.plugins.interaction.mouse.global;
  };

  const softFlowers = [];
  const spikeFlowers = [];
  let grabbing = false;

  function init () {    
    // Get the properties we need:
    const { _appReference, timeMod } = this;
    // MUST RUN or textures don't come through.
    populateTextures(_appReference.loader.resources);
    populateSprites(textures, { app: _appReference, timeMod });
    populateMousePosition( _appReference );

    // Sprites
    
    // flowerBasket
    sprites.flowerBaskets.x = (800 / 2) - (sprites.flowerBaskets.width / 2);
    sprites.flowerBaskets.y = 660;
    this.addChild(sprites.flowerBaskets);
    // flowerSoftFlower (dynamic) (needs class)
    // make flowers spawn at random times
    const numSoftFlowers = Math.floor(Math.random() * 5 + 1 + this.difficulty)
    for (let i = 0; i < numSoftFlowers; i++) {
      const newSoftFlower = new SoftFlower(new DoodleSprite({
        app: _appReference,
        timeMod,
        texture: [textures.flowerSoftFlowerA, textures.flowerSoftFlowerB]
      }));
      this.addChild(newSoftFlower);
    }
    // flowerSpikeFlower (dynamic) (needs class)
    // make flowers spawn at random times
    sprites.flowerSpikeFlower.x = 0;
    sprites.flowerSoftFlower.y = 0;
    // flowerLoss (hidden)
    sprites.flowerLoss.alpha = 0;
    sprites.flowerLoss.x = (800 / 2) - (sprites.flowerLoss.width / 2);
    sprites.flowerLoss.y = 20;
    this.addChild(sprites.flowerLoss);
    // flowerWin (hidden)
    sprites.flowerWin.alpha = 0;
    sprites.flowerWin.x = (800 / 2) - (sprites.flowerWin.width / 2);
    sprites.flowerWin.y = 180;
    this.addChild(sprites.flowerWin);
  };

  // copy and paste the same thing for SpikeFlower after setting up and fixing
  class SoftFlower extends Container{
    constructor (sprite) {
      super()
      this._spriteRef = sprite;
      this.deathMS = 500;
      this.addChild(sprite);
      softFlowers.push(this);
      this.index = softFlowers.length - 1;
      this.interactive = true;
      this.buttonMode = true;
      this.inBasket = false;
      this.on('pointerdown', this.onClick);
      this.on('pointerup', this.onRelease);
      this._init();
    }

    _init = () => {
      this.interactive = true;
      this.y = -100;
      this.x = Math.floor( Math.random() * ( 800 + this.width * 2) - this.width );
    }

    onClick = () => {
      grabbing = true;
    }
    onRelease = () => {
      grabbing = false;
    }

    update = (deltaMS) => {
      if ( this.deathMS <= 0 ) {
        // grabbing and moving is broken
        // also check if flower is not already in basket
        if (grabbing === true && this.inBasket === false) {
          this.x = this.x + ( mousePosition.x - this.x );
          this.y = this.y + ( mousePosition.y - this.y );
        }
        else {
          if (this.inBasket === false) {
            // change delta Y to fall
          }
        } 
      }
    }
  }

  let didEnd = false;

  function update () {;
    const { deltaMS } = this;

    softFlowers.forEach(e => e.update(deltaMS));
    //update spikeFlowers too
    let deathMS;
    // check if all the flowers are in the right baskets
    if ( this.totalMS >= this.maxMS - 100 ) {
      if ( didEnd === false ) { 
        this.maxMS = this.maxMS + 2000
        console.log('lost!')
        softFlowers.forEach( e => e.alpha = 0 );
        //spikeFlowers alpha 0
        sprites.flowerBaskets.alpha = 0;
        sprites.flowerLoss.alpha = 1;
        didEnd = true;
      }
    } else if ( this.didWin === true || deathMS <= 0) {
      if ( didEnd === false ) {
        didEnd = true;
        this.winOnTimeout = true;
        console.log('won!')
        softFlowers.forEach( e => e.alpha = 0 );
        //spikeFlowers alpha 0
        sprites.flowerBaskets.alpha = 0;
        sprites.flowerWin.alpha = 1;
      }
    }
  };
  return { init, update };
};

export default GetFlowersFuncs;