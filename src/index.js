import { Application, Sprite, InteractionData, Text, TextStyle, Ticker, Loader, Graphics, Container } from 'pixi.js';
import * as PixiSound from 'pixi-sound';
import Keyboard from './keyboard';
import MiniGame from './lib/MiniGame';
import DoodleSprite from './lib/DoodleSprite';
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
const loader = new Loader();
loader
  .add('plant_body', 'img/test_game/plant_body.png')
  .add('plant_maw_1', 'img/test_game/plant_maw_1.png')
  .add('plant_maw_2', 'img/test_game/plant_maw_2.png')
  .add('zero_a', 'img/hud/HUDPLN_0000.png')
  .add('zero_b', 'img/hud/HUDPLN_0001.png')

loader.load((loader, resources) => {
  init(loader, resources);
});

function init (loader, resources) {
  const { plant_body, plant_maw_1, plant_maw_2, zero_a, zero_b } = resources;

  const plant_boy = new Container();
  plant_boy.x = SCREEN_WIDTH / 2;
  plant_boy.y = SCREEN_HEIGHT / 2;
  app.stage.addChild(plant_boy);

  const plant_body_sprite = new Sprite(plant_body.texture);
  plant_boy.addChild(plant_body_sprite);
  const plant_maw_1_sprite = new Sprite(plant_maw_1.texture);
  plant_maw_1_sprite.x = 90;
  plant_maw_1_sprite.y -= plant_maw_1_sprite.height - 10;
  plant_maw_1_sprite.alpha = 0;
  plant_boy.addChild(plant_maw_1_sprite);
  const plant_maw_2_sprite = new Sprite(plant_maw_2.texture);
  plant_maw_2_sprite.x = 60;
  plant_maw_2_sprite.y -= plant_maw_2_sprite.height - 10;
  plant_boy.addChild(plant_maw_2_sprite);

  app.stage.addChild(plant_boy);

  const zero = new DoodleSprite({
    app,
    texture: [zero_a.texture, zero_b.texture],
    timeMod: 1,
    swapMS: 500,
  });

  app.stage.addChild(zero);
  

  // IF YOU DELETE THIS COMMENT I WILL FUCKING END YOU BORA >:C
  // NOTE: Sytax is [ song.sound.play(); ]
  const delayArray = [];
  let currentIndex = 0;
  const exampleRenderFunction = function () {
    const { totalMS } = this;
    delayArray.push({ ...app.renderer.plugins.interaction.mouse.global });

    if ( totalMS > 500 ) {
      let pos = delayArray[currentIndex];
      if (pos.hasOwnProperty('x') && pos.hasOwnProperty('y')) {
        plant_boy.x = pos.x
        plant_boy.y = pos.y
      } else {
        plant_boy.x = app.renderer.plugins.interaction.mouse.global.x;
        plant_boy.y = app.renderer.plugins.interaction.mouse.global.y
      }
      currentIndex += 1;
    }
    if (plant_boy.x >= 600 ) {
      this.winMG()
    }

    // console.log(totalMS)
    if ((totalMS % 1000) < 501) {
      plant_maw_1_sprite.alpha = 0;
      plant_maw_2_sprite.alpha = 1;
    } else {
      plant_maw_1_sprite.alpha = 1;
      plant_maw_2_sprite.alpha = 0;
    }
  }

  const newMG = new MiniGame({ 
    app: app, 
    timeMod: 1, 
    update: exampleRenderFunction, 
    maxMS: 5000,
  });
  newMG.didWin
    .then( won => {
      console.log('Won?', won)
      if (won === true) {
        alert('Won!');
      } else {
        alert('Lost :(')
      }
    })
    .catch( err => {
      console.log(err)
    });
  console.log(newMG.didWin)

  app.stage.addChild(newMG);
};