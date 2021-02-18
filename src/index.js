import { Application, Sprite, InteractionData, Text, TextStyle, Ticker, Loader, Graphics, Container } from 'pixi.js';
import * as PixiSound from 'pixi-sound';
import Keyboard from './keyboard';
import MiniGame from './lib/MiniGame';
import DoodleSprite from './lib/DoodleSprite';
import GameHUD from './lib/GameHUD';
// Temp Import 
import GetGoatScareFuncs from './minigames/GoatScare';


const sound = PixiSound.default.sound;

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 800;
const w = SCREEN_WIDTH;
const h = SCREEN_HEIGHT;

let app = new Application({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  backgroundColor: 0xffffff,
});
document.body.appendChild(app.view);
Ticker.shared.autoStart = true;

// -- NOTE --
// commented out/removed audio use in this file due to 
// -- NOTE ---
// const loader = new Loader();
app.loader
  .add('plant_body', 'img/test_game/plant_body.png')
  .add('plant_maw_1', 'img/test_game/plant_maw_1.png')
  .add('plant_maw_2', 'img/test_game/plant_maw_2.png')
  // -- Assets needed for the HUD --
    // HUD Numbers
    .add('zeroA', 'img/hud/HUDN_0000.png')
    .add('zeroB', 'img/hud/HUDN_0001.png')
    .add('oneA', 'img/hud/HUDN_0002.png')
    .add('oneB', 'img/hud/HUDN_0003.png')
    .add('twoA', 'img/hud/HUDN_0004.png')
    .add('twoB', 'img/hud/HUDN_0005.png')
    .add('threeA', 'img/hud/HUDN_0006.png')
    .add('threeB', 'img/hud/HUDN_0007.png')
    .add('fourA', 'img/hud/HUDN_0008.png')
    .add('fourB', 'img/hud/HUDN_0009.png')
    .add('fiveA', 'img/hud/HUDN_0010.png')
    .add('fiveB', 'img/hud/HUDN_0011.png')
    .add('sixA', 'img/hud/HUDN_0012.png')
    .add('sixB', 'img/hud/HUDN_0013.png')
    .add('sevenA', 'img/hud/HUDN_0014.png')
    .add('sevenB', 'img/hud/HUDN_0015.png')
    .add('eightA', 'img/hud/HUDN_0016.png')
    .add('eightB', 'img/hud/HUDN_0017.png')
    .add('nineA', 'img/hud/HUDN_0018.png')
    .add('nineB', 'img/hud/HUDN_0019.png')
    // HUD Cloud
    .add('cloudA', 'img/hud/HUDC_0000.png')
    .add('cloudB', 'img/hud/HUDC_0001.png')
    // HUD Box
    .add('boxA', 'img/hud/HUDPLP_0000.png')
    .add('boxB', 'img/hud/HUDPLP_0001.png')
    // HUD Hearts
    .add('heartA', 'img/hud/HUDH_0000.png')
    .add('heartB', 'img/hud/HUDH_0001.png')
    .add('heartC', 'img/hud/HUDH_0002.png')
    .add('heartD', 'img/hud/HUDH_0003.png')
    .add('heartE', 'img/hud/HUDH_0004.png')
    .add('heartF', 'img/hud/HUDH_0005.png')
    .add('heartG', 'img/hud/HUDH_0006.png')
    // HUD Meter
    .add('meterA', 'img/hud/HUDM_0000.png')
    .add('meterB', 'img/hud/HUDM_0001.png')
    // HUD Sleeping Characters (Bodys)
    .add('impyA', 'img/hud/HUDPLPP_0000.png')
    .add('impyB', 'img/hud/HUDPLPP_0001.png')
    .add('clingyA', 'img/hud/HUDPLPP_0002.png')
    .add('clingyB', 'img/hud/HUDPLPP_0003.png')
    .add('miroA', 'img/hud/HUDPLPP_0004.png')
    .add('miroB', 'img/hud/HUDPLPP_0005.png')
    // HUD Sleeping Faces
      // Calm sleep
      .add('impyFaceA', 'img/hud/HUDPLN_0000.png')
      .add('impyFaceB', 'img/hud/HUDPLN_0001.png')
      .add('clingyFaceA', 'img/hud/HUDPLN_0002.png')
      .add('clingyFaceB', 'img/hud/HUDPLN_0003.png')
      .add('miroFaceA', 'img/hud/HUDPLN_0004.png')
      .add('miroFaceB', 'img/hud/HUDPLN_0005.png')
      // Anger sleep
      .add('impyFaceAngA', 'img/hud/HUDA_0000.png')
      .add('impyFaceAngB', 'img/hud/HUDA_0001.png')
      .add('impyFaceAngC', 'img/hud/HUDA_0002.png')
      .add('clingyFaceAngA', 'img/hud/HUDA2_0000.png')
      .add('clingyFaceAngB', 'img/hud/HUDA2_0001.png')
      .add('clingyFaceAngC', 'img/hud/HUDA2_0002.png')
      .add('clingyFaceAngD', 'img/hud/HUDA2_0003.png')
      .add('miroFaceAngA', 'img/hud/HUDA3_0000.png')
      .add('miroFaceAngB', 'img/hud/HUDA3_0001.png')
      .add('miroFaceAngC', 'img/hud/HUDA3_0002.png')
      .add('miroFaceAngD', 'img/hud/HUDA3_0003.png')
  // -- Goat Scare --
  .add('goatBgA', 'img/goat_scare/GOAT_BG_A.png')
  .add('goatBgB', 'img/goat_scare/GOAT_BG_B.png')
  .add('goatBushA', 'img/goat_scare/GOAT_BUSH_A.png')
  .add('goatBushB', 'img/goat_scare/GOAT_BUSH_B.png')
  .add('goatCalmA', 'img/goat_scare/GOAT_CALM_A.png')
  .add('goatCalmB', 'img/goat_scare/GOAT_CALM_B.png')
  .add('goatGroundA', 'img/goat_scare/GOAT_GROUND_A.png')
  .add('goatGroundB', 'img/goat_scare/GOAT_GROUND_B.png')
  .add('goatScaredA', 'img/goat_scare/GOAT_SCARED_A.png')
  .add('goatScaredB', 'img/goat_scare/GOAT_SCARED_B.png')
  .add('goatSneakA', 'img/goat_scare/GOAT_SNEAK_A.png')
  .add('goatSneakB', 'img/goat_scare/GOAT_SNEAK_B.png')
  .add('goatSpookA', 'img/goat_scare/GOAT_SPOOK_A.png')
  .add('goatSpookB', 'img/goat_scare/GOAT_SPOOK_B.png')


app.loader.load((loader, resources) => {
  init(loader, resources);
});

function init (loader, resources) {
  const { zeroA, zeroB } = resources;
  console.log( app.loader.resources, resources)
  // const plant_boy = new Container();
  // plant_boy.x = SCREEN_WIDTH / 2;
  // plant_boy.y = SCREEN_HEIGHT / 2;
  // app.stage.addChild(plant_boy);

  // const plant_body_sprite = new Sprite(plant_body.texture);
  // plant_boy.addChild(plant_body_sprite);
  // const plant_maw_1_sprite = new Sprite(plant_maw_1.texture);
  // plant_maw_1_sprite.x = 90;
  // plant_maw_1_sprite.y -= plant_maw_1_sprite.height - 10;
  // plant_maw_1_sprite.alpha = 0;
  // plant_boy.addChild(plant_maw_1_sprite);
  // const plant_maw_2_sprite = new Sprite(plant_maw_2.texture);
  // plant_maw_2_sprite.x = 60;
  // plant_maw_2_sprite.y -= plant_maw_2_sprite.height - 10;
  // plant_boy.addChild(plant_maw_2_sprite);

  // app.stage.addChild(plant_boy);

  const zero = new DoodleSprite({
    app,
    texture: [zeroA.texture, zeroB.texture],
    timeMod: 1,
    swapMS: 500,
  });

  app.stage.addChild(zero);
  

  // IF YOU DELETE THIS COMMENT I WILL FUCKING END YOU BORA >:C
  // NOTE: Sytax is [ song.sound.play(); ]

  // const newMG = new MiniGame({ 
  //   app: app, 
  //   timeMod: 1, 
  //   update: exampleRenderFunction, 
  //   maxMS: 5000,
  // });

  // newMG.didWin
  //   .then( won => {
  //     console.log('Won?', won)
  //     if (won === true) {
  //       alert('Won!');
  //     } else {
  //       alert('Lost :(')
  //     }
  //   })
  //   .catch( err => {
  //     console.log(err)
  //   });

  // console.log(newMG.didWin)

  // Rename init and update once making a new instance of the minigame 
  const { init, update } = GetGoatScareFuncs(); 
  const GoatScare = new MiniGame({
    app,
    init,
    update,
  });

  app.stage.addChild(GoatScare);

  const HUD = new GameHUD({ app });
  app.stage.addChild(HUD);
};