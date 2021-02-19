import DoodleSprite from '../lib/DoodleSprite';

export const GetTypingTestFuncs = () => {
  // Load textures in the array
  const texturesArray = [
  'typeArrowA',
  'typeArrowB',
  'typeClickmarkA',
  'typeCursorA',
  'typeCursorB',
  'typeHillA',
  'typeHillB',
  'typeQuestionA',
  'typeQuestionB',
  'typeSmileA',
  'typeSmileB',
  'typeTriangleA',
  'typeTriangleA',
  'typeTriangleB',
  'typeTriangleDownA',
  'typeTriangleDownB',
  'typeTriangleUpA',
  'typeTriangleUpB',
  'typeLossA',
  'typeLossB',
  'typeWinA',
  'typeWinB',
  'typeKeyboardA',
  'typeKeyboardB'
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
    
    // typeKeyboard
    sprites.typeKeyboard.x = 40;
    sprites.typeKeyboard.y = 200; 
    //sprites.plugBg.pivot.set( sprites.plugBg.width / 2, sprites.plugBg.height );
    this.addChild(sprites.typeKeyboard);
    // typeClickmark (hidden)
    sprites.typeClickmark.alpha = 0;
    sprites.typeClickmark.x = 100;
    sprites.typeClickmark.y = 100;
    sprites.typeClickmark.pivot.set( sprites.typeClickmark.width / 2, sprites.typeClickmark.height / 2);
    //this.addChild(sprites.typeClickmark);
    // typeCursor (dynamic)
    sprites.typeCursor.x = 0;
    sprites.typeCursor.y = 0;
    sprites.typeCursor.pivot.set( sprites.typeCursor.width / 2, sprites.typeCursor.height / 2);
    this.addChild(sprites.typeCursor);
    // typeArrow
    sprites.typeArrow.x = 180;
    sprites.typeArrow.y = 630;
    sprites.typeArrow.interactive = true;
    sprites.typeArrow.buttonMode = true;
    this.addChild(sprites.typeArrow);
    // typeHill
    sprites.typeHill.x = 120;
    sprites.typeHill.y = 465;
    sprites.typeHill.interactive = true;
    sprites.typeHill.buttonMode = true;
    this.addChild(sprites.typeHill);
    // typeQuestion
    sprites.typeQuestion.x = 300;
    sprites.typeQuestion.y = 460;
    sprites.typeQuestion.interactive = true;
    sprites.typeQuestion.buttonMode = true;
    this.addChild(sprites.typeQuestion);
    // typeSmile
    sprites.typeSmile.x = 365;
    sprites.typeSmile.y = 590;
    sprites.typeSmile.interactive = true;
    sprites.typeSmile.buttonMode = true;
    this.addChild(sprites.typeSmile);
    // typeTriangle
    sprites.typeTriangle.x = 460;
    sprites.typeTriangle.y = 450;
    sprites.typeTriangle.interactive = true;
    sprites.typeTriangle.buttonMode = true;
    this.addChild(sprites.typeTriangle);
    // typeTriangleDown
    sprites.typeTriangleDown.x = 620;
    sprites.typeTriangleDown.y = 460;
    sprites.typeTriangleDown.interactive = true;
    sprites.typeTriangleDown.buttonMode = true;
    this.addChild(sprites.typeTriangleDown);
    // typeTriangleUp
    sprites.typeTriangleUp.x = 580;
    sprites.typeTriangleUp.y = 610;
    sprites.typeTriangleUp.interactive = true;
    sprites.typeTriangleUp.buttonMode = true;
    this.addChild(sprites.typeTriangleUp);
    // typeLoss (hidden)
    sprites.typeLoss.x = 60;
    sprites.typeLoss.y = 50;
    //this.addChild(sprites.typeLoss);
    // typeWin (dynamic)
    sprites.typeWin.x = 60;
    sprites.typeWin.y = 50;
    //this.addChild(sprites.typeWin);
    
  };

  function update () {;
    const { typeCursor } = sprites;
    typeCursor.x = typeCursor.x + ( mousePosition.x - typeCursor.x ) + 6;
    typeCursor.y = typeCursor.y + ( mousePosition.y - typeCursor.y );
  };
  return { init, update };
};

export default GetTypingTestFuncs;