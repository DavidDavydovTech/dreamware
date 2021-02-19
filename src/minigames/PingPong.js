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

  // Extras
  let ballDirectionFlip = false;
  let didWin;

  function init () {
    this.winOnTimeout = true;
    // Get the properties we need:
    const { _appReference, timeMod } = this;
    // MUST RUN or textures don't come through.
    populateTextures(_appReference.loader.resources);
    populateSprites(textures, { app: _appReference, timeMod });
    populateMousePosition( _appReference );

    // Sprites
    this.didWin.then( won => { didWin = won; });
    // pingHitEffect (Dynamic) (Hidden)
    sprites.pingHitEffect.alpha = 0;
    sprites.pingHitEffect.x = 50;
    sprites.pingHitEffect.y = 50;
    this.addChild(sprites.pingEnPaddle);
    // pingEnHitEffect (Dynamic) (Hidden)
    sprites.pingEnHitEffect.alpha = 0;
    sprites.pingEnHitEffect.x = 50;
    sprites.pingEnHitEffect.y = 50;
    this.addChild(sprites.pingEnPaddle);
    // pingEnPaddle (Dynamic)
    sprites.pingEnPaddle.x = 300
    sprites.pingEnPaddle.y = 20;
    this.addChild(sprites.pingEnPaddle);
    // pingBg
    sprites.pingBg.x = 125;
    sprites.pingBg.y = 120;
    this.addChild(sprites.pingBg);
    // pingBall (Dynamic)
    sprites.pingBall.x = sprites.pingEnPaddle.x + 50;
    sprites.pingBall.y = sprites.pingEnPaddle.y + 30;
    this.addChild(sprites.pingBall);
    // pingPaddle (Dynamic)
    sprites.pingPaddle.x = 400
    sprites.pingPaddle.y = 600;
    this.addChild(sprites.pingPaddle);
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
  
  let didEnd = false;
  let pingPongMS = 1000;
  let pingPongXTarget = 100;
  let pingPingXLast = 100;


  function update () {;
    const { pingPaddle, pingEnPaddle, pingBall } = sprites;
    const { deltaMS } = this;
    let pingPongDelta = deltaMS / pingPongMS

    pingPaddle.x = pingPaddle.x + ( mousePosition.x - pingPaddle.x ) - 90;
    // prevent pingPaddle.y from going above 500Y or a certain Y point
    //pingPaddle.y = pingPaddle.y + ( mousePosition.y - pingPaddle.y ) - 100;

    pingEnPaddle.x += ( pingBall.x - pingEnPaddle.x ) / ( 1000 / ( this.totalMS / ( this.difficulty )) + 1);

    // Game starts with enemy paddle hitting ball to player
      // eventually make enemy mess up easily
    // Ball bounce handling
    if (ballDirectionFlip === false) { // enemy turn
      sprites.pingBall.y += 600 * pingPongDelta;
      // first uses default x then start reflecting other x
    } 
    else { // player turn
      sprites.pingBall.y -= 600 * pingPongDelta;
      // reflect x
    }
    
    sprites.pingBall.x += (pingPongXTarget - pingPingXLast) * pingPongDelta;
    // Collision checking
    // make the ball bounce to the opposite end and somewhat shift angle
    // Player collision
    if (sprites.pingBall.x < sprites.pingPaddle.x + sprites.pingPaddle.width &&
      sprites.pingBall.x + sprites.pingBall.width > sprites.pingPaddle.x &&
      sprites.pingBall.y < sprites.pingPaddle.y + (sprites.pingPaddle.height - 40) &&
      sprites.pingBall.y + (sprites.pingBall.height - 40) > sprites.pingPaddle.y) {
    // Play hit effect and do some DeltaMS wait thing
      
      ballDirectionFlip = true;
    }
    // Enemy collision
    if (sprites.pingBall.x < sprites.pingEnPaddle.x + sprites.pingEnPaddle.width &&
      sprites.pingBall.x + sprites.pingBall.width > sprites.pingEnPaddle.x &&
      sprites.pingBall.y < sprites.pingEnPaddle.y + (sprites.pingEnPaddle.height - 65) &&
      sprites.pingBall.y + (sprites.pingBall.height - 65) > sprites.pingEnPaddle.y) {
    // Play enemy hit effect and do some DeltaMS wait thing
    pingPingXLast = sprites.pingBall.x;
    pingPongXTarget = Math.floor( Math.random() * 400 + 200 );

    ballDirectionFlip = false;
    }
    // Loss if ball > 790Y Win if ball is < 5Y
    if (sprites.pingBall.y > 790) {
      this.failMG();
    } else if ( sprites.pingBall.y < 5 ) {
      this.winMG();
    }

    if ( didWin === false ) {
      console.log('WON')
      if ( didEnd === false ) { 
        this.maxMS = this.maxMS + 2000
        //console.log('lost!')
        sprites.pingBall.alpha = 0;
        sprites.pingBg.alpha = 0;
        sprites.pingPaddle.alpha = 0;
        sprites.pingEnPaddle.alpha = 0;
        sprites.pingLoss.alpha = 1;
        didEnd = true;
      }
    } else if ( didWin === true || sprites.pingBall.y < 5) {
      console.log('WON')
      if ( didEnd === false ) {
        didEnd = true;
        this.winOnTimeout = true;
        //console.log('win screen');
        sprites.pingBall.alpha = 0;
        sprites.pingBg.alpha = 0;
        sprites.pingPaddle.alpha = 0;
        sprites.pingEnPaddle.alpha = 0;
        sprites.pingWin.alpha = 1;
      } 
    }
  };
  return { init, update };
};

export default GetPingPongFuncs;