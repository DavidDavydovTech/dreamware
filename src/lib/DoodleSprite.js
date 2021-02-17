import { Sprite } from 'pixi.js';
// import * as PixiSound from 'pixi-sound';
// import Keyboard from './keyboard';
// const sound = PixiSound.default.sound;

class DoodleSprite extends Sprite {
  constructor({ 
    // Either a array of textures or a single texture
    texture,
    // A refrence to the main app, required.
    app,
    // How much faster/slower the minigame should play (twice as fast = a timeMod of 2)
    timeMod = 1, 
    // The milliseconds to wait until the texture swaps to another variant
    swapMS = 500,
  }) {
    switch(true) {
      case !texture: {
        throw new Error('Warning texture not supplied.');
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
      super(texture[0]);

      this._appRefrence = app;
      this._tickerReference = app.ticker;
      // We need to keep a refrence to the original destroy method.
      this._destroy = this.destroy;
      // ...and replace it with a wrapper/thunk
      this.destroy = (options = {}) => {
        this._tickerReference.remove(this._ticker);
        this._destroy(options);
      }

      this.timeMod = timeMod;
      this.maxMS = swapMS;
      this.swapMS = 0;
      this.deltaMS = 0;
      this.totalMS = 0;

      this.textureArray = texture;
      this.textureIndex = 0;

      this.swapQueued = false;

      this._init();
    }
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
      this.texture = this.textureArray[this.textureIndex % this.textureArray.length];
      this.swapQueued = false;
    }
  }
}

export default DoodleSprite;