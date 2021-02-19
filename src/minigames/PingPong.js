import DoodleSprite from '../lib/DoodleSprite';

export const GetPingPongFuncs = () => {
  // Load textures in the array
  const texturesArray = [
  'pingBgA',
  'pingBgB',
  'pingBallA',
  'pingBallB',
  'pingHitEffectA',
  'pingHitEffectB',
  'pingEnHitEffectA',
  'pingEnHitEffectB',
  'pingPaddleA',
  'pingPaddleB',
  'pingEnPaddleA',
  'pingEnPaddleB',
  'pingWinA',
  'pingWinB',
  'pingLossA',
  'pingLossB'
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
    
    // pingBg
    sprites.pingBg.x = 125;
    sprites.pingBg.y = 120;
    this.addChild(sprites.pingBg);

    // pingBall (Dynamic)
    sprites.pingBall.x = 0;
    sprites.pingBall.y = 0;
    this.addChild(sprites.pingBall);
    // pingHitEffect (Dynamic) (Hidden)
    sprites.pingHitEffect.x = 50;
    sprites.pingHitEffect.y = 50;
    // pingEnHitEffect (Dynamic) (Hidden)
    sprites.pingEnHitEffect.x = 50;
    sprites.pingEnHitEffect.y = 50;
    // pingPaddle (Dynamic)
    sprites.pingPaddle.x = 400
    sprites.pingPaddle.y = 600;
    this.addChild(sprites.pingPaddle);
    // pingEnPaddle (Dynamic)
    sprites.pingEnPaddle.x = 400
    sprites.pingEnPaddle.y = 20;
    this.addChild(sprites.pingEnPaddle);
    // pingWin
    sprites.pingWin.alpha = 0;
    sprites.pingWin.x = 60;
    sprites.pingWin.y = 60;
    this.addChild(sprites.pingWin);
    // pingLoss
    sprites.pingLoss.alpha = 0;
    sprites.pingLoss.x = 60;
    sprites.pingLoss.y = 200;
    this.addChild(sprites.pingLoss);
  };

  function update () {;
    const { pingPaddle } = sprites;

    pingPaddle.x = pingPaddle.x + ( mousePosition.x - pingPaddle.x ) - 90;
    // prevent pingPaddle.y from going above 500Y or a certain Y point
    //pingPaddle.y = pingPaddle.y + ( mousePosition.y - pingPaddle.y ) - 100;

    // Game starts with enemy paddle hitting ball to player

    // Very simple left and right enemy movement. Make enemy stupid
    
    // Check for ball collision

    // Loss if ball > 780Y Win if ball is > 10Y    
  };
  return { init, update };
};

export default GetPingPongFuncs;