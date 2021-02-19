import DoodleSprite from '../lib/DoodleSprite';

export const GetPitJumperFuncs = () => {
  // Load textures in the array
  const texturesArray = [
  'jumpDeathPitA',
  'jumpDeathPitB',
  'jumpFloorA',
  'jumpFloorB',
  'jumpImpDeathA',
  'jumpImpDeathB',
  'jumpImpRunA',
  'jumpImpRunC',
  'jumpImpWin',
  'jumpImpWinB',
  'jumpMeanA',
  'jumpMeanB'
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

  function init () {    
    // Get the properties we need:
    const { _appReference, timeMod } = this;
    // MUST RUN or textures don't come through.
    populateTextures(_appReference.loader.resources);
    populateSprites(textures, { app: _appReference, timeMod });
    populateMousePosition( _appReference );

    // Sprites
    
    // jumpDeathPit (Dynamic)
    sprites.jumpDeathPit.x = 0;
    sprites.jumpDeathPit.y = 600;
    //sprites.typeClickmark.pivot.set( sprites.typeClickmark.width / 2, sprites.typeClickmark.height / 2);
    this.addChild(sprites.jumpDeathPit);
    // jumpFloor (Dynamic)
    sprites.jumpFloor.x = 0;
    sprites.jumpFloor.y = 600;
    //sprites.typeClickmark.pivot.set( sprites.typeClickmark.width / 2, sprites.typeClickmark.height / 2);
    this.addChild(sprites.jumpFloor);
    // jumpImpDeath (Dynamic)
    sprites.jumpImpDeath.x = 0;
    sprites.jumpImpDeath.y = 400;
    //sprites.typeClickmark.pivot.set( sprites.typeClickmark.width / 2, sprites.typeClickmark.height / 2);
    this.addChild(sprites.jumpImpDeath);
    // jumpImpRun (Dynamic)
    sprites.jumpImpRun.x = 0;
    sprites.jumpImpRun.y = 400;
    //sprites.typeClickmark.pivot.set( sprites.typeClickmark.width / 2, sprites.typeClickmark.height / 2);
    this.addChild(sprites.jumpImpRun);
    // jumpImpWin (Dynamic)
    sprites.jumpImpWin.x = 0;
    sprites.jumpImpWin.y = 400;
    //sprites.typeClickmark.pivot.set( sprites.typeClickmark.width / 2, sprites.typeClickmark.height / 2);
    this.addChild(sprites.jumpImpWin);
    // junpMean (Dynamic)
    sprites.jumpMean.x = 0;
    sprites.jumpMean.y = 400;
    //sprites.typeClickmark.pivot.set( sprites.typeClickmark.width / 2, sprites.typeClickmark.height / 2);
    this.addChild(sprites.jumpMean);
  };

  function update () {;
    //const { typeCursor } = sprites;
  };
  return { init, update };
};

export default GetPitJumperFuncs;