import { Sprite } from 'pixi.js';
// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';
// const sound = PixiSound.default.sound;

class DoodleSprite extends Sprite {
  constructor({ 
    // Either a array of textures or a single texture
    texture,
    textureOffset,
    // A refrence to the main app, required.
    app,
    // How much faster/slower the minigame should play (twice as fast = a timeMod of 2)
    timeMod = 1, 
    // The milliseconds to wait until the texture swaps to another variant
    swapMS = 500,
  }) {
    switch(true) {
      case !texture || ( Array.isArray(texture) &&  texture.length < 1): {
        throw new Error('Warning texture not supplied or empty.');
      }
      case !app: {
        throw new Error('Warning app not supplied.');
      }
      case !timeMod: {
        throw new Error('Warning timeMod not supplied.');
      }
      case !swapMS: {
        throw new Error('Warning update not supplied.');
      }
    }

    if (Array.isArray(texture) === false) {
      super(texture);
    } else {
      const original = super(texture[0]);
      console.log(original);

      this._appReference = app;
      this._tickerReference = app.ticker;
      // We need to keep a refrence to the original destroy method.
      this._destroy = this.destroy;
      // ...and replace it with a wrapper/thunk
      this.destroy = (options = {}) => {
        this._tickerReference.remove(this._ticker);
        this._destroy(options);
      }

      
      this.trueX = 0;
      this.trueY = 0;
      this.offset = textureOffset && textureOffset[0] ? textureOffset[0] : { x: 0, y: 0 };
      this.timeMod = timeMod;
      this.maxMS = swapMS;
      this.swapMS = 0;
      this.deltaMS = 0;
      this.totalMS = 0;

      this.textureArray = texture;
      this.textureOffset = textureOffset;
      this.textureOffsetActive = false;
      if ( Array.isArray(textureOffset) ) {
        this.textureOffsetActive = true;
      }
      this.textureIndex = 0;

      this.swapQueued = false;

      this._init();
    }
  }

  set y (val) {
    this.trueY = val;
    this.position.y = this.trueY + this.offset.y;
  }

  get y () {
    return this.trueY;
  }

  set x (val) {
    this.trueX = val;
    this.position.x = this.trueX + this.offset.x;
  }

  get x () {
    return this.trueX;
  }

  _init = () => {
    this._tickerReference.add(this._ticker);
  }

  _ticker = () => {
    this.tickMG(this);
  }

  tickMG = () => {
    this.deltaMS = this._tickerReference.elapsedMS * this.timeMod;
    this.swapMS += this.deltaMS;
    this.totalMS += this.deltaMS;
    this.renderSwap();
  }

  renderSwap = () => {
    if (this.swapMS > this.maxMS) {
      this.swapMS -= this.maxMS;
      this.textureIndex += 1;
      this.swapQueued = true;
    }

    if (this.swapQueued === true) {
      const currentIndex = this.textureIndex % this.textureArray.length;
      this.texture = this.textureArray[currentIndex];
      if (this.textureOffsetActive) {
        const offset = this.textureOffset[currentIndex];
        // console.log(this.y, this.trueY, this.trueY + offset.y ? offset.y : 0 )
        // This is bad code but its 11:42 so im passing it through anyay.
        this.offset = offset;
        this.y = this.y;
        this.x = this.x;
      }
      this.swapQueued = false;
    }
  }
}

export default DoodleSprite;