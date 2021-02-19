import DoodleSprite from '../lib/DoodleSprite';
import {Container} from 'pixi.js';

export const GetGhostShooterFuncs = () => {
  // Load textures in the array
  const texturesArray = [
  'ghostBgA',
  'ghostBgB',
  'ghostCrosshairA',
  'ghostCrosshairB',
  'ghostGhostA',
  'ghostGhostB',
  'ghostLossA',
  'ghostLossB',
  'ghostWinA',
  'ghostWinB',
  'ghostPapA',
  'ghostPapB'
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
  // Create Sprites from textures
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

  const ghosts = [];

  function init () {    
    // Get the properties we need:
    const { _appReference, timeMod } = this;
    // MUST RUN or textures don't come through.
    populateTextures(_appReference.loader.resources);
    populateSprites(textures, { app: _appReference, timeMod });
    populateMousePosition( _appReference );
    

    // Sprites
    sprites.ghostCrosshair.textureOffset = [{x : 0, y : 0}, {x : -4, y : -4}];
    sprites.ghostCrosshair.textureOffsetActive = true;
    // ghostBg
    sprites.ghostBg.x = 0;
    sprites.ghostBg.y = 0;
    this.addChild(sprites.ghostBg);
    // sprites.plugBg.x = 400;
    // sprites.plugBg.y = 800;
    // sprites.plugBg.pivot.set( sprites.plugBg.width / 2, sprites.plugBg.height );
    // this.addChild(sprites.plugBg);

    // ghostGhost
    const numGhosts = Math.floor(Math.random() * 3 + 1 + this.difficulty)
    console.log(textures);
    for (let i = 0; i < numGhosts; i++) {
      const newGhost = new GhostEnemy(new DoodleSprite({
        app: _appReference,
        timeMod,
        texture: [textures.ghostGhostA, textures.ghostGhostB]
      }));
      this.addChild(newGhost);
    }
    
    console.log(numGhosts);
    console.log(ghosts);
    // ghostCrosshair
    sprites.ghostCrosshair.x = 400;
    sprites.ghostCrosshair.y = 400;
    // need help adding texture offset <--
    sprites.ghostCrosshair.pivot.set( sprites.ghostCrosshair.width / 2, sprites.ghostCrosshair.height / 2 );
    this.addChild(sprites.ghostCrosshair);
    // sprites.plugSocket.x = Math.floor( Math.random() * ( 800 - sprites.plugSocket.width ) );
    // sprites.plugSocket.y = Math.floor( Math.random() * ( 800 - sprites.plugSocket.height ) );
    // this.addChild(sprites.plugSocket);
    // plugArmDark
    // sprites.plugArmDark.x = 400;
    // sprites.plugArmDark.y = 400;
    // sprites.plugArmDark.pivot.set( sprites.plugArmDark.width / 2, sprites.plugArmDark.height / 8 );
    // this.addChild(sprites.plugArmDark);
    console.log(this);
  };

  class GhostEnemy extends Container{
    constructor (sprite) {
      super()
      this.yOriginal = 0;
      this.ySeed = Math.floor( Math.random() * 30 + 20);
      this.directionX = 1;
      this.directionY = 1;
      this.speedX = Math.floor( Math.random() * 1000 + 1150) + 2;
      this.speedY = Math.floor( Math.random() * 250 + 750) + 2;
      this.addChild(sprite);
      ghosts.push(this);
      this._init();
    }
    _init = () => {
      this.interactive = true;
      this.y = Math.floor( Math.random() * ( 800 - this.height ) );
      this.yOriginal = this.y;
      this.x = Math.floor( Math.random() * ( 800 + this.width * 2) - this.width );
    }
    update = (deltaMS) => {
      const ghostDeltaY = (deltaMS / this.speedY) * 100;
      const ghostDeltaX = (deltaMS / this.speedX) * 800;
      this.y += this.directionY * ghostDeltaY;
      this.x += this.directionX * ghostDeltaX;
      if (this.x > 800 + this.width) { this.directionX = -1; }
      else if (this.x < -this.width) { this.directionX = 1; }
      if (this.y > this.yOriginal + this.ySeed) { this.directionY = -1; }
      else if (this.y < this.yOriginal - this.ySeed) { this.directionY = 1; }
    }
  }
  function update () {;
    const { ghostCrosshair } = sprites;
    const { deltaMS } = this;

    ghosts.forEach(e => e.update(deltaMS));
    ghostCrosshair.x = ghostCrosshair.x + ( mousePosition.x - ghostCrosshair.x ) + 6;
    ghostCrosshair.y = ghostCrosshair.y + ( mousePosition.y - ghostCrosshair.y );
    // if ( plugArmDark.y < plugArmDark.height / 8 + 50 ) plugArmDark.y = plugArmDark.height / 8 + 50;

    // if (
    //   Math.abs(plugArmDark.x - plugSocket.x) <= 50 
    //   && Math.abs(plugArmDark.y - plugSocket.y) <= 50 
    //   && Math.abs(mousePosition.x - plugSocket.x) <= 50 
    //   && Math.abs(mousePosition.y - plugSocket.y) <= 50 
    // ) {
    //   this.winMG();
    //   return; 
    // }
  };
  return { init, update };
};

export default GetGhostShooterFuncs;