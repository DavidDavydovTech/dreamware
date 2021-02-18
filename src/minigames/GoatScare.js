import DoodleSprite from '../lib/DoodleSprite';

export const GetGoatScareFuncs = () => {
  const sprites = {};
  function init () {
    // Get the textures we need:
    const { _appReference, timeMod } = this;
    const {
      goatBgA,
      goatBgB,
      goatBushA,
      goatBushB,
      goatCalmA,
      goatCalmB, 
      goatGroundA,
      goatGroundB,
      goatScaredA, 
      goatScaredB,
      goatSneakA,
      goatSneakB,
      goatSpookA,
      goatSpookB,
    } = this._appReference.loader.resources;
    // Background
    sprites.bg = new DoodleSprite({ 
      texture: [goatBgA.texture, goatBgB.texture], 
      app: _appReference, 
      timeMod: timeMod 
    });
    sprites.bg.x = 0;
    sprites.bg.y = 150;
    this.addChild(sprites.bg);
    // Ground
    sprites.ground = new DoodleSprite({ 
      texture: [goatGroundA.texture, goatGroundB.texture], 
      app: _appReference, 
      timeMod: timeMod 
    });
    sprites.ground.x = 0;
    sprites.ground.y = 650;
    this.addChild(sprites.ground);
    // Bush
    sprites.bush = new DoodleSprite({ 
      texture: [goatBushB.texture, goatBushA.texture], 
      app: _appReference, 
      timeMod: timeMod,
    });
    sprites.bush.x = 0;
    sprites.bush.y = 505;
    this.addChild(sprites.bush);
    // Person Sneak 
    sprites.personSneak = new DoodleSprite({ 
      texture: [goatSneakB.texture, goatSneakA.texture], 
      app: _appReference, 
      timeMod: timeMod,
    });
    sprites.personSneak.x = 95;
    sprites.personSneak.y = 395;
    // this.addChild(sprites.personSneak);
    // Person Sneak 
    sprites.personSpook = new DoodleSprite({ 
      texture: [goatSpookB.texture, goatSpookA.texture],
      textureOffset: [ { x:-10, y:-15 }, { x: -10, y: -5 } ],
      app: _appReference, 
      timeMod: timeMod,
    });
    sprites.personSpook.trueX = 30;
    sprites.personSpook.trueY = 350;
    this.addChild(sprites.personSpook);
    // Goat Example
    sprites.goatSprite = new DoodleSprite({ 
      texture: [goatScaredA.texture, goatScaredB.texture, goatCalmA.texture], 
      app: _appReference, 
      timeMod: timeMod 
    });
    this.addChild(sprites.goatSprite);
    sprites.goatSprite.x = 100;
    sprites.goatSprite.y = 100;

  };

  function update () { 
    sprites.goatSprite.x += 0.2
  }

  return { init, update };
};

export default GetGoatScareFuncs;