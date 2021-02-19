import DoodleSprite from '../lib/DoodleSprite';

export const GetIceSkateFuncs = () => {
  // Load textures in the array
  const texturesArray = [
  'iceBgA',
  'iceBgB',
  'iceScreenA',
  'iceScreenB',
  'iceFigure8A',
  'iceCircleA',
  'iceSquareA',
  'iceTriangleA',
  'iceWinA',
  'iceWinB',
  'iceLossA',
  'iceLossB',
  'icePlayerA',
  'icePlayerB'
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
    
    // iceBg
    sprites.iceBg.alpha = 1;
    sprites.iceBg.x = 0;
    sprites.iceBg.y = 300;
    this.addChild(sprites.iceBg);
    // iceScreen
    sprites.iceScreen.alpha = 1;
    sprites.iceScreen.x = (800 / 2) - (sprites.iceScreen.width / 2);
    sprites.iceScreen.y = 60;
    this.addChild(sprites.iceScreen);
    // iceFigure8 (hidden)
    sprites.iceFigure8.alpha = 0;
    sprites.iceFigure8.x = (800 / 2) - (sprites.iceFigure8.width / 2);
    sprites.iceFigure8.y = 75;
    this.addChild(sprites.iceFigure8);
    // iceCircle (hidden)
    sprites.iceCircle.alpha = 0;
    sprites.iceCircle.x = (800 / 2) - (sprites.iceFigure8.width / 2) - 10;
    sprites.iceCircle.y = 80;
    this.addChild(sprites.iceCircle);
    // iceSquare (hidden)
    sprites.iceSquare.alpha = 0;
    sprites.iceSquare.x = (800 / 2) - (sprites.iceSquare.width / 2);
    sprites.iceSquare.y = 85;
    this.addChild(sprites.iceSquare);
    // iceTriangle (hidden)
    sprites.iceTriangle.alpha = 0;
    sprites.iceTriangle.x = (800 / 2) - (sprites.iceTriangle.width / 2);
    sprites.iceTriangle.y = 85;
    this.addChild(sprites.iceTriangle);
    // icePlayer (dynamic)
    sprites.icePlayer.x = 0;
    sprites.icePlayer.y = 0;
    sprites.icePlayer.pivot.set( sprites.icePlayer.width / 2, sprites.icePlayer.height - 12);
    this.addChild(sprites.icePlayer);
    // iceWin (hidden)
    sprites.iceWin.alpha = 0;
    sprites.iceWin.x = (800 / 2) - (sprites.iceWin.width / 2);
    sprites.iceWin.y = 10;
    this.addChild(sprites.iceWin);
    // iceLoss (hidden)
    sprites.iceLoss.alpha = 0;
    sprites.iceLoss.x = (800 / 2) - (sprites.iceLoss.width / 2) - 12;
    sprites.iceLoss.y = 60;
    this.addChild(sprites.iceLoss);
  };

  function update () {;
    const { icePlayer } = sprites;

    // Hold down to drag with slight mouse delay
    icePlayer.x = icePlayer.x + ( mousePosition.x - icePlayer.x );
    icePlayer.y = icePlayer.y + ( mousePosition.y - icePlayer.y );
  };
  return { init, update };
};

export default GetIceSkateFuncs;