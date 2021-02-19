import DoodleSprite from '../lib/DoodleSprite';

export const GetNightPlugFuncs = () => {
  // Load textures in the array
  const texturesArray = ['plugArmDarkA', 'plugArmDarkB', 'plugArmLightA', 'plugArmLightB', 'plugSocketLightA', 'plugSocketLightB', 'plugBgA', 'plugBgB', 'plugDarknessA', 'plugSocketA', 'plugSocketB'];
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

    console.log(sprites)
    // Sprites
    // plugDarkness 
    this.addChild(sprites.plugDarkness);
    // plugBg
    sprites.plugBg.x = 400;
    sprites.plugBg.y = 800;
    sprites.plugBg.pivot.set( sprites.plugBg.width / 2, sprites.plugBg.height );
    this.addChild(sprites.plugBg);
    // plugSocket 
    sprites.plugSocket.x = Math.floor( Math.random() * ( 800 - sprites.plugSocket.width ) );
    sprites.plugSocket.y = Math.floor( Math.random() * ( 800 - sprites.plugSocket.height ) );
    this.addChild(sprites.plugSocket);
    // plugArmDark
    sprites.plugArmDark.x = 400;
    sprites.plugArmDark.y = 400;
    sprites.plugArmDark.pivot.set( sprites.plugArmDark.width / 2, sprites.plugArmDark.height / 8 );
    this.addChild(sprites.plugArmDark);
    console.log(this);
  };

  function update () {;
    const { plugArmDark, plugSocket } = sprites;
    
    plugArmDark.x = plugArmDark.x + ( mousePosition.x - plugArmDark.x ) / 10;
    plugArmDark.y = plugArmDark.y + ( mousePosition.y - plugArmDark.y ) / 10;
    if ( plugArmDark.y < plugArmDark.height / 8 + 50 ) plugArmDark.y = plugArmDark.height / 8 + 50;

    if (
      Math.abs(plugArmDark.x - plugSocket.x) <= 50 
      && Math.abs(plugArmDark.y - plugSocket.y) <= 50 
      && Math.abs(mousePosition.x - plugSocket.x) <= 50 
      && Math.abs(mousePosition.y - plugSocket.y) <= 50 
    ) {
      this.winMG();
      return; 
    }
  };
  return { init, update };
};

export default GetNightPlugFuncs;