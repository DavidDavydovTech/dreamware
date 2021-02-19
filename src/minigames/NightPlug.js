import DoodleSprite from '../lib/DoodleSprite';

export const GetNightPlugFuncs = () => {
  const sprites = {};
  function init () {
    // Get the textures we need:
    const { _appReference, timeMod } = this;
    const {
      plugArmDarkA,
      plugArmDarkB,
      plugArmLightA,
      plugArmLightB,
      plugSocketLightA,
      plugSocketLightB,
      plugBgA,
      plugBgB,
      plugDarknessA,
      plugSocketA,
      plugSocketB
    } = this._appReference.loader.resources;
    // Arm
    sprites.arm = new DoodleSprite({ 
      texture: [plugArmLightA.texture, plugArmLightB.texture], 
      app: _appReference, 
      timeMod: timeMod 
    });
    sprites.arm.x = 0;
    sprites.arm.y = 150;
    this.addChild(sprites.arm);
    // Background
    sprites.bg = new DoodleSprite({ 
      texture: [plugBgA.texture, plugBgB.texture], 
      app: _appReference, 
      timeMod: timeMod 
    });
    sprites.bg.x = 400;
    sprites.bg.y = 800;
    sprites.bg.pivot.set( sprites.bg.width / 2, sprites.bg.height );
    this.addChild(sprites.bg);
    // Socket
    sprites.socket = new DoodleSprite({ 
      texture: [plugSocketLightA.texture, plugSocketLightB.texture], 
      app: _appReference, 
      timeMod: timeMod 
    });
    sprites.socket.x = 0;
    sprites.socket.y = 150;
    this.addChild(sprites.socket);
  };

  function update () {};
  return { init, update };
};

export default GetNightPlugFuncs;